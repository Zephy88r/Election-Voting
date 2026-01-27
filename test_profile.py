#!/usr/bin/env python
"""
Test user profile data after login
"""

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def test_user_profile():
    """Test user profile data"""
    
    # Test with the test user we created
    email = "test@example.com"
    password = "TestPass@123"
    
    print(f"Testing login with: {email}")
    
    # Test login API
    session = requests.Session()
    login_data = {
        "email": email,
        "password": password
    }
    
    response = session.post("http://127.0.0.1:8000/elections/api/voter/login/", json=login_data)
    print(f"Login response: {response.status_code}")
    
    if response.status_code == 200:
        print("Login successful!")
        
        # Test profile API
        profile_response = session.get("http://127.0.0.1:8000/elections/api/voter/profile/")
        print(f"Profile response: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print("Profile data:")
            import json
            print(json.dumps(profile_data, indent=2))
        else:
            print(f"Profile error: {profile_response.text}")
    else:
        print(f"Login error: {response.text}")

if __name__ == "__main__":
    test_user_profile()