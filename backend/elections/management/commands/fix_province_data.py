"""
Management command to fix users incorrectly assigned to Province 1
due to the hardcoded fallback bug in authService.js
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from elections.models import Province, District, ElectoralArea

User = get_user_model()

class Command(BaseCommand):
    help = 'Fix users incorrectly assigned to Province 1 due to frontend fallback bug'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be changed without making changes',
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Fix specific user by email',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        specific_email = options['email']
        
        # Get Province 1 and Bhojpur (the hardcoded defaults)
        try:
            province_1 = Province.objects.get(name='Province 1')
            bhojpur_district = District.objects.get(name='Bhojpur', province=province_1)
            bhojpur_area = ElectoralArea.objects.get(name='Bhojpur Area', province=province_1)
        except (Province.DoesNotExist, District.DoesNotExist, ElectoralArea.DoesNotExist):
            self.stdout.write(
                self.style.ERROR('Could not find Province 1, Bhojpur district, or Bhojpur Area')
            )
            return

        # Find users with the hardcoded defaults
        query = User.objects.filter(
            province=province_1,
            district=bhojpur_district,
            electoral_area=bhojpur_area
        )
        
        if specific_email:
            query = query.filter(email=specific_email)
            
        affected_users = query.all()
        
        if not affected_users:
            self.stdout.write(
                self.style.SUCCESS('No users found with hardcoded Province 1 defaults')
            )
            return
            
        self.stdout.write(f'Found {len(affected_users)} users with hardcoded defaults:')
        
        for user in affected_users:
            self.stdout.write(f'  - {user.email} (ID: {user.id})')
            
        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN: No changes made. Remove --dry-run to apply fixes.')
            )
            return
            
        # Since we can't automatically determine the correct province,
        # we'll need manual intervention or additional data
        self.stdout.write(
            self.style.WARNING(
                'MANUAL INTERVENTION REQUIRED:\n'
                'These users need to be manually reassigned to their correct provinces.\n'
                'You can:\n'
                '1. Contact each user to confirm their correct province\n'
                '2. Use Django admin to update their province/district/electoral_area\n'
                '3. Ask users to re-register with correct information\n'
                '\n'
                'To update a user manually:\n'
                'python manage.py shell\n'
                '>>> from django.contrib.auth import get_user_model\n'
                '>>> from elections.models import Province, District, ElectoralArea\n'
                '>>> User = get_user_model()\n'
                '>>> user = User.objects.get(email="user@example.com")\n'
                '>>> province = Province.objects.get(name="Province 2")\n'
                '>>> district = District.objects.get(name="Bara", province=province)\n'
                '>>> electoral_area = ElectoralArea.objects.get(name="Bara Area", province=province)\n'
                '>>> user.province = province\n'
                '>>> user.district = district\n'
                '>>> user.electoral_area = electoral_area\n'
                '>>> user.save()\n'
            )
        )