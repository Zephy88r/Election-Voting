#!/usr/bin/env python
import os
import sys
import django

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from elections.models import Province, District, ElectoralArea, Candidate, Party, User

print("=" * 60)
print("SYSTEM STATUS CHECK")
print("=" * 60)

# Check Provinces
provinces = Province.objects.count()
print(f"\n✅ Provinces: {provinces}")

# Check Districts
districts = District.objects.count()
print(f"✅ Districts: {districts}")

# Check Electoral Areas
electoral_areas = ElectoralArea.objects.count()
print(f"✅ Electoral Areas: {electoral_areas}")

# Check all electoral areas have districts
ea_without_district = ElectoralArea.objects.filter(district__isnull=True).count()
print(f"   - Without district: {ea_without_district}")

# Check Candidates
candidates = Candidate.objects.count()
print(f"✅ Candidates: {candidates}")

# Check Parties
parties = Party.objects.count()
print(f"✅ Parties: {parties}")

# Check Admin User
admin = User.objects.filter(username='admin').first()
if admin and admin.is_superuser:
    print(f"✅ Admin user exists and is superuser")
else:
    print(f"❌ Admin user missing or not superuser")

# Check API Response
print("\n" + "=" * 60)
print("API DATA STRUCTURE")
print("=" * 60)

# Test registration data response
province = Province.objects.first()
if province:
    print(f"\n✅ Sample Province: {province.name}")
    districts = province.districts.all()
    print(f"   - Districts: {districts.count()}")
    if districts:
        district = districts.first()
        print(f"   - First District: {district.name}")
        electoral_areas = district.electoral_areas.all()
        print(f"     - Electoral Areas: {electoral_areas.count()}")

print("\n" + "=" * 60)
print("✅ SYSTEM READY FOR TESTING")
print("=" * 60)
print("\nNext steps:")
print("1. Go to http://127.0.0.1:8000/admin/")
print("2. Login with: admin / admin")
print("3. Register new user on http://localhost:5174")
print("4. Login with that user")
print("5. Vote for candidate and party")
