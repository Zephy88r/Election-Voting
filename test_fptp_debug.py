import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

print('=' * 60)
print('TESTING FPTP VOTE SPECIFICALLY')
print('=' * 60)

session = requests.Session()

# Register new user
print('\n[1] Registering new voter...')
reg_data = {
    'name': 'FPTP Test User',
    'email': 'fptptest@example.com',
    'password': 'FPTPTest123!',
    'province_id': 'Province 1',
    'district_id': 'Morang',
    'electoral_area': 'Morang Area'
}

response = session.post(f'{BASE_URL}/elections/api/voter/register/', 
                        json=reg_data, headers={'Content-Type': 'application/json'})
print(f'   Status: {response.status_code}')

# Login
print('\n[2] Logging in...')
login_data = {
    'email': 'fptptest@example.com',
    'password': 'FPTPTest123!'
}

response = session.post(f'{BASE_URL}/elections/api/voter/login/', 
                       json=login_data, headers={'Content-Type': 'application/json'})
print(f'   Status: {response.status_code}')
csrf_token = session.cookies.get('csrftoken')

# Get candidates
print('\n[3] Getting candidates...')
response = session.get(f'{BASE_URL}/elections/api/candidates/')
candidates = response.json() if response.status_code == 200 else []
print(f'   Found {len(candidates)} candidates')

# Try FPTP vote with integer candidate ID
if candidates:
    print('\n[4] Submitting FPTP vote...')
    candidate = candidates[0]
    candidate_id = candidate['id']
    
    print(f'   Candidate: {candidate["name"]} (ID: {candidate_id}, type: {type(candidate_id).__name__})')
    
    # Try different ways of sending the candidate_id
    vote_data = {
        'vote_type': 'FPTP',
        'candidate_id': candidate_id  # Try as integer/original type
    }
    
    print(f'   Vote data: {vote_data}')
    
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    
    response = session.post(f'{BASE_URL}/elections/vote/submit/', 
                           data=vote_data, headers=headers)
    
    print(f'   Status: {response.status_code}')
    print(f'   Response: {response.text[:500]}')
    
    if response.status_code in [200, 201]:
        try:
            print(f'   Result: {response.json()}')
        except:
            pass
else:
    print('   No candidates found')

print('\n' + '=' * 60)
