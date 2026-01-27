import requests
import json

BASE_URL = 'http://127.0.0.1:8000'
HEADERS = {'Content-Type': 'application/json'}

print('=== Testing Voting Endpoints ===\n')

# First, register and login a test user
print('1. Registering test voter...')
reg_data = {
    'name': 'Vote Test User',
    'email': 'votertest@example.com',
    'password': 'TestPassword123!',
    'province_id': 'Province 1',
    'district_id': 'Bhojpur',
    'electoral_area': 'Bhojpur Area'
}

response = requests.post(f'{BASE_URL}/elections/api/voter/register/', 
                        json=reg_data, headers=HEADERS)
print(f'   Registration: {response.status_code}')

# Login
print('\n2. Logging in...')
login_data = {
    'email': 'votertest@example.com',
    'password': 'TestPassword123!'
}

session = requests.Session()
response = session.post(f'{BASE_URL}/elections/api/voter/login/', 
                       json=login_data, headers=HEADERS)
print(f'   Login: {response.status_code}')

# Get candidates
print('\n3. Getting candidates...')
response = session.get(f'{BASE_URL}/elections/api/candidates/', headers=HEADERS)
if response.status_code == 200:
    candidates = response.json()
    print(f'   ✓ Found {len(candidates)} candidates')
    if candidates:
        first_candidate = candidates[0]
        print(f'   First candidate: {first_candidate}')
        candidate_id = first_candidate.get('id')
    else:
        print('   No candidates found')
else:
    print(f'   Error: {response.status_code}')

# Get parties
print('\n4. Getting parties...')
response = session.get(f'{BASE_URL}/elections/api/parties/', headers=HEADERS)
if response.status_code == 200:
    parties = response.json()
    print(f'   ✓ Found {len(parties)} parties')
    if parties:
        first_party = parties[0]
        print(f'   First party: {first_party}')
        party_id = first_party.get('id')
    else:
        print('   No parties found')
else:
    print(f'   Error: {response.status_code}')

# Test FPTP vote (only if we have candidates)
if candidates:
    print('\n5. Testing FPTP Vote Submission...')
    vote_data = {
        'vote_type': 'FPTP',
        'candidate_id': candidate_id
    }
    
    response = session.post(f'{BASE_URL}/elections/vote/submit/', 
                           data=vote_data)
    print(f'   Status: {response.status_code}')
    print(f'   Response: {response.json()}')
    if response.status_code == 201:
        print('   ✓ FPTP vote submitted successfully')
    else:
        print('   ✗ FPTP vote submission failed')
else:
    print('\n5. Skipping FPTP vote (no candidates)')

# Test PR vote (only if we have parties)
if parties and len(parties) > 0:
    print('\n6. Testing PR Vote Submission...')
    vote_data = {
        'vote_type': 'PR',
        'party_id': party_id
    }
    
    response = session.post(f'{BASE_URL}/elections/vote/submit/', 
                           data=vote_data)
    print(f'   Status: {response.status_code}')
    print(f'   Response: {response.json()}')
    if response.status_code == 201:
        print('   ✓ PR vote submitted successfully')
    else:
        print('   ✗ PR vote submission failed')
else:
    print('\n6. Skipping PR vote (no parties)')

print('\n=== Voting Test Complete ===')
