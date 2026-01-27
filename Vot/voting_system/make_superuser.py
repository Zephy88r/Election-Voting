#!/usr/bin/env python3
"""
Script to make a user superuser (full admin permissions)
Usage: python make_superuser.py <username>
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from elections.models import User

def make_superuser(username):
    try:
        user = User.objects.get(username=username)
        user.is_superuser = True
        user.is_staff = True
        user.is_admin = True
        user.save()
        print(f"✅ User '{username}' is now a superuser with full admin permissions")
        return True
    except User.DoesNotExist:
        print(f"❌ User '{username}' not found")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python make_superuser.py <username>")
        sys.exit(1)
    
    username = sys.argv[1]
    make_superuser(username)