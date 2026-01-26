# Create initial data for testing
from django.core.management.base import BaseCommand
from elections.models import ElectionControl, Province, District, ElectoralArea, Party, Candidate

class Command(BaseCommand):
    help = 'Create initial test data'

    def handle(self, *args, **options):
        # Enable voting
        control, created = ElectionControl.objects.get_or_create(defaults={'is_voting_open': True})
        if not created:
            control.is_voting_open = True
            control.save()
        
        # Create provinces
        koshi, _ = Province.objects.get_or_create(name='Koshi')
        
        # Create districts
        jhapa, _ = District.objects.get_or_create(name='Jhapa', province=koshi)
        morang, _ = District.objects.get_or_create(name='Morang', province=koshi)
        
        # Create electoral areas
        ea1, _ = ElectoralArea.objects.get_or_create(name='Koshi Electoral Area 1', province=koshi)
        ea2, _ = ElectoralArea.objects.get_or_create(name='Koshi Electoral Area 2', province=koshi)
        
        # Create parties
        nc, _ = Party.objects.get_or_create(name='Nepali Congress', defaults={'symbol': 'NC', 'is_active': True})
        uml, _ = Party.objects.get_or_create(name='CPN UML', defaults={'symbol': 'UML', 'is_active': True})
        rsp, _ = Party.objects.get_or_create(name='Rastra Swatantra Party (RSP)', defaults={'symbol': 'RSP', 'is_active': True})
        
        # Create candidates
        Candidate.objects.get_or_create(name='Ram Shrestha', electoral_area=ea1, defaults={'party': nc})
        Candidate.objects.get_or_create(name='Sita Tamang', electoral_area=ea1, defaults={'party': uml})
        Candidate.objects.get_or_create(name='Hari Gurung', electoral_area=ea2, defaults={'party': rsp})
        
        self.stdout.write(self.style.SUCCESS('Successfully created initial data'))