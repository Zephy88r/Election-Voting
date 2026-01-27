import requests

BASE_URL = 'http://127.0.0.1:8000'

login_data = {
    'email': 'demo@example.com',
    'password': 'Demo@12345'
}

response = requests.post(
    f'{BASE_URL}/elections/api/voter/login/',
    json=login_data,
    headers={'Content-Type': 'application/json'}
)

print('Login Test for demo@example.com')
print('=' * 50)
print(f'Status: {response.status_code}')
print(f'Response: {response.json()}')

if response.status_code == 200:
    print('\n✓ Login successful!')
    print('You can now use these credentials:')
    print('  Email: demo@example.com')
    print('  Password: Demo@12345')
else:
    print('\n✗ Login failed')
