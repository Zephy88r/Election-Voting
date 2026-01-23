from django.core.management.base import BaseCommand
from django.utils import timezone
from elections.models import ElectionControl

class Command(BaseCommand):
    help = 'Open voting for the election'

    def handle(self, *args, **options):
        control, created = ElectionControl.objects.get_or_create(
            defaults={
                'is_voting_open': True,
                'opened_at': timezone.now()
            }
        )
        
        if not created:
            control.is_voting_open = True
            control.opened_at = timezone.now()
            control.closed_at = None
            control.save()
        
        self.stdout.write(
            self.style.SUCCESS('Voting is now OPEN')
        )