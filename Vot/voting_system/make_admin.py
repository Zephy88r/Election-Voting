#!/usr/bin/env python3
"""
Script to make a user admin
Usage: python make_admin.py <username>
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

def make_admin(username):
    try:
        user = User.objects.get(username=username)
        user.is_admin = True
        user.save()
        print(f"✅ User '{username}' is now an admin")
        return True
    except User.DoesNotExist:
        print(f"❌ User '{username}' not found")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python make_admin.py <username>")
        sys.exit(1)
    
    username = sys.argv[1]
    make_admin(username)