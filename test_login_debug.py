import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

print('Testing Login with Different Credentials\n')
print('=' * 60)

# Test 1: Try logging in with a known user
print('\n[Test 1] Login with testuser@example.com (known to work)')
login_data = {
    'email': 'testuser@example.com',
    'password': 'TestPassword123!'
}

response = requests.post(
    f'{BASE_URL}/elections/api/voter/login/',
    json=login_data,
    headers={'Content-Type': 'application/json'}
)

print(f'Status: {response.status_code}')
print(f'Response: {response.json()}')

if response.status_code == 200:
    print('✓ Login successful')
else:
    print('✗ Login failed')

# Test 2: Try with wrong password
print('\n[Test 2] Login with wrong password')
login_data = {
    'email': 'testuser@example.com',
    'password': 'WrongPassword'
}

response = requests.post(
    f'{BASE_URL}/elections/api/voter/login/',
    json=login_data,
    headers={'Content-Type': 'application/json'}
)

print(f'Status: {response.status_code}')
print(f'Response: {response.json()}')

# Test 3: Check what the registration page sent
print('\n[Test 3] Get all users and their info')
print('Users that can be used for login:')
for user in ['testuser@example.com', 'votertest@example.com', 'votertest2@example.com', 'fulljourney@example.com']:
    print(f'  - Email: {user}')
    print(f'    Password: TestPassword123! (or as you set it during registration)')

print('\n[Test 4] Direct database check')
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model
User = get_user_model()

# Try to authenticate
user = authenticate(username='testuser@example.com', password='TestPassword123!')
if user:
    print(f'✓ Backend authentication works for testuser@example.com')
else:
    print(f'✗ Backend authentication FAILED for testuser@example.com')
    print(f'  Trying to check user directly...')
    try:
        user = User.objects.get(username='testuser@example.com')
        print(f'  User exists: {user.username}')
        print(f'  Checking password...')
        if user.check_password('TestPassword123!'):
            print(f'  ✓ Password is correct')
        else:
            print(f'  ✗ Password is incorrect')
    except User.DoesNotExist:
        print(f'  ✗ User does not exist')
