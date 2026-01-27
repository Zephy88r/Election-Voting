import requests
import json

BASE_URL = 'http://127.0.0.1:8000'
HEADERS = {'Content-Type': 'application/json'}

print('=== Testing Nepal Election Voting System ===\n')

# Test 1: Check if backend is running
print('1. Testing Backend Connection...')
try:
    response = requests.get(f'{BASE_URL}')
    print(f'   ✓ Backend is running: {response.status_code}')
except Exception as e:
    print(f'   ✗ Backend error: {e}')

# Test 2: Test registration endpoint
print('\n2. Testing User Registration...')
reg_data = {
    'name': 'Test User',
    'email': 'testuser@example.com',
    'password': 'TestPassword123!',
    'province_id': 'Province 1',
    'district_id': 'Bhojpur',
    'electoral_area': 'Bhojpur Area'
}

try:
    response = requests.post(f'{BASE_URL}/elections/api/voter/register/', 
                            json=reg_data, headers=HEADERS)
    print(f'   Status: {response.status_code}')
    print(f'   Response: {response.json()}')
    if response.status_code == 201:
        print('   ✓ Registration successful')
    else:
        print(f'   ✗ Registration failed')
except Exception as e:
    print(f'   ✗ Error: {e}')

# Test 3: Test login endpoint
print('\n3. Testing User Login...')
login_data = {
    'email': 'testuser@example.com',
    'password': 'TestPassword123!'
}

session = requests.Session()
try:
    response = session.post(f'{BASE_URL}/elections/api/voter/login/', 
                           json=login_data, headers=HEADERS)
    print(f'   Status: {response.status_code}')
    print(f'   Response: {response.json()}')
    if response.status_code == 200:
        print('   ✓ Login successful')
    else:
        print(f'   ✗ Login failed')
except Exception as e:
    print(f'   ✗ Error: {e}')

# Test 4: Get user profile
print('\n4. Testing Get User Profile...')
try:
    response = session.get(f'{BASE_URL}/elections/api/voter/profile/', headers=HEADERS)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        print(f'   ✓ Profile retrieved: {response.json()}')
    else:
        print(f'   ✗ Profile failed: {response.json()}')
except Exception as e:
    print(f'   ✗ Error: {e}')

# Test 5: Get candidates
print('\n5. Testing Get Candidates...')
try:
    response = session.get(f'{BASE_URL}/elections/api/candidates/', headers=HEADERS)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        candidates = response.json()
        print(f'   ✓ Candidates retrieved: {len(candidates)} candidates')
    else:
        print(f'   Response: {response.json()}')
except Exception as e:
    print(f'   ✗ Error: {e}')

# Test 6: Get parties
print('\n6. Testing Get Parties...')
try:
    response = session.get(f'{BASE_URL}/elections/api/parties/', headers=HEADERS)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        parties = response.json()
        print(f'   ✓ Parties retrieved: {len(parties)} parties')
    else:
        print(f'   Response: {response.json()}')
except Exception as e:
    print(f'   ✗ Error: {e}')

print('\n=== Test Complete ===')
