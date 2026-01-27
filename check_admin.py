#!/usr/bin/env python
import os
import sys
import django

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if admin exists
admin = User.objects.filter(username='admin').first()

if admin:
    print("✅ Admin user exists!")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Is Staff: {admin.is_staff}")
    print(f"   Is Superuser: {admin.is_superuser}")
else:
    print("❌ Admin user does not exist!")
    print("\nCreating admin user...")
    admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print(f"✅ Created superuser: {admin.username}")
