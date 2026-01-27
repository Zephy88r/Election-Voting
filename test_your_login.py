#!/usr/bin/env python
"""
Test your actual login session
"""

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

BASE_URL = "http://127.0.0.1:8000"

def test_your_login():
    """Test login with your actual credentials"""
    
    session = requests.Session()
    
    # Login with your credentials
    login_data = {
        "email": "sadi@gmail.com",
        "password": "sadi123"  # Replace with your actual password
    }
    
    print("Testing login...")
    response = session.post(f"{BASE_URL}/elections/api/voter/login/", json=login_data)
    print(f"Login response: {response.status_code} - {response.text}")
    
    if response.status_code != 200:
        print("Login failed!")
        return
    
    # Test getting candidates (should work with session)
    print("\nTesting candidates endpoint...")
    response = session.get(f"{BASE_URL}/elections/api/candidates/")
    print(f"Candidates response: {response.status_code} - {response.text[:200]}")
    
    # Test vote submission with session auth
    if response.status_code == 200:
        candidates = response.json()
        if candidates:
            candidate = candidates[0]
            print(f"\nTesting vote submission for candidate: {candidate['name']}")
            
            vote_data = {
                'vote_type': 'FPTP',
                'candidate_id': str(candidate['id'])
            }
            
            response = session.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data)
            print(f"Vote response: {response.status_code} - {response.text}")
        else:
            print("No candidates available")
    
    # Test with user_email parameter
    print("\nTesting vote submission with user_email...")
    vote_data = {
        'vote_type': 'FPTP',
        'candidate_id': '1',
        'user_email': 'sadi@gmail.com'
    }
    
    response = session.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data)
    print(f"Vote with email response: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_your_login()