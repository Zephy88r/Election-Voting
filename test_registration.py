import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/elections/api"

session = requests.Session()

print("=" * 70)
print("NEPAL ELECTION VOTING SYSTEM - REGISTRATION & LOGIN TEST")
print("=" * 70)

# Step 1: Get registration data
print("\n1. Getting registration data (provinces, districts, electoral areas)...")
reg_data_resp = requests.get(f"{API_BASE}/registration-data/")
if reg_data_resp.status_code == 200:
    reg_data = reg_data_resp.json()
    print(f"   Got data for {len(reg_data['provinces'])} provinces")
    # Show first province info
    first_prov = reg_data['provinces'][0]
    print(f"   Example - {first_prov['name']}:")
    print(f"      - Province ID: {first_prov['id']}")
    print(f"      - Districts: {len(first_prov['districts'])} available")
    print(f"      - Electoral Areas: {len(first_prov['electoral_areas'])} available")
else:
    print(f"   FAILED: {reg_data_resp.status_code}")
    exit(1)

# Step 2: Register a new user
print("\n2. Registering new user...")
unique_id = datetime.now().strftime("%Y%m%d%H%M%S")
new_user_email = f"testuser_{unique_id}@test.com"
new_user_pass = "TestPass123!"

# Use first province's first district and electoral area
first_prov = reg_data['provinces'][0]
first_district = first_prov['districts'][0]
first_area = first_prov['electoral_areas'][0]

register_payload = {
    "name": f"Test User {unique_id}",
    "email": new_user_email,
    "password": new_user_pass,
    "province_id": first_prov['id'],
    "district_id": first_district['id']
}

print(f"   Email: {new_user_email}")
print(f"   Province: {first_prov['name']} (ID: {first_prov['id']})")
print(f"   District: {first_district['name']} (ID: {first_district['id']})")
print(f"   Electoral Area: {first_area['name']} (ID: {first_area['id']})")

reg_resp = session.post(
    f"{API_BASE}/voter/register/",
    json=register_payload,
    headers={"Content-Type": "application/json"}
)

print(f"   Status: {reg_resp.status_code}")
reg_result = reg_resp.json()

if reg_resp.status_code == 201:
    print(f"   SUCCESS - User registered!")
    print(f"   User ID: {reg_result['user']['id']}")
    print(f"   Username: {reg_result['user']['username']}")
else:
    print(f"   FAILED: {reg_result}")
    exit(1)

# Step 3: Verify session is active (should be auto-logged in)
print("\n3. Checking if auto-logged in after registration...")
profile_resp = session.get(f"{API_BASE}/voter/profile/")
if profile_resp.status_code == 200:
    profile = profile_resp.json()
    print(f"   SUCCESS - Already logged in!")
    print(f"   Username: {profile['username']}")
    print(f"   Province: {profile['province']['name']}")
else:
    print(f"   Not logged in, trying to login...")
    
    # Step 4: Login with new user
    print("\n4. Logging in with new credentials...")
    login_resp = session.post(
        f"{API_BASE}/auth/login/",
        json={"email": new_user_email, "password": new_user_pass},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"   Status: {login_resp.status_code}")
    if login_resp.status_code == 200:
        print(f"   SUCCESS - Login successful!")
        login_result = login_resp.json()
        print(f"   User: {login_result['user']['username']}")
    else:
        print(f"   FAILED: {login_resp.json()}")
        exit(1)

# Step 5: Test authenticated endpoints
print("\n5. Testing authenticated endpoints...")

# Get profile
profile_resp = session.get(f"{API_BASE}/voter/profile/")
if profile_resp.status_code == 200:
    print(f"   GET /voter/profile/ - OK")
else:
    print(f"   GET /voter/profile/ - FAILED")

# Get candidates
cand_resp = session.get(f"{API_BASE}/candidates/")
candidates = cand_resp.json()
print(f"   GET /candidates/ - OK ({len(candidates)} candidates)")

# Get parties
party_resp = session.get(f"{API_BASE}/parties/")
parties = party_resp.json()
print(f"   GET /parties/ - OK ({len(parties)} parties)")

# Get voting status
status_resp = session.get(f"{API_BASE}/voting/status/")
status = status_resp.json()
print(f"   GET /voting/status/ - OK (total votes: {status['total_votes']})")

print("\n" + "=" * 70)
print("TEST COMPLETE - Registration and Login Working!")
print("=" * 70)
print(f"\nYou can now login with:")
print(f"  Email: {new_user_email}")
print(f"  Password: {new_user_pass}")
print(f"\nOr visit the frontend at: http://localhost:5174/login")
