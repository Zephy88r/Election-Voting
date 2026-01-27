import requests
import json
from urllib.parse import urljoin

BASE_URL = 'http://127.0.0.1:8000'
HEADERS = {'Content-Type': 'application/json'}

print('=== Testing Voting with CSRF ===\n')

# Create session
session = requests.Session()

# First request to get CSRF token
print('1. Getting CSRF token...')
response = session.get(f'{BASE_URL}/elections/api/voter/login/')
csrf_token = session.cookies.get('csrftoken')
if csrf_token:
    print(f'   ✓ CSRF token obtained: {csrf_token[:10]}...')
else:
    print('   ✗ No CSRF token found in cookies')
    print(f'   Cookies: {session.cookies}')

# Register
print('\n2. Registering test voter...')
reg_data = {
    'name': 'Vote Test User 2',
    'email': 'votertest2@example.com',
    'password': 'TestPassword123!',
    'province_id': 'Province 1',
    'district_id': 'Bhojpur',
    'electoral_area': 'Bhojpur Area'
}

response = session.post(f'{BASE_URL}/elections/api/voter/register/', 
                        json=reg_data, headers=HEADERS)
print(f'   Status: {response.status_code}')

# Login
print('\n3. Logging in...')
login_data = {
    'email': 'votertest2@example.com',
    'password': 'TestPassword123!'
}

response = session.post(f'{BASE_URL}/elections/api/voter/login/', 
                       json=login_data, headers=HEADERS)
print(f'   Status: {response.status_code}')
csrf_token = session.cookies.get('csrftoken')
print(f'   CSRF token after login: {csrf_token[:10] if csrf_token else "None"}...')

# Get candidates
print('\n4. Getting candidates...')
response = session.get(f'{BASE_URL}/elections/api/candidates/')
candidates = response.json() if response.status_code == 200 else []
print(f'   Found {len(candidates)} candidates')

# Get parties
print('\n5. Getting parties...')
response = session.get(f'{BASE_URL}/elections/api/parties/')
parties = response.json() if response.status_code == 200 else []
print(f'   Found {len(parties)} parties')

# Test FPTP vote
if candidates:
    print('\n6. Testing FPTP Vote Submission...')
    candidate_id = candidates[0]['id']
    
    # Prepare form data
    vote_data = {
        'vote_type': 'FPTP',
        'candidate_id': str(candidate_id)
    }
    
    # Add CSRF token to headers
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    
    response = session.post(f'{BASE_URL}/elections/vote/submit/', 
                           data=vote_data,
                           headers=headers)
    print(f'   Status: {response.status_code}')
    print(f'   Content-Type: {response.headers.get("content-type")}')
    print(f'   Response text: {response.text[:200]}')
    
    if response.status_code in [200, 201]:
        try:
            print(f'   Response: {response.json()}')
            print('   ✓ FPTP vote submitted successfully')
        except:
            print(f'   Response (plain): {response.text}')
    else:
        print(f'   ✗ Vote submission failed')

print('\n=== Test Complete ===')
