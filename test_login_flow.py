#!/usr/bin/env python
"""Test login flow through browser via backend API"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Test login
print("=" * 50)
print("TEST: Login with test credentials")
print("=" * 50)

session = requests.Session()
login_response = session.post(
    f"{BASE_URL}/elections/api/voter/login/",
    json={"email": "demo@example.com", "password": "Demo@12345"}
)

print(f"Status: {login_response.status_code}")
print(f"Response: {login_response.text}")
print(f"Cookies: {session.cookies}")

# Try to get candidates after login
print("\n" + "=" * 50)
print("TEST: Get candidates list (should work with session)")
print("=" * 50)

candidates_response = session.get(f"{BASE_URL}/elections/api/candidates/")
print(f"Status: {candidates_response.status_code}")
if candidates_response.status_code == 200:
    data = candidates_response.json()
    print(f"Candidates count: {len(data)}")
    if data:
        print(f"First candidate: {data[0]}")
else:
    print(f"Response: {candidates_response.text}")

# Try to get profile
print("\n" + "=" * 50)
print("TEST: Get voter profile")
print("=" * 50)

profile_response = session.get(f"{BASE_URL}/elections/api/voter/profile/")
print(f"Status: {profile_response.status_code}")
print(f"Response: {profile_response.json() if profile_response.status_code == 200 else profile_response.text}")

# Try to get parties
print("\n" + "=" * 50)
print("TEST: Get parties list")
print("=" * 50)

parties_response = session.get(f"{BASE_URL}/elections/api/parties/")
print(f"Status: {parties_response.status_code}")
if parties_response.status_code == 200:
    data = parties_response.json()
    print(f"Parties count: {len(data)}")
    if data:
        print(f"First party: {data[0]}")
else:
    print(f"Response: {parties_response.text}")

# Test CORS headers
print("\n" + "=" * 50)
print("TEST: Check CORS headers on OPTIONS request")
print("=" * 50)

cors_response = session.options(
    f"{BASE_URL}/elections/api/candidates/",
    headers={"Origin": "http://localhost:5173"}
)
print(f"Status: {cors_response.status_code}")
print("Response Headers:")
for header, value in cors_response.headers.items():
    if 'access-control' in header.lower() or 'allow' in header.lower():
        print(f"  {header}: {value}")

print("\nAll headers:")
print(cors_response.headers)

print("\n" + "=" * 50)
print("Frontend should now be able to use these authenticated requests")
print("=" * 50)
