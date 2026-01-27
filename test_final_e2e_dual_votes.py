#!/usr/bin/env python
"""
Final Comprehensive Test: End-to-End Voting with Both FPTP and PR Votes
Demonstrates the new separate vote tables working correctly
"""

import os
import sys
import django
import requests
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model
from elections.models import FPTPVote, PRVote, Candidate, Party

User = get_user_model()

BASE_URL = "http://127.0.0.1:8000"
TEST_EMAIL = f"e2e_dual_vote_{int(datetime.now().timestamp())}@example.com"
TEST_PASSWORD = "DualVote@12345"

def log(msg, level="INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    symbol = {"✓": "✓", "✗": "✗", "ℹ": "ℹ", "━": "━"}.get(level, "▸")
    print(f"{ts} | [{symbol}] {msg}")

def test_complete_workflow():
    """Test complete voting workflow with both vote types"""
    
    log("=" * 70, "━")
    log("END-TO-END TEST: DUAL VOTE SYSTEM", "━")
    log("Verifying users can vote for BOTH candidate and party", "━")
    log("=" * 70, "━")
    
    # Step 1: Register
    log("Step 1: User Registration", "━")
    reg_data = {
        "name": "Dual Vote Tester",
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "province_id": "Province 1",
        "district_id": "Bhojpur",
        "electoral_area": "Bhojpur Area",
    }
    
    response = requests.post(f"{BASE_URL}/elections/api/voter/register/", json=reg_data)
    if response.status_code != 201:
        log(f"Registration failed: {response.status_code}", "✗")
        return False
    log(f"User registered: {TEST_EMAIL}", "✓")
    
    # Step 2: Login
    log("\nStep 2: User Login", "━")
    session = requests.Session()
    login_data = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    
    response = session.post(f"{BASE_URL}/elections/api/voter/login/", json=login_data)
    if response.status_code != 200:
        log(f"Login failed: {response.status_code}", "✗")
        return False
    log("Session established with CSRF token", "✓")
    
    csrf_token = session.cookies.get('csrftoken', '')
    
    # Step 3: Load candidates and parties
    log("\nStep 3: Load Voting Options", "━")
    candidates = session.get(f"{BASE_URL}/elections/api/candidates/").json()
    parties = session.get(f"{BASE_URL}/elections/api/parties/").json()
    
    if not candidates or not parties:
        log("Failed to load candidates or parties", "✗")
        return False
    
    candidate = candidates[0]
    party = parties[0]
    log(f"Candidate available: {candidate['name']}", "ℹ")
    log(f"Party available: {party['name']}", "ℹ")
    
    # Step 4: Submit FPTP Vote
    log("\nStep 4: Submit FPTP Vote (Candidate)", "━")
    headers = {'X-CSRFToken': csrf_token} if csrf_token else {}
    fptp_data = {"vote_type": "FPTP", "candidate_id": candidate["id"]}
    
    response = session.post(f"{BASE_URL}/elections/vote/submit/", data=fptp_data, headers=headers)
    if response.status_code != 201:
        log(f"FPTP vote failed: {response.status_code}", "✗")
        return False
    log(f"FPTP vote recorded: {candidate['name']} (201 Created)", "✓")
    
    # Step 5: Submit PR Vote (NEW: This would fail with OneToOneField!)
    log("\nStep 5: Submit PR Vote (Party)", "━")
    pr_data = {"vote_type": "PR", "party_id": party["id"]}
    
    response = session.post(f"{BASE_URL}/elections/vote/submit/", data=pr_data, headers=headers)
    if response.status_code != 201:
        log(f"PR vote failed: {response.status_code}", "✗")
        log(f"Response: {response.text[:100]}", "✗")
        return False
    log(f"PR vote recorded: {party['name']} (201 Created)", "✓")
    
    # Step 6: Verify voting history
    log("\nStep 6: Verify Voting History", "━")
    response = session.get(f"{BASE_URL}/elections/api/voting-history/")
    if response.status_code != 200:
        log(f"History retrieval failed: {response.status_code}", "✗")
        return False
    
    history = response.json()
    votes = history.get("votes", [])
    
    if len(votes) != 2:
        log(f"Expected 2 votes, got {len(votes)}", "✗")
        return False
    
    for vote in votes:
        if vote['vote_type'] == 'FPTP':
            log(f"FPTP vote retrieved: {vote.get('candidate')}", "ℹ")
        elif vote['vote_type'] == 'PR':
            log(f"PR vote retrieved: {vote.get('party')}", "ℹ")
    
    # Step 7: Database verification
    log("\nStep 7: Database Verification", "━")
    user = User.objects.get(email=TEST_EMAIL)
    
    fptp_votes = FPTPVote.objects.filter(voter=user)
    pr_votes = PRVote.objects.filter(voter=user)
    
    if fptp_votes.count() != 1:
        log(f"Expected 1 FPTP vote in database, got {fptp_votes.count()}", "✗")
        return False
    log(f"FPTP vote found in FPTPVote table: {fptp_votes.first().candidate.name}", "✓")
    
    if pr_votes.count() != 1:
        log(f"Expected 1 PR vote in database, got {pr_votes.count()}", "✗")
        return False
    log(f"PR vote found in PRVote table: {pr_votes.first().party.name}", "✓")
    
    # Summary
    log("\n" + "=" * 70, "━")
    log("✅ ALL TESTS PASSED!", "✓")
    log("=" * 70, "━")
    log("\n🎉 SUCCESS SUMMARY:", "✓")
    log("  1. User registration working", "✓")
    log("  2. Session-based authentication working", "✓")
    log("  3. FPTP vote submitted successfully (201)", "✓")
    log("  4. PR vote submitted successfully (201) - NO IntegrityError!", "✓")
    log("  5. Both votes retrieved via API", "✓")
    log("  6. Database integrity verified", "✓")
    log("\n💡 KEY ACHIEVEMENT:", "✓")
    log("  User successfully voted for BOTH a candidate (FPTP) and a party (PR)", "✓")
    log("  in the same session WITHOUT any errors or limitations!", "✓")
    log("\n✅ THE ONETOONEFIELD LIMITATION HAS BEEN COMPLETELY ELIMINATED!", "✓")
    
    return True

if __name__ == "__main__":
    success = test_complete_workflow()
    sys.exit(0 if success else 1)
