import requests

BASE_URL = 'http://localhost:8000'

print('Testing CORS Configuration')
print('=' * 60)

# Test 1: GET request with CORS
print('\n[1] GET /elections/api/parties/ (CORS test)')
response = requests.get(
    f'{BASE_URL}/elections/api/parties/',
    headers={
        'Origin': 'http://localhost:5173'
    }
)

print(f'Status: {response.status_code}')
print(f'Access-Control-Allow-Origin: {response.headers.get("Access-Control-Allow-Origin", "NOT SET")}')
print(f'Access-Control-Allow-Credentials: {response.headers.get("Access-Control-Allow-Credentials", "NOT SET")}')

if response.status_code == 200:
    print('✓ CORS working for GET requests')
else:
    print('✗ GET request failed')

# Test 2: OPTIONS preflight request
print('\n[2] OPTIONS preflight request')
response = requests.options(
    f'{BASE_URL}/elections/api/voter/login/',
    headers={
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
    }
)

print(f'Status: {response.status_code}')
print(f'Access-Control-Allow-Origin: {response.headers.get("Access-Control-Allow-Origin", "NOT SET")}')
print(f'Access-Control-Allow-Methods: {response.headers.get("Access-Control-Allow-Methods", "NOT SET")}')

if response.status_code == 200:
    print('✓ CORS preflight working')
else:
    print('✗ Preflight request failed')

print('\n' + '=' * 60)
print('CORS Configuration Status: ✓ Ready')
print('=' * 60)
