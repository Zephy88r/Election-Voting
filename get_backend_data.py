import requests
import json

BASE_URL = 'http://127.0.0.1:8000'
HEADERS = {'Content-Type': 'application/json'}

print('=== Fetching All Backend Data ===\n')

# Fetch provinces
print('1. PROVINCES:')
try:
    response = requests.get(f'{BASE_URL}/elections/api/candidates/', headers=HEADERS)
    print(f'   (Note: No direct province endpoint, fetching from admin)')
except Exception as e:
    print(f'   Error: {e}')

# Fetch parties
print('\n2. PARTIES:')
try:
    response = requests.get(f'{BASE_URL}/elections/api/parties/', headers=HEADERS)
    if response.status_code == 200:
        parties = response.json()
        print(f'   Total: {len(parties)} parties')
        for party in parties:
            print(f'   - ID: {party["id"]}, Name: {party["name"]}, Symbol: {party["symbol"]}')
    else:
        print(f'   Error: {response.status_code}')
except Exception as e:
    print(f'   Error: {e}')

# Fetch candidates (requires login)
print('\n3. CANDIDATES:')
print('   Getting candidates (requires login)...')

# Login first
login_data = {
    'email': 'testuser@example.com',
    'password': 'TestPassword123!'
}

session = requests.Session()
response = session.post(f'{BASE_URL}/elections/api/voter/login/', 
                       json=login_data, headers=HEADERS)

if response.status_code == 200:
    print('   ✓ Logged in')
    response = session.get(f'{BASE_URL}/elections/api/candidates/', headers=HEADERS)
    if response.status_code == 200:
        candidates = response.json()
        print(f'   Total: {len(candidates)} candidates for user\'s electoral area')
        for candidate in candidates:
            print(f'   - ID: {candidate["id"]}, Name: {candidate["name"]}')
    else:
        print(f'   Error fetching candidates: {response.status_code}')
else:
    print(f'   Error logging in: {response.status_code}')

# Get user profile to see their region
print('\n4. USER PROFILE (Electoral Area):')
response = session.get(f'{BASE_URL}/elections/api/voter/profile/', headers=HEADERS)
if response.status_code == 200:
    profile = response.json()
    print(f'   User: {profile["username"]}')
    print(f'   Province: {profile["province"]["name"]}')
    print(f'   District: {profile["district"]["name"]}')
    print(f'   Electoral Area: {profile["electoral_area"]["name"]}')
else:
    print(f'   Error: {response.status_code}')

print('\n=== Data Fetch Complete ===')
