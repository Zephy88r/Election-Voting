import json
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count

from elections.models import (
    Province,
    District,
    ElectoralArea,
)


class Command(BaseCommand):
    help = (
        "Idempotent seeding/fixing of provinces, districts (77), and electoral areas "
        "based on a canonical Nepal dataset and electoral_area_counts.json."
    )

    # Canonical province → districts mapping (77 districts total)
    CANONICAL_DISTRICTS = {
        "Province 1": [
            "Bhojpur",
            "Dhankuta",
            "Ilam",
            "Jhapa",
            "Khotang",
            "Morang",
            "Okhaldhunga",
            "Panchthar",
            "Sankhuwasabha",
            "Solukhumbu",
            "Sunsari",
            "Taplejung",
            "Terhathum",
            "Udayapur",
        ],
        "Province 2": [
            "Bara",
            "Dhanusa",
            "Mahottari",
            "Parsa",
            "Rautahat",
            "Saptari",
            "Sarlahi",
            "Siraha",
        ],
        "Province 3": [
            "Bhaktapur",
            "Chitwan",
            "Dhading",
            "Dolakha",
            "Kathmandu",
            "Kavrepalanchok",
            "Lalitpur",
            "Makwanpur",
            "Nuwakot",
            "Ramechhap",
            "Rasuwa",
            "Sindhuli",
            "Sindhupalchok",
        ],
        "Province 4": [
            "Baglung",
            "Gorkha",
            "Kaski",
            "Lamjung",
            "Manang",
            "Mustang",
            "Myagdi",
            "Nawalpur",
            "Parbat",
            "Syangja",
            "Tanahun",
        ],
        "Province 5": [
            "Arghakhanchi",
            "Banke",
            "Bardiya",
            "Dang",
            "Gulmi",
            "Kapilvastu",
            "Nawalparasi West",
            "Palpa",
            "Pyuthan",
            "Rolpa",
            "Rupandehi",
        ],
        "Province 6": [
            "Dailekh",
            "Dolpa",
            "Humla",
            "Jumla",
            "Kalikot",
            "Mugu",
            "Rukum West",
            "Salyan",
            "Surkhet",
        ],
        "Province 7": [
            "Achham",
            "Bajhang",
            "Bajura",
            "Baitadi",
            "Dadeldhura",
            "Darchula",
            "Doti",
            "Kailali",
            "Kanchanpur",
        ],
    }

    INVALID_DISTRICTS = {"Pithoragarh", "Araria"}

    @property
    def allowed_district_names(self):
        names = []
        for districts in self.CANONICAL_DISTRICTS.values():
            names.extend(districts)
        return set(names)

    def handle(self, *args, **options):
        with transaction.atomic():
            self.stdout.write(self.style.WARNING("Starting location reseed..."))

            self._ensure_provinces()
            self._fix_spelling_udayapur()
            self._delete_invalid_districts()
            self._ensure_canonical_districts()
            self._drop_non_canonical_districts()

            counts = self._load_or_create_electoral_area_counts()
            self._reseed_electoral_areas(counts)

            self._print_validation_summary(counts)

            self.stdout.write(self.style.SUCCESS("Location reseed completed."))

    # -------------------------
    # Province & district fixes
    # -------------------------

    def _ensure_provinces(self):
        """
        Ensure all 7 provinces exist (keeps existing naming scheme 'Province X').
        """
        for province_name in self.CANONICAL_DISTRICTS.keys():
            Province.objects.get_or_create(name=province_name)

    def _fix_spelling_udayapur(self):
        """
        Rename Udaypur → Udayapur at the district level, merging if necessary.
        """
        try:
            correct = District.objects.get(name="Udayapur")
        except District.DoesNotExist:
            correct = None

        udaypur_qs = District.objects.filter(name="Udaypur")
        for wrong in udaypur_qs:
            if correct and wrong.id != correct.id:
                # Re-point any related electoral areas to the correct district
                ElectoralArea.objects.filter(district=wrong).update(district=correct)
                wrong.delete()
            else:
                wrong.name = "Udayapur"
                wrong.save(update_fields=["name"])

    def _delete_invalid_districts(self):
        """
        Remove clearly invalid districts (Indian districts) and cascade dependents.
        """
        District.objects.filter(name__in=self.INVALID_DISTRICTS).delete()

    def _ensure_canonical_districts(self):
        """
        Upsert districts so that:
        - each canonical district exists exactly once
        - is assigned to the correct province
        - duplicates (same name) are merged into a single row
        """
        for province_name, districts in self.CANONICAL_DISTRICTS.items():
            province = Province.objects.get(name=province_name)

            for district_name in districts:
                qs = District.objects.filter(name=district_name)

                if not qs.exists():
                    District.objects.create(name=district_name, province=province)
                    continue

                # If multiple, keep the first and delete the rest after re-pointing
                primary = qs.order_by("id").first()
                if primary.province_id != province.id:
                    primary.province = province
                    primary.save(update_fields=["province"])

                for duplicate in qs.exclude(id=primary.id):
                    ElectoralArea.objects.filter(district=duplicate).update(
                        district=primary
                    )
                    duplicate.delete()

    def _drop_non_canonical_districts(self):
        """
        Delete any district not in the official 77-district list.
        """
        District.objects.exclude(name__in=self.allowed_district_names).delete()

    # -------------------------
    # Electoral areas
    # -------------------------

    def _load_or_create_electoral_area_counts(self):
        """
        Load electoral_area_counts.json; if missing, create with placeholder 1s.
        """
        path = os.path.join(settings.BASE_DIR, "electoral_area_counts.json")

        if not os.path.exists(path):
            data = {
                "__comment": "TODO: Replace placeholder counts with official FPTP constituency "
                "counts from the Election Commission Nepal for each district.",
                "counts": {name: 1 for name in sorted(self.allowed_district_names)},
            }
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return data["counts"]

        with open(path, "r", encoding="utf-8") as f:
            loaded = json.load(f)

        counts = loaded.get("counts", loaded)

        # Ensure all 77 districts have a value (default to 1 if missing)
        for name in self.allowed_district_names:
            counts.setdefault(name, 1)

        return counts

    def _make_code_prefix(self, district_name: str) -> str:
        """
        Convert district name into deterministic code prefix.
        Example: 'Nawalparasi West' -> 'NAWALPARASIWEST'
        """
        return district_name.upper().replace(" ", "")

    def _reseed_electoral_areas(self, counts):
        """
        Idempotently create/update electoral areas per district based on counts mapping.
        Old/non-deterministic areas are removed.
        """
        # Start from a clean slate to avoid legacy rows and duplicates.
        ElectoralArea.objects.all().delete()

        for province_name, districts in self.CANONICAL_DISTRICTS.items():
            province = Province.objects.get(name=province_name)

            for district_name in districts:
                district = District.objects.get(name=district_name)
                n_areas = int(counts.get(district_name, 1))

                code_prefix = self._make_code_prefix(district_name)

                for n in range(1, n_areas + 1):
                    code = f"{code_prefix}-{n}"
                    name = f"{district_name} Electoral Area {n}"

                    ElectoralArea.objects.create(
                        code=code,
                        name=name,
                        area_number=n,
                        district=district,
                        province=province,
                    )

    # -------------------------
    # Validation summary
    # -------------------------

    def _print_validation_summary(self, counts):
        total_districts = District.objects.count()

        expected_total_eas = sum(
            int(counts.get(name, 1)) for name in self.allowed_district_names
        )
        total_electoral_areas = ElectoralArea.objects.count()

        invalid_districts_count = District.objects.exclude(
            name__in=self.allowed_district_names
        ).count()

        ea_without_district = ElectoralArea.objects.filter(
            district__isnull=True
        ).count()

        duplicate_codes = (
            ElectoralArea.objects.values("code")
            .annotate(c=Count("id"))
            .filter(c__gt=1)
            .count()
        )

        self.stdout.write(f"total districts = {total_districts}")
        self.stdout.write(
            f"total electoral areas = {total_electoral_areas} "
            f"(expected {expected_total_eas})"
        )
        self.stdout.write(
            f"any invalid district names found = {invalid_districts_count}"
        )
        self.stdout.write(
            f"any electoral_areas without valid district_id = {ea_without_district}"
        )
        self.stdout.write(
            f"any duplicate electoral area codes = {duplicate_codes}"
        )

