#!/usr/bin/env python
import os
import sys
import django

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

# Check if admin exists
admin = User.objects.filter(username='admin').first()

if not admin:
    print("❌ Admin user does not exist!")
    print("Creating admin user...")
    admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print(f"✅ Created admin: {admin.username}")
else:
    print(f"✅ Admin user exists: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Is Staff: {admin.is_staff}")
    print(f"   Is Superuser: {admin.is_superuser}")

# Test authentication
print("\n" + "=" * 60)
print("TESTING AUTHENTICATION")
print("=" * 60)

user = authenticate(username='admin', password='admin')
if user:
    print(f"✅ Authentication successful for: {user.username}")
else:
    print("❌ Authentication failed with password 'admin'")
    print("\nTrying to reset password...")
    admin.set_password('admin')
    admin.save()
    print("✅ Password reset to 'admin'")
    
    # Test again
    user = authenticate(username='admin', password='admin')
    if user:
        print(f"✅ Authentication now works!")
    else:
        print("❌ Still failing - this is strange")
