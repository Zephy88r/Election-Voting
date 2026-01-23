#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append('Vot/voting_system')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from elections.models import Party, Vote
import json

def test_vote_api():
    client = Client()
    User = get_user_model()
    
    # Get test user
    user = User.objects.get(username='ankit@gmail.com')
    
    # Login the user
    client.force_login(user)
    
    # Clear any existing votes for this user
    Vote.objects.filter(voter=user).delete()
    
    # Get a party to vote for
    party = Party.objects.first()
    
    print(f"Testing vote for party: {party.name} (ID: {party.id})")
    
    # Submit vote
    response = client.post('/elections/api/vote/', 
                          data=json.dumps({
                              'vote_type': 'PR',
                              'party_id': party.id
                          }),
                          content_type='application/json')
    
    print(f"Response status: {response.status_code}")
    print(f"Response content: {response.content.decode()}")
    
    # Check if vote was created
    votes = Vote.objects.filter(voter=user, vote_type='PR')
    print(f"Votes in database: {votes.count()}")
    
    if votes.exists():
        vote = votes.first()
        print(f"✅ Vote successfully created!")
        print(f"   - Vote ID: {vote.id}")
        print(f"   - Party: {vote.party.name}")
        print(f"   - Province: {vote.province.name}")
        print(f"   - Created: {vote.created_at}")
    else:
        print("❌ No vote found in database")

if __name__ == '__main__':
    test_vote_api()