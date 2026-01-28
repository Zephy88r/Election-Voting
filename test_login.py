#!/usr/bin/env python
"""
Test script to check users and test login functionality
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
from elections.models import Province, District, ElectoralArea

User = get_user_model()

def test_login():
    print("=== USER LOGIN TEST ===")
    
    # Check if any users exist
    users = User.objects.all()
    print(f"Total users in database: {users.count()}")
    
    if users.count() == 0:
        print("No users found. Creating test user...")
        create_test_user()
        users = User.objects.all()
    
    # List all users
    print("\nExisting users:")
    for user in users:
        print(f"  - Email: {user.email}")
        print(f"    Username: {user.username}")
        print(f"    Province: {user.province.name if user.province else 'None'}")
        print(f"    District: {user.district.name if user.district else 'None'}")
        print(f"    Electoral Area: {user.electoral_area.name if user.electoral_area else 'None'}")
        print(f"    Is Active: {user.is_active}")
        print()
    
    # Test login with first user
    if users.exists():
        test_user = users.first()
        print(f"Testing login with: {test_user.email}")
        
        # Try to authenticate (this won't work because we don't know the password)
        # But we can check if the user exists and is active
        print(f"User exists: {User.objects.filter(username=test_user.email).exists()}")
        print(f"User is active: {test_user.is_active}")
        
        # Test with common passwords
        test_passwords = ['password', 'test123', 'admin', '123456']
        for pwd in test_passwords:
            auth_user = authenticate(username=test_user.email, password=pwd)
            if auth_user:
                print(f"✅ Login successful with password: {pwd}")
                return
            else:
                print(f"❌ Login failed with password: {pwd}")
        
        print("❌ Could not authenticate with any test password")

def create_test_user():
    """Create a test user for login testing"""
    try:
        # Get or create Province 2
        province, _ = Province.objects.get_or_create(name='Province 2')
        district, _ = District.objects.get_or_create(name='Bara', province=province)
        electoral_area, _ = ElectoralArea.objects.get_or_create(name='Bara Area', province=province)
        
        # Create test user
        user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='test123',
            first_name='Test User',
            province=province,
            district=district,
            electoral_area=electoral_area
        )
        print(f"✅ Created test user: {user.email} with password: test123")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")

if __name__ == '__main__':
    test_login()