#!/usr/bin/env python
"""
Create test user with province data
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model
from elections.models import Province, District, ElectoralArea

User = get_user_model()

def create_test_user():
    """Create a test user with proper province data"""
    
    # Get province data
    try:
        province = Province.objects.get(name="Province 1")
        district = District.objects.filter(province=province).first()
        electoral_area = ElectoralArea.objects.filter(province=province).first()
        
        print(f"Found province: {province.name}")
        print(f"Found district: {district.name if district else 'None'}")
        print(f"Found electoral area: {electoral_area.name if electoral_area else 'None'}")
        
        # Create or update test user
        email = "test@example.com"
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                'email': email,
                'first_name': 'Test User',
                'province': province,
                'district': district,
                'electoral_area': electoral_area,
            }
        )
        
        if not created:
            # Update existing user
            user.province = province
            user.district = district
            user.electoral_area = electoral_area
            user.save()
        
        # Set password
        user.set_password('TestPass@123')
        user.save()
        
        print(f"{'Created' if created else 'Updated'} test user: {email}")
        print(f"Province: {user.province}")
        print(f"District: {user.district}")
        print(f"Electoral Area: {user.electoral_area}")
        
        return user
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    create_test_user()