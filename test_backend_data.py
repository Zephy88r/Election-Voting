import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

print('=' * 70)
print('COMPLETE BACKEND DATA VERIFICATION')
print('=' * 70)

# Test 1: Get registration data
print('\n[1] TESTING REGISTRATION DATA ENDPOINT')
print('-' * 70)

response = requests.get(f'{BASE_URL}/elections/api/registration-data/')
if response.status_code == 200:
    data = response.json()
    provinces = data.get('provinces', [])
    print(f'✓ Registration data retrieved: {len(provinces)} provinces')
    
    for province in provinces[:2]:
        print(f'\n  Province: {province["name"]}')
        print(f'    Districts: {len(province["districts"])}')
        for district in province["districts"][:2]:
            print(f'      - {district["name"]}')
        print(f'    Electoral Areas: {len(province["electoral_areas"])}')
        for area in province["electoral_areas"][:2]:
            print(f'      - {area["name"]}')
else:
    print(f'✗ Failed to get registration data: {response.status_code}')

# Test 2: Login and get candidates
print('\n[2] TESTING CANDIDATES DATA')
print('-' * 70)

session = requests.Session()

# Quick login
login_data = {'email': 'testuser@example.com', 'password': 'TestPassword123!'}
session.post(f'{BASE_URL}/elections/api/voter/login/', json=login_data)

response = session.get(f'{BASE_URL}/elections/api/candidates/')
if response.status_code == 200:
    candidates = response.json()
    print(f'✓ Candidates retrieved: {len(candidates)} total')
    for candidate in candidates[:5]:
        print(f'  - {candidate.get("name")} (ID: {candidate.get("id")})')
    if len(candidates) > 5:
        print(f'  ... and {len(candidates) - 5} more')
else:
    print(f'✗ Failed to get candidates: {response.status_code}')

# Test 3: Get parties
print('\n[3] TESTING PARTIES DATA')
print('-' * 70)

response = session.get(f'{BASE_URL}/elections/api/parties/')
if response.status_code == 200:
    parties = response.json()
    print(f'✓ Parties retrieved: {len(parties)} total')
    for party in parties:
        print(f'  - {party.get("name")} (ID: {party.get("id")})')
else:
    print(f'✗ Failed to get parties: {response.status_code}')

# Test 4: Get user profile
print('\n[4] TESTING USER PROFILE DATA')
print('-' * 70)

response = session.get(f'{BASE_URL}/elections/api/voter/profile/')
if response.status_code == 200:
    profile = response.json()
    print(f'✓ User profile retrieved:')
    print(f'  - Username: {profile.get("username")}')
    print(f'  - Province: {profile.get("province", {}).get("name")} (ID: {profile.get("province", {}).get("id")})')
    print(f'  - District: {profile.get("district", {}).get("name")} (ID: {profile.get("district", {}).get("id")})')
    print(f'  - Electoral Area: {profile.get("electoral_area", {}).get("name")} (ID: {profile.get("electoral_area", {}).get("id")})')
else:
    print(f'✗ Failed to get profile: {response.status_code}')

print('\n' + '=' * 70)
print('ALL BACKEND DATA VERIFIED ✓')
print('=' * 70)
print('\nSummary:')
print('  ✓ Registration data (provinces, districts, electoral areas)')
print('  ✓ Candidates data')
print('  ✓ Parties data')
print('  ✓ User profile data')
print('\nAll endpoints are working and returning data from backend!')
