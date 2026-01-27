#!/usr/bin/env python
"""
Create Admin User Script
Fixes admin panel access issue by creating a superuser
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin_user():
    """Create admin user for accessing admin panel"""
    
    # Admin credentials
    admin_username = "admin"
    admin_email = "admin@nepalvoting.gov.np"
    admin_password = "admin123"
    
    try:
        # Check if admin already exists
        if User.objects.filter(username=admin_username).exists():
            print(f"[OK] Admin user '{admin_username}' already exists")
            admin_user = User.objects.get(username=admin_username)
        else:
            # Create admin user
            admin_user = User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password
            )
            print(f"[OK] Created admin user: {admin_username}")
        
        # Ensure user is superuser and staff
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.is_active = True
        admin_user.save()
        
        print(f"[OK] Admin panel access configured")
        print(f"  Username: {admin_username}")
        print(f"  Password: {admin_password}")
        print(f"  URL: http://127.0.0.1:8000/admin/")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error creating admin user: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("CREATING ADMIN USER FOR ADMIN PANEL ACCESS")
    print("=" * 50)
    
    success = create_admin_user()
    
    if success:
        print("\n[SUCCESS] Admin user created!")
        print("You can now access the admin panel at: http://127.0.0.1:8000/admin/")
    else:
        print("\n[FAILED] Could not create admin user")