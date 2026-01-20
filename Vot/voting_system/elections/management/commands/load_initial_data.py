from django.core.management.base import BaseCommand
from elections.models import Province, District, ElectoralArea, Party, Candidate, ElectionControl

class Command(BaseCommand):
    help = 'Load initial data for testing'

    def handle(self, *args, **options):
        # Create provinces
        provinces = [
            {'id': 1, 'name': 'Province 1'},
            {'id': 2, 'name': 'Province 2'},
            {'id': 3, 'name': 'Province 3'},
        ]
        for p in provinces:
            Province.objects.get_or_create(id=p['id'], defaults={'name': p['name']})

        # Create districts
        districts = [
            {'id': 1, 'name': 'District 1', 'province_id': 1},
            {'id': 2, 'name': 'District 2', 'province_id': 1},
            {'id': 3, 'name': 'District 1', 'province_id': 3},
        ]
        for d in districts:
            District.objects.get_or_create(id=d['id'], defaults={'name': d['name'], 'province_id': d['province_id']})

        # Create electoral areas
        areas = [
            {'id': 1, 'name': 'Area 1', 'province_id': 1},
            {'id': 2, 'name': 'Area 2', 'province_id': 3},
        ]
        for a in areas:
            ElectoralArea.objects.get_or_create(id=a['id'], defaults={'name': a['name'], 'province_id': a['province_id']})

        # Create parties
        parties = [
            {'id': 1, 'name': 'Party A', 'symbol': 'A'},
            {'id': 2, 'name': 'Party B', 'symbol': 'B'},
        ]
        for p in parties:
            Party.objects.get_or_create(id=p['id'], defaults={'name': p['name'], 'symbol': p['symbol']})

        # Create candidates
        candidates = [
            {'id': 1, 'name': 'Candidate 1', 'electoral_area_id': 1},
            {'id': 2, 'name': 'Candidate 2', 'electoral_area_id': 1},
        ]
        for c in candidates:
            Candidate.objects.get_or_create(id=c['id'], defaults={'name': c['name'], 'electoral_area_id': c['electoral_area_id']})

        # Create election control
        ElectionControl.objects.get_or_create(id=1, defaults={'is_voting_open': True})

        self.stdout.write(self.style.SUCCESS('Initial data loaded successfully'))