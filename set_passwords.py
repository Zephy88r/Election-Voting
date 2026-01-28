#!/usr/bin/env python
"""
Set known passwords for test users
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def set_test_passwords():
    """Set known passwords for test users"""
    test_users = [
        ('daru@gmail.com', 'test123'),
        ('fata@gmail.com', 'test123'),
        ('ankit@gmail.com', 'test123'),
        ('sadi@gmail.com', 'test123'),
    ]
    
    for email, password in test_users:
        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            print(f"Set password for {email}: {password}")
            print(f"  Province: {user.province.name if user.province else 'None'}")
        except User.DoesNotExist:
            print(f"User {email} not found")

if __name__ == '__main__':
    set_test_passwords()
    print("\nTest users ready:")
    print("- daru@gmail.com / test123 (Province 2)")
    print("- fata@gmail.com / test123 (Province 2)")  
    print("- ankit@gmail.com / test123 (Province 3)")
    print("- sadi@gmail.com / test123 (Province 1)")