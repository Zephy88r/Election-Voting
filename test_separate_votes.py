#!/usr/bin/env python
"""
Test script: Verify separate FPTPVote and PRVote tables work correctly
Now allows users to vote for both candidate (FPTP) and party (PR)
"""

import os
import sys
import django
import requests
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model
from elections.models import FPTPVote, PRVote, Candidate, Party, Province, District, ElectoralArea

User = get_user_model()

BASE_URL = "http://127.0.0.1:8000"
FPTP_TEST_EMAIL = f"fptp_test_{int(datetime.now().timestamp())}@example.com"
FPTP_TEST_PASSWORD = "TestPass@123"

def log_test(message, status="INFO"):
    """Log test messages"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    symbol = {
        "INFO": "[i]",
        "OK": "[+]",
        "ERROR": "[-]",
        "HEADER": "==",
    }.get(status, "> ")
    print(f"{timestamp} | {symbol} {message}")

def test_registration():
    """Test user registration"""
    log_test("TEST 1: User Registration", "HEADER")
    
    data = {
        "name": "FPTP Test User",
        "email": FPTP_TEST_EMAIL,
        "password": FPTP_TEST_PASSWORD,
        "province_id": "Province 1",
        "district_id": "Bhojpur",
        "electoral_area": "Bhojpur Area",
    }
    
    response = requests.post(f"{BASE_URL}/elections/api/voter/register/", json=data)
    
    if response.status_code == 201:
        log_test(f"User registered: {FPTP_TEST_EMAIL}", "OK")
        return True
    else:
        log_test(f"Registration failed: {response.status_code} - {response.text}", "ERROR")
        return False

def test_login():
    """Test user login"""
    log_test("TEST 2: User Login", "HEADER")
    
    session = requests.Session()
    login_data = {
        "email": FPTP_TEST_EMAIL,
        "password": FPTP_TEST_PASSWORD,
    }
    
    response = session.post(f"{BASE_URL}/elections/api/voter/login/", json=login_data)
    
    if response.status_code == 200:
        log_test("User logged in successfully", "OK")
        return session
    else:
        log_test(f"Login failed: {response.status_code}", "ERROR")
        return None

def test_fptp_vote(session):
    """Test FPTP voting"""
    log_test("TEST 3: FPTP Vote Submission (Candidate)", "HEADER")
    
    # Get CSRF token first
    response = session.get(f"{BASE_URL}/elections/api/candidates/")
    csrf_token = session.cookies.get('csrftoken', '')
    
    # Get candidates
    candidates = response.json()
    
    if not candidates:
        log_test("No candidates available", "ERROR")
        return False
    
    candidate = candidates[0]
    
    # Submit FPTP vote with CSRF token
    vote_data = {
        "vote_type": "FPTP",
        "candidate_id": candidate["id"],
    }
    
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    response = session.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data, headers=headers)
    
    if response.status_code == 201:
        log_test(f"FPTP vote submitted for: {candidate['name']} (201 Created)", "OK")
        return True
    else:
        log_test(f"FPTP vote failed: {response.status_code} - {response.text[:200]}", "ERROR")
        return False

def test_pr_vote(session):
    """Test PR voting"""
    log_test("TEST 4: PR Vote Submission (Party)", "HEADER")
    
    # Get CSRF token
    csrf_token = session.cookies.get('csrftoken', '')
    
    # Get parties
    response = session.get(f"{BASE_URL}/elections/api/parties/")
    parties = response.json()
    
    if not parties:
        log_test("No parties available", "ERROR")
        return False
    
    party = parties[0]
    
    # Submit PR vote with CSRF token
    vote_data = {
        "vote_type": "PR",
        "party_id": party["id"],
    }
    
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    response = session.post(f"{BASE_URL}/elections/vote/submit/", data=vote_data, headers=headers)
    
    if response.status_code == 201:
        log_test(f"PR vote submitted for: {party['name']} (201 Created)", "OK")
        return True
    else:
        log_test(f"PR vote failed: {response.status_code}", "ERROR")
        log_test(f"Response: {response.text[:200]}", "ERROR")
        return False

def test_voting_history(session):
    """Test voting history endpoint"""
    log_test("TEST 5: Voting History Check", "HEADER")
    
    response = session.get(f"{BASE_URL}/elections/api/voting-history/")
    
    if response.status_code == 200:
        history = response.json()
        votes = history.get("votes", [])
        log_test(f"Voting history retrieved: {len(votes)} votes", "OK")
        
        for vote in votes:
            log_test(f"  - {vote['vote_type']}: {vote.get('candidate', vote.get('party'))}", "INFO")
        
        return True
    else:
        log_test(f"History check failed: {response.status_code}", "ERROR")
        return False

def test_database_state():
    """Verify database state"""
    log_test("TEST 6: Database State Verification", "HEADER")
    
    try:
        user = User.objects.get(email=FPTP_TEST_EMAIL)
        
        # Check FPTP votes
        fptp_votes = FPTPVote.objects.filter(voter=user)
        fptp_count = fptp_votes.count()
        log_test(f"FPTP votes in database: {fptp_count}", "OK" if fptp_count > 0 else "ERROR")
        
        # Check PR votes
        pr_votes = PRVote.objects.filter(voter=user)
        pr_count = pr_votes.count()
        log_test(f"PR votes in database: {pr_count}", "OK" if pr_count > 0 else "ERROR")
        
        # Show what was voted for
        for fptp in fptp_votes:
            log_test(f"  FPTP: {fptp.candidate.name if fptp.candidate else 'None'}", "INFO")
        
        for pr in pr_votes:
            log_test(f"  PR: {pr.party.name if pr.party else 'None'}", "INFO")
        
        if fptp_count > 0 and pr_count > 0:
            log_test("SUCCESS: User can now vote for both FPTP and PR!", "OK")
            return True
        else:
            log_test("PARTIAL: Only one vote type recorded", "ERROR")
            return False
        
    except Exception as e:
        log_test(f"Database check error: {str(e)}", "ERROR")
        return False

def run_all_tests():
    """Run all tests"""
    log_test("=" * 70, "HEADER")
    log_test("SEPARATE VOTES TEST SUITE", "HEADER")
    log_test("Testing if users can now vote for BOTH FPTP and PR", "HEADER")
    log_test("=" * 70, "HEADER")
    
    results = []
    
    # Test 1: Registration
    if not test_registration():
        log_test("ABORT: Registration failed", "ERROR")
        return
    results.append("Registration: ✓")
    
    # Test 2: Login
    session = test_login()
    if not session:
        log_test("ABORT: Login failed", "ERROR")
        return
    results.append("Login: ✓")
    
    # Test 3: FPTP Vote
    if not test_fptp_vote(session):
        log_test("ABORT: FPTP vote failed", "ERROR")
        return
    results.append("FPTP Vote: ✓")
    
    # Test 4: PR Vote (should NOW work unlike before!)
    if not test_pr_vote(session):
        log_test("ABORT: PR vote failed", "ERROR")
        return
    results.append("PR Vote: ✓")
    
    # Test 5: Voting History
    if not test_voting_history(session):
        log_test("ABORT: History check failed", "ERROR")
        return
    results.append("History: ✓")
    
    # Test 6: Database State
    if not test_database_state():
        log_test("ABORT: Database state check failed", "ERROR")
        return
    results.append("Database: ✓")
    
    # Summary
    log_test("=" * 70, "HEADER")
    log_test("ALL TESTS PASSED!", "OK")
    log_test("=" * 70, "HEADER")
    for result in results:
        log_test(result, "OK")
    
    log_test("\n[SUCCESS] BREAKTHROUGH: Users can now vote for BOTH candidates (FPTP) AND parties (PR)!", "OK")
    log_test("The separate table design eliminated the OneToOneField limitation!", "OK")

if __name__ == "__main__":
    run_all_tests()
