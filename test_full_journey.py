import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

print('=' * 60)
print('FULL USER JOURNEY TEST: Register → Login → Vote')
print('=' * 60)

session = requests.Session()

# Step 1: Registration
print('\n[1] USER REGISTRATION')
print('-' * 60)

reg_data = {
    'name': 'Full Journey Test User',
    'email': 'fulljourney@example.com',
    'password': 'JourneyTest123!',
    'province_id': 'Province 1',
    'district_id': 'Morang',
    'electoral_area': 'Morang Area'
}

print(f'Registering with email: {reg_data["email"]}')
response = session.post(f'{BASE_URL}/elections/api/voter/register/', 
                        json=reg_data, headers={'Content-Type': 'application/json'})

if response.status_code == 201:
    print('✓ Registration successful')
else:
    print(f'✗ Registration failed: {response.status_code}')
    print(f'  Error: {response.json()}')

# Step 2: Login
print('\n[2] USER LOGIN')
print('-' * 60)

login_data = {
    'email': 'fulljourney@example.com',
    'password': 'JourneyTest123!'
}

print(f'Logging in with email: {login_data["email"]}')
response = session.post(f'{BASE_URL}/elections/api/voter/login/', 
                       json=login_data, headers={'Content-Type': 'application/json'})

if response.status_code == 200:
    print('✓ Login successful')
    csrf_token = session.cookies.get('csrftoken')
    if csrf_token:
        print(f'  CSRF Token: {csrf_token[:15]}...')
else:
    print(f'✗ Login failed: {response.status_code}')
    print(f'  Error: {response.json()}')
    exit(1)

# Step 3: Get user profile
print('\n[3] GET USER PROFILE')
print('-' * 60)

response = session.get(f'{BASE_URL}/elections/api/voter/profile/')

if response.status_code == 200:
    profile = response.json()
    print('✓ Profile retrieved')
    print(f'  Username: {profile.get("username")}')
    print(f'  Province: {profile.get("province", {}).get("name")}')
    print(f'  District: {profile.get("district", {}).get("name")}')
    print(f'  Electoral Area: {profile.get("electoral_area", {}).get("name")}')
else:
    print(f'✗ Failed to get profile: {response.status_code}')

# Step 4: Get candidates
print('\n[4] GET CANDIDATES FOR YOUR ELECTORAL AREA')
print('-' * 60)

response = session.get(f'{BASE_URL}/elections/api/candidates/')

if response.status_code == 200:
    candidates = response.json()
    print(f'✓ Found {len(candidates)} candidates')
    if candidates:
        for i, candidate in enumerate(candidates[:3], 1):
            print(f'  {i}. {candidate.get("name")} (ID: {candidate.get("id")})')
        if len(candidates) > 3:
            print(f'  ... and {len(candidates) - 3} more')
else:
    print(f'✗ Failed to get candidates: {response.status_code}')

# Step 5: Get parties
print('\n[5] GET PARTIES FOR PR VOTING')
print('-' * 60)

response = session.get(f'{BASE_URL}/elections/api/parties/')

if response.status_code == 200:
    parties = response.json()
    print(f'✓ Found {len(parties)} parties')
    if parties:
        for i, party in enumerate(parties[:3], 1):
            print(f'  {i}. {party.get("name")} (ID: {party.get("id")})')
        if len(parties) > 3:
            print(f'  ... and {len(parties) - 3} more')
else:
    print(f'✗ Failed to get parties: {response.status_code}')

# Step 6: Submit FPTP vote
print('\n[6] SUBMIT FPTP VOTE (First-Past-The-Post)')
print('-' * 60)

if candidates:
    candidate_id = candidates[0]['id']
    candidate_name = candidates[0]['name']
    
    vote_data = {
        'vote_type': 'FPTP',
        'candidate_id': str(candidate_id)
    }
    
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    
    print(f'Voting for: {candidate_name}')
    response = session.post(f'{BASE_URL}/elections/vote/submit/', 
                           data=vote_data, headers=headers)
    
    if response.status_code in [200, 201]:
        result = response.json()
        print('✓ FPTP vote submitted successfully')
        print(f'  Response: {result.get("success", "Vote recorded")}')
    else:
        print(f'✗ FPTP vote submission failed: {response.status_code}')
        print(f'  Error: {response.json()}')
else:
    print('✗ No candidates available')

# Step 7: Submit PR vote
print('\n[7] SUBMIT PR VOTE (Proportional Representation)')
print('-' * 60)

if parties:
    party_id = parties[0]['id']
    party_name = parties[0]['name']
    
    vote_data = {
        'vote_type': 'PR',
        'party_id': str(party_id)
    }
    
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    
    print(f'Voting for party: {party_name}')
    response = session.post(f'{BASE_URL}/elections/vote/submit/', 
                           data=vote_data, headers=headers)
    
    if response.status_code in [200, 201]:
        result = response.json()
        print('✓ PR vote submitted successfully')
        print(f'  Response: {result.get("success", "Vote recorded")}')
    else:
        print(f'✗ PR vote submission failed: {response.status_code}')
        error = response.json().get('error', 'Unknown error')
        print(f'  Error: {error}')
else:
    print('✗ No parties available')

# Step 8: Logout
print('\n[8] USER LOGOUT')
print('-' * 60)

response = session.post(f'{BASE_URL}/elections/api/voter/logout/')

if response.status_code == 200:
    print('✓ Logout successful')
else:
    print(f'✗ Logout failed: {response.status_code}')

print('\n' + '=' * 60)
print('FULL USER JOURNEY TEST COMPLETE ✓')
print('=' * 60)
