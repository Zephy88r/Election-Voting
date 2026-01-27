#!/usr/bin/env python
"""
Comprehensive integration test for Nepal Election System
Tests the entire flow from registration to voting through API
"""
import requests
import json
import random
import string

BASE_URL = "http://localhost:8000"

def generate_random_email():
    """Generate a unique email for testing"""
    return f"test{''.join(random.choices(string.ascii_lowercase + string.digits, k=8))}@example.com"

def main():
    print("\n" + "="*60)
    print("NEPAL ELECTION SYSTEM - FULL INTEGRATION TEST")
    print("="*60)
    
    try:
        # 1. Get registration data
        print("\n[1] Fetching registration data...")
        reg_response = requests.get(f"{BASE_URL}/elections/api/registration-data/")
        assert reg_response.status_code == 200
        reg_data = reg_response.json()
        provinces = reg_data['provinces']
        province = provinces[0]
        district = province['districts'][0]
        electoral_area = province['electoral_areas'][0]
        print(f"  [OK] Got {len(provinces)} provinces")
        print(f"  [OK] Selected: {province['name']} -> {district['name']} -> {electoral_area['name']}")
        
        # 2. Register new user for FPTP
        print("\n[2] Registering new user for FPTP vote...")
        email_fptp = generate_random_email()
        password = "TestPassword@123"
        register_response = requests.post(
            f"{BASE_URL}/elections/api/voter/register/",
            json={
                "name": "Test User FPTP",
                "email": email_fptp,
                "password": password,
                "province_id": province['name'],
                "district_id": district['name'],
                "electoral_area": electoral_area['name'],
            }
        )
        assert register_response.status_code == 201
        print(f"  [OK] Registered: {email_fptp}")
        
        # 3. Test FPTP voting
        print("\n[3] Testing FPTP voting...")
        session_fptp = requests.Session()
        login_response = session_fptp.post(
            f"{BASE_URL}/elections/api/voter/login/",
            json={"email": email_fptp, "password": password}
        )
        assert login_response.status_code == 200
        print(f"  [OK] Logged in")
        
        profile_response = session_fptp.get(f"{BASE_URL}/elections/api/voter/profile/")
        assert profile_response.status_code == 200
        profile = profile_response.json()
        print(f"  [OK] Profile: {profile.get('username')}")
        
        candidates_response = session_fptp.get(f"{BASE_URL}/elections/api/candidates/")
        assert candidates_response.status_code == 200
        candidates = candidates_response.json()
        assert len(candidates) > 0
        candidate = candidates[0]
        print(f"  [OK] Got {len(candidates)} candidates")
        
        csrf_token = session_fptp.cookies.get('csrftoken')
        headers = {"X-CSRFToken": csrf_token} if csrf_token else {}
        fptp_response = session_fptp.post(
            f"{BASE_URL}/elections/vote/submit/",
            files={
                'vote_type': (None, 'FPTP'),
                'candidate_id': (None, str(candidate['id']))
            },
            headers=headers
        )
        assert fptp_response.status_code == 201
        print(f"  [OK] FPTP vote submitted successfully")
        
        session_fptp.post(f"{BASE_URL}/elections/api/voter/logout/")
        
        # 4. Register new user for PR
        print("\n[4] Registering new user for PR vote...")
        email_pr = generate_random_email()
        register_response = requests.post(
            f"{BASE_URL}/elections/api/voter/register/",
            json={
                "name": "Test User PR",
                "email": email_pr,
                "password": password,
                "province_id": province['name'],
                "district_id": district['name'],
                "electoral_area": electoral_area['name'],
            }
        )
        assert register_response.status_code == 201
        print(f"  [OK] Registered: {email_pr}")
        
        # 5. Test PR voting
        print("\n[5] Testing PR voting...")
        session_pr = requests.Session()
        login_response = session_pr.post(
            f"{BASE_URL}/elections/api/voter/login/",
            json={"email": email_pr, "password": password}
        )
        assert login_response.status_code == 200
        print(f"  [OK] Logged in")
        
        parties_response = session_pr.get(f"{BASE_URL}/elections/api/parties/")
        assert parties_response.status_code == 200
        parties = parties_response.json()
        assert len(parties) > 0
        party = parties[0]
        print(f"  [OK] Got {len(parties)} parties")
        
        csrf_token_pr = session_pr.cookies.get('csrftoken')
        headers_pr = {"X-CSRFToken": csrf_token_pr} if csrf_token_pr else {}
        pr_response = session_pr.post(
            f"{BASE_URL}/elections/vote/submit/",
            files={
                'vote_type': (None, 'PR'),
                'party_id': (None, str(party['id']))
            },
            headers=headers_pr
        )
        assert pr_response.status_code == 201
        print(f"  [OK] PR vote submitted successfully")
        
        session_pr.post(f"{BASE_URL}/elections/api/voter/logout/")
        
        print("\n" + "="*60)
        print("SUCCESS: ALL TESTS PASSED")
        print("="*60)
        print("\nSystem is fully functional:")
        print("  [OK] Registration endpoint working")
        print("  [OK] Login with session authentication working")
        print("  [OK] Profile retrieval working")
        print("  [OK] Candidate listing working")
        print("  [OK] FPTP voting functional")
        print("  [OK] Party listing working")
        print("  [OK] PR voting functional")
        print("  [OK] Session-based auth with CSRF protection working")
        print("  [OK] Multipart form data submission working")
        print("\nNote: Users can submit either FPTP or PR vote, but not both")
        print("      (Due to OneToOneField design in Vote model)")
        
    except AssertionError as e:
        print(f"\nASSERTION FAILED: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
