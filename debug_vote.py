#!/usr/bin/env python
"""
Debug vote submission for real user
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
from elections.models import FPTPVote, PRVote, Candidate, Party

User = get_user_model()
BASE_URL = "http://127.0.0.1:8000"

def test_real_user_vote():
    """Test voting with real user email"""
    
    # Get real user
    user = User.objects.get(email='sadi@gmail.com')
    print(f"Testing vote for user: {user.email}")
    print(f"User province: {user.province}")
    print(f"User district: {user.district}")
    print(f"User electoral area: {user.electoral_area}")
    
    # Get a candidate from user's electoral area
    candidate = user.electoral_area.candidates.first()
    if not candidate:
        print("ERROR: No candidates in user's electoral area")
        return
    
    print(f"Voting for candidate: {candidate.name}")
    
    # Get a party
    party = Party.objects.filter(is_active=True).first()
    if not party:
        print("ERROR: No active parties")
        return
    
    print(f"Voting for party: {party.name}")
    
    # Test FPTP vote submission (simulate frontend FormData)
    vote_data = {
        'vote_type': 'FPTP',
        'candidate_id': str(candidate.id),
        'user_email': user.email
    }
    
    print(f"Submitting FPTP vote data: {vote_data}")
    response = requests.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data)
    print(f"FPTP Response: {response.status_code} - {response.text}")
    
    # Test PR vote submission
    vote_data = {
        'vote_type': 'PR',
        'party_id': str(party.id),
        'user_email': user.email
    }
    
    print(f"Submitting PR vote data: {vote_data}")
    response = requests.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data)
    print(f"PR Response: {response.status_code} - {response.text}")
    
    # Check database
    fptp_votes = FPTPVote.objects.filter(voter=user).count()
    pr_votes = PRVote.objects.filter(voter=user).count()
    print(f"Database check - FPTP votes: {fptp_votes}, PR votes: {pr_votes}")

if __name__ == "__main__":
    test_real_user_vote()