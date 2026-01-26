#!/usr/bin/env python
"""
Quick setup script to enable voting and create test data
Run this from the voting_system directory: python setup_voting.py
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from elections.models import ElectionControl, Province, District, ElectoralArea, Party, Candidate

def setup_voting():
    print("Setting up voting system...")
    
    # Enable voting
    control, created = ElectionControl.objects.get_or_create(defaults={'is_voting_open': True})
    if not created:
        control.is_voting_open = True
        control.save()
    print("✓ Voting enabled")
    
    # Create provinces
    koshi, _ = Province.objects.get_or_create(name='Koshi')
    print("✓ Province created")
    
    # Create districts
    jhapa, _ = District.objects.get_or_create(name='Jhapa', province=koshi)
    morang, _ = District.objects.get_or_create(name='Morang', province=koshi)
    print("✓ Districts created")
    
    # Create electoral areas
    ea1, _ = ElectoralArea.objects.get_or_create(name='Koshi Electoral Area 1', province=koshi)
    ea2, _ = ElectoralArea.objects.get_or_create(name='Koshi Electoral Area 2', province=koshi)
    print("✓ Electoral areas created")
    
    # Create parties
    nc, _ = Party.objects.get_or_create(name='Nepali Congress', defaults={'symbol': 'NC', 'is_active': True})
    uml, _ = Party.objects.get_or_create(name='CPN UML', defaults={'symbol': 'UML', 'is_active': True})
    rsp, _ = Party.objects.get_or_create(name='Rastra Swatantra Party (RSP)', defaults={'symbol': 'RSP', 'is_active': True})
    print("✓ Parties created")
    
    # Create candidates
    Candidate.objects.get_or_create(name='Ram Shrestha', electoral_area=ea1, defaults={'party': nc})
    Candidate.objects.get_or_create(name='Sita Tamang', electoral_area=ea1, defaults={'party': uml})
    Candidate.objects.get_or_create(name='Hari Gurung', electoral_area=ea2, defaults={'party': rsp})
    print("✓ Candidates created")
    
    print("\n🎉 Setup complete! You can now:")
    print("1. Register users")
    print("2. Login and vote")
    print("3. Check votes in Django admin")

if __name__ == '__main__':
    setup_voting()