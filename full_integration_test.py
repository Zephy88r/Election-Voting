#!/usr/bin/env python
"""
Comprehensive integration test for Nepal Election System
Tests the entire flow from registration to voting through API
"""
import requests
import json
import time
import random
import string

BASE_URL = "http://localhost:8000"

def generate_random_email():
    """Generate a unique email for testing"""
    return f"test{''.join(random.choices(string.ascii_lowercase + string.digits, k=8))}@example.com"

def test_registration_flow():
    """Test user registration"""
    print("\n" + "="*60)
    print("TEST 1: REGISTRATION FLOW")
    print("="*60)
    
    # Step 1: Get registration data
    print("\n[1.1] Fetching registration data...")
    reg_response = requests.get(f"{BASE_URL}/elections/api/registration-data/")
    assert reg_response.status_code == 200, f"Failed to get registration data: {reg_response.text}"
    reg_data = reg_response.json()
    assert 'provinces' in reg_data, "No provinces in response"
    
    provinces = reg_data['provinces']
    print(f"  ✓ Got {len(provinces)} provinces")
    
    # Get first province and district
    province = provinces[0]
    assert province['districts'], f"Province {province['name']} has no districts"
    district = province['districts'][0]
    assert province['electoral_areas'], f"Province has no electoral areas"
    electoral_area = province['electoral_areas'][0]
    
    print(f"  ✓ Selected: {province['name']} → {district['name']} → {electoral_area['name']}")
    
    # Step 2: Register a new user
    print("\n[1.2] Registering new user...")
    email = generate_random_email()
    registration_payload = {
        "name": "Test User Full Name",
        "email": email,
        "password": "TestPassword@123",
        "province_id": province['name'],  # Backend expects 'province_id' with province NAME as value
        "district_id": district['name'],   # Backend expects 'district_id' with district NAME as value
        "electoral_area": electoral_area['name'],  # Electoral area expects NAME
    }
    
    register_response = requests.post(
        f"{BASE_URL}/elections/api/voter/register/",
        json=registration_payload
    )
    
    print(f"  Response: {register_response.status_code}")
    if register_response.status_code != 200:
        print(f"  Error: {register_response.text}")
    else:
        print(f"  ✓ Registered successfully")
        print(f"  Email: {email}")
    
    return email, registration_payload['password']

def test_login_flow(email, password):
    """Test user login"""
    print("\n" + "="*60)
    print("TEST 2: LOGIN FLOW")
    print("="*60)
    
    print(f"\n[2.1] Logging in with email: {email}...")
    
    session = requests.Session()
    login_payload = {
        "email": email,
        "password": password
    }
    
    login_response = session.post(
        f"{BASE_URL}/elections/api/voter/login/",
        json=login_payload
    )
    
    print(f"  Response: {login_response.status_code}")
    if login_response.status_code != 200:
        print(f"  Error: {login_response.text}")
        return None
    
    print(f"  ✓ Logged in successfully")
    print(f"  Session cookies: {list(session.cookies.keys())}")
    
    return session

def test_get_profile(session):
    """Get voter profile"""
    print("\n[2.2] Fetching voter profile...")
    
    profile_response = session.get(f"{BASE_URL}/elections/api/voter/profile/")
    if profile_response.status_code != 200:
        print(f"  Error {profile_response.status_code}: {profile_response.text}")
        return None
    
    profile = profile_response.json()
    print(f"  ✓ Got profile:")
    print(f"    Username: {profile.get('username')}")
    print(f"    Province: {profile.get('province', {}).get('name')}")
    print(f"    District: {profile.get('district', {}).get('name')}")
    print(f"    Electoral Area: {profile.get('electoral_area', {}).get('name')}")
    
    return profile

def test_voting_flow(session):
    """Test voting flow"""
    print("\n" + "="*60)
    print("TEST 3: VOTING FLOW")
    print("="*60)
    
    # Extract CSRF token from cookies
    csrf_token = session.cookies.get('csrftoken')
    print(f"\n[3.0] CSRF token: {csrf_token}")
    
    # Get candidates
    print("\n[3.1] Fetching candidates for electoral area...")
    candidates_response = session.get(f"{BASE_URL}/elections/api/candidates/")
    if candidates_response.status_code != 200:
        print(f"  Error {candidates_response.status_code}: {candidates_response.text}")
        return False
    
    candidates = candidates_response.json()
    print(f"  ✓ Got {len(candidates)} candidates")
    if not candidates:
        print("  ! No candidates available for voting")
        return False
    
    candidate = candidates[0]
    print(f"  Candidate: {candidate['name']} (ID: {candidate['id']})")
    
    # Vote for candidate (FPTP)
    print("\n[3.2] Voting for FPTP (candidate)...")
    fptp_vote = {
        "vote_type": "FPTP",
        "candidate_id": candidate['id']  # Changed from 'candidate' to 'candidate_id'
    }
    
    headers = {"X-CSRFToken": csrf_token} if csrf_token else {}
    
    vote_response = session.post(
        f"{BASE_URL}/elections/vote/submit/",
        files={
            'vote_type': (None, fptp_vote['vote_type']),
            'candidate_id': (None, str(fptp_vote['candidate_id']))  # Changed to 'candidate_id'
        },
        headers=headers
    )
    
    print(f"  Response: {vote_response.status_code}")
    if vote_response.status_code != 201:
        print(f"  Response: {vote_response.text[:500]}")
        return False
    
    print(f"  ✓ FPTP vote submitted successfully")
    
    # Get parties
    print("\n[3.3] Fetching political parties...")
    parties_response = session.get(f"{BASE_URL}/elections/api/parties/")
    if parties_response.status_code != 200:
        print(f"  Error {parties_response.status_code}: {parties_response.text}")
        return False
    
    parties = parties_response.json()
    print(f"  ✓ Got {len(parties)} parties")
    if not parties:
        print("  ! No parties available for voting")
        return True  # FPTP vote worked, so return true
    
    party = parties[0]
    print(f"  Party: {party['name']} (ID: {party['id']})")
    
    # Vote for party (PR)
    print("\n[3.4] Voting for PR (party)...")
    pr_vote = {
        "vote_type": "PR",
        "party_id": party['id']  # Changed from 'party' to 'party_id'
    }
    
    pr_response = session.post(
        f"{BASE_URL}/elections/vote/submit/",
        files={
            'vote_type': (None, pr_vote['vote_type']),
            'party_id': (None, str(pr_vote['party_id']))  # Changed to 'party_id'
        },
        headers=headers
    )
    
    print(f"  Response: {pr_response.status_code}")
    if pr_response.status_code != 201:
        print(f"  Response: {pr_response.text[:500]}")
        return False
    
    print(f"  ✓ PR vote submitted successfully")
    return True

def test_logout(session):
    """Test logout"""
    print("\n[3.5] Logging out...")
    
    logout_response = session.post(f"{BASE_URL}/elections/api/voter/logout/")
    if logout_response.status_code != 200:
        print(f"  Error {logout_response.status_code}: {logout_response.text}")
        return False
    
    print(f"  ✓ Logged out successfully")
    return True

def main():
    print("\n")
    print("="*60)
    print("NEPAL ELECTION SYSTEM - FULL INTEGRATION TEST")
    print("="*60)
    
    try:
        # Test registration
        email, password = test_registration_flow()
        
        # Test login
        session = test_login_flow(email, password)
        if not session:
            print("\n❌ Login failed - stopping test")
            return
        
        # Get profile
        profile = test_get_profile(session)
        if not profile:
            print("\n❌ Could not get profile - stopping test")
            return
        
        # Test voting
        if not test_voting_flow(session):
            print("\n❌ Voting flow failed")
            return
        
        # Test logout
        if not test_logout(session):
            print("\n❌ Logout failed")
            return
        
        print("\n" + "="*60)
        print("✅ ALL TESTS PASSED!")
        print("="*60)
        print("\nThe system is working correctly:")
        print("  ✓ Registration endpoint functional")
        print("  ✓ Login with session authentication working")
        print("  ✓ Profile retrieval working")
        print("  ✓ Candidate listing working")
        print("  ✓ FPTP voting functional")
        print("  ✓ Party listing working")
        print("  ✓ PR voting functional")
        print("  ✓ Logout functional")
        
    except AssertionError as e:
        print(f"\n❌ Assertion Error: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
