from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q

from elections.models import Province, District, ElectoralArea, Party, Candidate


class Command(BaseCommand):
    help = (
        "Add missing districts (Sunsari, Tanahun) and their electoral areas + candidates "
        "to bring total to 77 districts."
    )

    MISSING_DISTRICTS = [
        {
            "name": "Sunsari",
            "province_name": "Province 1",
        },
        {
            "name": "Tanahun",
            "province_name": "Province 4",
        },
    ]

    CANDIDATES_CONFIG = {
        "Sunsari": [
            {"name": "Sagar Koirala", "party_patterns": ["Nepali Congress"]},
            {"name": "Rina Chaudhary", "party_patterns": ["CPN-UML", "CPN UML"]},
            {
                "name": "Bikash Rai",
                "party_patterns": [
                    "CPN (Maoist Centre)",
                    "CPN-Maoist Centre",
                    "CPN-Maoist",
                    "CPN Maoist Centre",
                ],
            },
        ],
        "Tanahun": [
            {"name": "Prakash Gurung", "party_patterns": ["Nepali Congress"]},
            {"name": "Sita Adhikari", "party_patterns": ["CPN-UML", "CPN UML"]},
            {
                "name": "Nabin Thapa",
                "party_patterns": [
                    "CPN (Maoist Centre)",
                    "CPN-Maoist Centre",
                    "CPN-Maoist",
                    "CPN Maoist Centre",
                ],
            },
        ],
    }

    def handle(self, *args, **options):
        with transaction.atomic():
            self.stdout.write(
                self.style.WARNING("Adding missing districts and electoral areas...")
            )

            for district_config in self.MISSING_DISTRICTS:
                self._add_district(district_config)
                self._add_electoral_area(district_config["name"])
                self._add_candidates(district_config["name"])

            self._print_validation_summary()

            self.stdout.write(self.style.SUCCESS("Missing locations added successfully."))

    def _add_district(self, config):
        """Idempotently add district if it doesn't exist."""
        district_name = config["name"]
        province_name = config["province_name"]

        # Case-insensitive lookup
        existing = District.objects.filter(
            name__iexact=district_name
        ).first()

        if existing:
            # Ensure correct province
            province = Province.objects.get(name=province_name)
            if existing.province_id != province.id:
                existing.province = province
                existing.save(update_fields=["province"])
                self.stdout.write(
                    f"  Updated {district_name} province to {province_name}"
                )
            else:
                self.stdout.write(f"  District {district_name} already exists")
            return existing

        province = Province.objects.get(name=province_name)
        district = District.objects.create(name=district_name, province=province)
        self.stdout.write(
            self.style.SUCCESS(f"  Created district: {district_name} ({province_name})")
        )
        return district

    def _add_electoral_area(self, district_name):
        """Idempotently add electoral area for district."""
        district = District.objects.get(name__iexact=district_name)
        province = district.province

        code = f"{district_name.upper().replace(' ', '')}-1"
        name = f"{district_name} Electoral Area 1"

        electoral_area, created = ElectoralArea.objects.get_or_create(
            code=code,
            defaults={
                "name": name,
                "area_number": 1,
                "district": district,
                "province": province,
            },
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f"  Created electoral area: {name} ({code})")
            )
        else:
            # Update if district/province changed
            if (
                electoral_area.district_id != district.id
                or electoral_area.province_id != province.id
            ):
                electoral_area.district = district
                electoral_area.province = province
                electoral_area.name = name
                electoral_area.area_number = 1
                electoral_area.save()
                self.stdout.write(f"  Updated electoral area: {name}")
            else:
                self.stdout.write(f"  Electoral area {code} already exists")

        return electoral_area

    def _find_party(self, patterns):
        """
        Find party by trying patterns in order.
        Returns Party instance or None if not found.
        """
        for pattern in patterns:
            # Try exact match first
            party = Party.objects.filter(name=pattern).first()
            if party:
                return party

            # Try case-insensitive match
            party = Party.objects.filter(name__iexact=pattern).first()
            if party:
                return party

            # Try contains match (for variations)
            party = Party.objects.filter(name__icontains=pattern).first()
            if party:
                return party

        return None

    def _add_candidates(self, district_name):
        """Idempotently add candidates for district's electoral area."""
        district = District.objects.get(name__iexact=district_name)
        electoral_area = ElectoralArea.objects.get(
            district=district, area_number=1
        )

        candidates_config = self.CANDIDATES_CONFIG[district_name]
        expected_names = {c["name"] for c in candidates_config}

        # Get existing candidates for this electoral area
        existing_candidates = {
            c.name: c
            for c in Candidate.objects.filter(electoral_area=electoral_area)
        }

        # Remove any candidates that shouldn't be here (from demo seeding)
        for existing_name, existing_candidate in existing_candidates.items():
            if existing_name not in expected_names:
                existing_candidate.delete()
                self.stdout.write(
                    f"    Removed unexpected candidate: {existing_name}"
                )

        # Add/update expected candidates
        for candidate_config in candidates_config:
            candidate_name = candidate_config["name"]
            party_patterns = candidate_config["party_patterns"]

            # Check if candidate already exists for this electoral area
            existing = Candidate.objects.filter(
                name=candidate_name, electoral_area=electoral_area
            ).first()

            # Find party
            party = self._find_party(party_patterns)
            if not party:
                self.stdout.write(
                    self.style.WARNING(
                        f"    Party not found for patterns {party_patterns}, "
                        f"creating candidate without party"
                    )
                )

            if existing:
                # Update party if needed
                if party and existing.party_id != party.id:
                    existing.party = party
                    existing.save(update_fields=["party"])
                    self.stdout.write(
                        f"    Updated candidate {candidate_name} party to {party.name}"
                    )
                elif not party and existing.party_id is not None:
                    existing.party = None
                    existing.save(update_fields=["party"])
                    self.stdout.write(
                        f"    Updated candidate {candidate_name} to remove party"
                    )
                else:
                    self.stdout.write(
                        f"    Candidate {candidate_name} already exists correctly"
                    )
            else:
                Candidate.objects.create(
                    name=candidate_name,
                    electoral_area=electoral_area,
                    party=party,
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f"    Created candidate: {candidate_name}"
                        + (f" ({party.name})" if party else " (no party)")
                    )
                )

    def _print_validation_summary(self):
        """Print validation output as specified."""
        total_districts = District.objects.count()
        total_electoral_areas = ElectoralArea.objects.count()

        # Check Sunsari
        sunsari = District.objects.filter(name__iexact="Sunsari").first()
        sunsari_exists = sunsari is not None
        sunsari_province_1 = (
            sunsari.province.name == "Province 1" if sunsari else False
        )

        # Check Tanahun
        tanahun = District.objects.filter(name__iexact="Tanahun").first()
        tanahun_exists = tanahun is not None
        tanahun_province_4 = (
            tanahun.province.name == "Province 4" if tanahun else False
        )

        # Check electoral areas
        sunsari_ea = (
            ElectoralArea.objects.filter(code="SUNSARI-1").first() if sunsari else None
        )
        tanahun_ea = (
            ElectoralArea.objects.filter(code="TANAHUN-1").first() if tanahun else None
        )

        # Count candidates
        sunsari_candidates_count = (
            Candidate.objects.filter(electoral_area=sunsari_ea).count()
            if sunsari_ea
            else 0
        )
        tanahun_candidates_count = (
            Candidate.objects.filter(electoral_area=tanahun_ea).count()
            if tanahun_ea
            else 0
        )

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("VALIDATION SUMMARY")
        self.stdout.write("=" * 60)
        self.stdout.write(f"districts count = {total_districts}")
        self.stdout.write(f"electoral areas count = {total_electoral_areas}")
        self.stdout.write(f"Sunsari exists and is Province 1 = {sunsari_exists and sunsari_province_1}")
        self.stdout.write(f"Tanahun exists and is Province 4 = {tanahun_exists and tanahun_province_4}")
        self.stdout.write(
            f"Sunsari-1 has exactly 3 candidates = {sunsari_candidates_count == 3} "
            f"(actual: {sunsari_candidates_count})"
        )
        self.stdout.write(
            f"Tanahun-1 has exactly 3 candidates = {tanahun_candidates_count == 3} "
            f"(actual: {tanahun_candidates_count})"
        )
        self.stdout.write("=" * 60)
