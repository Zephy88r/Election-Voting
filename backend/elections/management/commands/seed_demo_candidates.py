from django.core.management.base import BaseCommand

from elections.models import Candidate, ElectoralArea, Party


class Command(BaseCommand):
    help = (
        "Reset and seed demo candidates so they are consistently linked to the "
        "current electoral areas."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--per-area",
            type=int,
            default=3,
            help="Number of demo candidates to create per electoral area (default: 3).",
        )

    def handle(self, *args, **options):
        per_area = options["per_area"]

        self.stdout.write("Deleting existing candidates...")
        deleted_count, _ = Candidate.objects.all().delete()
        self.stdout.write(f"Deleted {deleted_count} candidate rows.")

        parties = list(Party.objects.all())

        created_total = 0
        for area in ElectoralArea.objects.select_related("province", "district"):
            for i in range(1, per_area + 1):
                party = parties[(created_total + i) % len(parties)] if parties else None
                name = f"Candidate {i} - {area.name}"
                Candidate.objects.create(
                    name=name,
                    electoral_area=area,
                    party=party,
                )
                created_total += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_total} demo candidates across "
                f"{ElectoralArea.objects.count()} electoral areas."
            )
        )

