#!/usr/bin/env python
"""
Load Test Candidates and Parties for Nepal Elections
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from elections.models import Party, Candidate, ElectoralArea

# Sample Parties
PARTIES = [
    "Nepal Communist Party",
    "Nepali Congress",
    "Rastriya Prajatantra Party",
    "Janata Samajbadi Party",
    "CK Raut's Loktantrik Samajbadi Dal",
    "Unified Socialist",
    "Madhav Nepal's Party",
]

# Sample Candidate Names
CANDIDATE_NAMES = [
    "Ramesh Kumar Singh",
    "Priya Sharma",
    "Amit Patel",
    "Neha Verma",
    "Rajesh Gupta",
    "Anjali Reddy",
    "Vikram Yadav",
    "Divya Nair",
]

def load_parties():
    """Load political parties"""
    print("Loading Political Parties...")
    print("-" * 70)
    
    created_count = 0
    for party_name in PARTIES:
        party, created = Party.objects.get_or_create(
            name=party_name,
            defaults={'is_active': True}
        )
        if created:
            print(f"✓ Created Party: {party_name}")
            created_count += 1
        else:
            print(f"• Already exists: {party_name}")
    
    print(f"\nParties in database: {Party.objects.count()}")
    print(f"New parties created: {created_count}\n")

def load_candidates():
    """Load sample candidates for each electoral area"""
    print("Loading Candidates for Electoral Areas...")
    print("-" * 70)
    
    electoral_areas = ElectoralArea.objects.all()
    total_candidates = 0
    
    for idx, electoral_area in enumerate(electoral_areas):
        # Create 4-5 candidates per electoral area
        num_candidates = 4 + (idx % 2)
        
        for i in range(num_candidates):
            candidate_name = f"{CANDIDATE_NAMES[i % len(CANDIDATE_NAMES)]} ({electoral_area.name})"
            
            candidate, created = Candidate.objects.get_or_create(
                name=candidate_name,
                electoral_area=electoral_area,
                defaults={'party': None}
            )
            
            if created:
                total_candidates += 1
        
        # Progress indicator every 10 areas
        if (idx + 1) % 10 == 0:
            print(f"  ✓ Added candidates for {idx + 1} electoral areas...")
    
    print(f"\n✓ Total candidates created: {total_candidates}")
    print(f"Total candidates in database: {Candidate.objects.count()}\n")

def verify_data():
    """Verify all data is loaded correctly"""
    print("Verifying Data Integrity...")
    print("-" * 70)
    
    from elections.models import Province, District
    
    provinces = Province.objects.count()
    districts = District.objects.count()
    electoral_areas = ElectoralArea.objects.count()
    parties = Party.objects.count()
    candidates = Candidate.objects.count()
    
    print(f"Provinces: {provinces}")
    print(f"Districts: {districts}")
    print(f"Electoral Areas: {electoral_areas}")
    print(f"Parties: {parties}")
    print(f"Candidates: {candidates}")
    
    print("\n" + "=" * 70)
    print("✅ Complete Nepal Electoral System Data Loaded Successfully!")
    print("=" * 70)

if __name__ == "__main__":
    try:
        load_parties()
        load_candidates()
        verify_data()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
