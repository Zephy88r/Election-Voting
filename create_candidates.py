#!/usr/bin/env python
"""
Populate candidates for different electoral areas
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from elections.models import Province, District, ElectoralArea, Candidate, Party

def create_candidates():
    """Create test candidates for different electoral areas"""
    
    # Get or create parties
    parties = {}
    party_data = [
        ('Nepali Congress', 'NC'),
        ('CPN-UML', 'UML'),
        ('CPN-Maoist', 'Maoist'),
        ('Rastriya Prajatantra Party', 'RPP'),
        ('Janata Samajbadi Party', 'JSP'),
    ]
    
    for name, symbol in party_data:
        party, created = Party.objects.get_or_create(
            name=name,
            defaults={'symbol': symbol, 'is_active': True}
        )
        parties[name] = party
        if created:
            print(f"Created party: {name}")
    
    # Create candidates for different electoral areas
    candidate_data = [
        # Province 1 (Bhojpur Area)
        ('Ram Bahadur Rai', 'Bhojpur Area', 'Nepali Congress'),
        ('Sita Kumari Limbu', 'Bhojpur Area', 'CPN-UML'),
        ('Hari Prasad Sharma', 'Bhojpur Area', 'CPN-Maoist'),
        
        # Province 2 (Bara Area)
        ('Mohammad Ali Khan', 'Bara Area', 'Nepali Congress'),
        ('Sunita Devi Yadav', 'Bara Area', 'Janata Samajbadi Party'),
        ('Rajesh Kumar Singh', 'Bara Area', 'CPN-UML'),
        
        # Province 3 (Bhaktapur Area)
        ('Prakash Shrestha', 'Bhaktapur Area', 'Nepali Congress'),
        ('Maya Tamang', 'Bhaktapur Area', 'CPN-UML'),
        ('Gopal Maharjan', 'Bhaktapur Area', 'Rastriya Prajatantra Party'),
    ]
    
    for candidate_name, electoral_area_name, party_name in candidate_data:
        try:
            electoral_area = ElectoralArea.objects.get(name=electoral_area_name)
            party = parties[party_name]
            
            candidate, created = Candidate.objects.get_or_create(
                name=candidate_name,
                electoral_area=electoral_area,
                defaults={'party': party}
            )
            
            if created:
                print(f"Created candidate: {candidate_name} ({electoral_area_name}) - {party_name}")
            else:
                print(f"Candidate already exists: {candidate_name}")
                
        except ElectoralArea.DoesNotExist:
            print(f"Electoral area not found: {electoral_area_name}")
        except Exception as e:
            print(f"Error creating candidate {candidate_name}: {e}")
    
    print("\nCandidates by Electoral Area:")
    for ea in ElectoralArea.objects.all():
        candidates = ea.candidates.all()
        print(f"\n{ea.name} ({ea.province.name}):")
        for candidate in candidates:
            print(f"  - {candidate.name} ({candidate.party.name if candidate.party else 'Independent'})")

if __name__ == '__main__':
    create_candidates()