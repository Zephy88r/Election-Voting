import requests
import json

BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/elections/api"

session = requests.Session()

# Test with email
print("Testing login with EMAIL...")
response = session.post(
    f"{API_BASE}/auth/login/",
    json={"email": "voter1@test.com", "password": "testpass123"},
    headers={"Content-Type": "application/json"}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 200:
    print("SUCCESS - Email login works!")
else:
    print("FAILED - Email login failed")

# Test with username
print("\nTesting login with USERNAME...")
response2 = session.post(
    f"{API_BASE}/auth/login/",
    json={"voterId": "voter1", "password": "testpass123"},
    headers={"Content-Type": "application/json"}
)

print(f"Status: {response2.status_code}")
print(f"Response: {response2.json()}")

if response2.status_code == 200:
    print("SUCCESS - Username login works!")
else:
    print("FAILED - Username login failed")
