#!/usr/bin/env python
"""
Test the new vote endpoint with email authentication
"""

import os
import sys
import django
import requests
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model
from elections.models import Candidate, Party

User = get_user_model()

BASE_URL = "http://127.0.0.1:8000"
TEST_EMAIL = f"vote_test_{int(datetime.now().timestamp())}@example.com"

def test_vote_endpoint():
    print("Testing new vote endpoint...")
    
    # 1. Register user
    reg_data = {
        "name": "Vote Test User",
        "email": TEST_EMAIL,
        "password": "TestPass@123",
        "province_id": "Province 1",
        "district_id": "Bhojpur",
        "electoral_area": "Bhojpur Area",
    }
    
    response = requests.post(f"{BASE_URL}/elections/api/voter/register/", json=reg_data)
    print(f"Registration: {response.status_code}")
    
    if response.status_code != 201:
        print(f"Registration failed: {response.text}")
        return
    
    # 2. Get a candidate
    candidates = Candidate.objects.all()
    if not candidates:
        print("No candidates found")
        return
    
    candidate = candidates[0]
    print(f"Using candidate: {candidate.name} (ID: {candidate.id})")
    
    # 3. Test vote submission with email
    vote_data = {
        "vote_type": "FPTP",
        "candidate_id": str(candidate.id),
        "user_email": TEST_EMAIL,
    }
    
    print(f"Sending vote data: {vote_data}")
    
    response = requests.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data)
    print(f"Vote response: {response.status_code}")
    print(f"Response text: {response.text}")
    
    if response.status_code == 201:
        print("SUCCESS: Vote submitted!")
    else:
        print(f"FAILED: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_vote_endpoint()