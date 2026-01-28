#!/usr/bin/env python3
"""
Backend Database Verification Script
Checks if test votes were properly stored in the database
"""

import os
import sys
import django
from datetime import datetime

# Add the voting_system directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'voting_system'))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from elections.models import FPTPVote, PRVote, VoteLegacy, Voter

def print_header(title):
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}")

def print_section(title):
    print(f"\n{'-'*40}")
    print(f" {title}")
    print(f"{'-'*40}")

def verify_test_votes():
    """Verify that test votes were stored correctly"""
    
    print_header("NEPAL ELECTION - DATABASE VERIFICATION")
    print(f"Verification Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test user emails
    test_emails = [
        "ram.koshi@test.com",
        "sita.madhesh@test.com", 
        "hari.bagmati@test.com",
        "gita.gandaki@test.com",
        "krishna.lumbini@test.com",
        "maya.karnali@test.com"
    ]
    
    print_section("REGISTERED VOTERS")
    voters = Voter.objects.filter(email__in=test_emails)
    print(f"Found {voters.count()} test voters in database:")
    for voter in voters:
        print(f"  ✓ {voter.email} - {voter.first_name} {voter.last_name}")
    
    if voters.count() == 0:
        print("  ❌ No test voters found. Please run the registration test first.")
        return
    
    print_section("FPTP VOTES (Candidate Votes)")
    fptp_votes = FPTPVote.objects.filter(user_email__in=test_emails).order_by('user_email')
    print(f"Found {fptp_votes.count()} FPTP votes:")
    
    if fptp_votes.count() > 0:
        for vote in fptp_votes:
            print(f"  ✓ {vote.user_email} -> Candidate ID: {vote.candidate_id} (Vote ID: {vote.id})")
    else:
        print("  ❌ No FPTP votes found")
    
    print_section("PR VOTES (Party Votes)")
    pr_votes = PRVote.objects.filter(user_email__in=test_emails).order_by('user_email')
    print(f"Found {pr_votes.count()} PR votes:")
    
    if pr_votes.count() > 0:
        for vote in pr_votes:
            print(f"  ✓ {vote.user_email} -> Party ID: {vote.party_id} (Vote ID: {vote.id})")
    else:
        print("  ❌ No PR votes found")
    
    print_section("LEGACY VOTES (Consolidated)")
    legacy_votes = VoteLegacy.objects.filter(user_email__in=test_emails).order_by('user_email')
    print(f"Found {legacy_votes.count()} legacy votes:")
    
    if legacy_votes.count() > 0:
        for vote in legacy_votes:
            candidate_info = f"Candidate ID: {vote.candidate_id}" if vote.candidate_id else "No candidate"
            party_info = f"Party ID: {vote.party_id}" if vote.party_id else "No party"
            print(f"  ✓ {vote.user_email} -> {candidate_info}, {party_info} (Vote ID: {vote.id})")
    else:
        print("  ❌ No legacy votes found")
    
    print_section("SUMMARY")
    total_expected = len(test_emails)
    fptp_count = fptp_votes.count()
    pr_count = pr_votes.count()
    
    print(f"Expected users: {total_expected}")
    print(f"FPTP votes: {fptp_count}/{total_expected} ({fptp_count/total_expected*100:.1f}%)")
    print(f"PR votes: {pr_count}/{total_expected} ({pr_count/total_expected*100:.1f}%)")
    
    if fptp_count == total_expected and pr_count == total_expected:
        print("\n🎉 SUCCESS: All test votes were stored correctly!")
    else:
        print(f"\n⚠️  WARNING: Some votes may be missing.")
        print("   - Check if the voting test completed successfully")
        print("   - Verify backend API endpoints are working")
        print("   - Check Django logs for any errors")
    
    print_section("VOTE DETAILS BY USER")
    for email in test_emails:
        print(f"\n{email}:")
        
        # FPTP vote
        fptp = fptp_votes.filter(user_email=email).first()
        if fptp:
            print(f"  FPTP: Candidate {fptp.candidate_id} (ID: {fptp.id}, Time: {fptp.created_at})")
        else:
            print(f"  FPTP: ❌ No vote found")
        
        # PR vote
        pr = pr_votes.filter(user_email=email).first()
        if pr:
            print(f"  PR:   Party {pr.party_id} (ID: {pr.id}, Time: {pr.created_at})")
        else:
            print(f"  PR:   ❌ No vote found")
    
    print(f"\n{'='*60}")
    print("Verification completed!")

if __name__ == "__main__":
    try:
        verify_test_votes()
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        print("Make sure you're running this from the project root directory")
        print("and that Django is properly configured.")