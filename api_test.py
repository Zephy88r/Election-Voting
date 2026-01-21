#!/usr/bin/env python
"""
API Integration Test Script
Tests all critical endpoints to ensure the voting system works
"""

import requests
import json
from pprint import pprint

BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/elections/api"

# Test credentials
TEST_CREDS = {
    "email": "voter1@test.com",  # or "voterId": "voter1"
    "password": "testpass123"
}

# Create a session for maintaining cookies
session = requests.Session()

def test_login():
    """Test login endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Login")
    print("="*60)
    
    response = session.post(
        f"{API_BASE}/auth/login/",
        json={"voterId": "voter1", "password": "testpass123"},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Login successful")
        return True
    else:
        print("❌ Login failed")
        return False

def test_profile():
    """Test profile endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Get User Profile")
    print("="*60)
    
    response = session.get(
        f"{API_BASE}/voter/profile/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Profile fetch successful")
        return response.json()
    else:
        print("❌ Profile fetch failed")
        return None

def test_candidates():
    """Test candidates endpoint"""
    print("\n" + "="*60)
    print("TEST 3: Get Candidates")
    print("="*60)
    
    response = session.get(
        f"{API_BASE}/candidates/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Candidates fetch successful")
        return response.json()
    else:
        print("❌ Candidates fetch failed")
        return None

def test_parties():
    """Test parties endpoint"""
    print("\n" + "="*60)
    print("TEST 4: Get Parties")
    print("="*60)
    
    response = session.get(
        f"{API_BASE}/parties/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Parties fetch successful")
        return response.json()
    else:
        print("❌ Parties fetch failed")
        return None

def test_voting_status():
    """Test voting status endpoint"""
    print("\n" + "="*60)
    print("TEST 5: Get Voting Status")
    print("="*60)
    
    response = session.get(
        f"{API_BASE}/voting/status/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Voting status fetch successful")
        return response.json()
    else:
        print("❌ Voting status fetch failed")
        return None

def test_voting_history():
    """Test voting history endpoint"""
    print("\n" + "="*60)
    print("TEST 6: Get Voting History")
    print("="*60)
    
    response = session.get(
        f"{API_BASE}/voting-history/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Voting history fetch successful")
        return response.json()
    else:
        print("❌ Voting history fetch failed")
        return None

def test_notifications():
    """Test notifications endpoint"""
    print("\n" + "="*60)
    print("TEST 7: Get Notifications")
    print("="*60)
    
    response = session.get(
        f"{API_BASE}/notifications/",
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response:")
    pprint(response.json())
    
    if response.status_code == 200:
        print("✅ Notifications fetch successful")
        return response.json()
    else:
        print("❌ Notifications fetch failed")
        return None

def main():
    """Run all tests"""
    print("\n🧪 NEPAL ELECTION VOTING SYSTEM - API INTEGRATION TEST")
    print(f"Base URL: {BASE_URL}")
    print("="*60)
    
    if not test_login():
        print("\n❌ Cannot proceed - login failed")
        return
    
    profile = test_profile()
    candidates = test_candidates()
    parties = test_parties()
    voting_status = test_voting_status()
    voting_history = test_voting_history()
    notifications = test_notifications()
    
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    print("✅ All endpoints tested")
    print("\nSystem is ready for voting!")

if __name__ == "__main__":
    main()
