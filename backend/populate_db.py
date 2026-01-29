from django.contrib.auth import get_user_model
from elections.models import Province, District, ElectoralArea, Party, Candidate

# Get or create provinces
provinces_data = {
    'Province 1': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa'],
    'Province 2': ['Bara', 'Dhanusha', 'Mahottari'],
    'Province 3': ['Bhaktapur', 'Chitwan', 'Kathmandu'],
    'Province 4': ['Baglung', 'Kaski', 'Lamjung'],
    'Province 5': ['Arghakhanchi', 'Dang', 'Gulmi'],
    'Province 6': ['Dailekh', 'Dolpa', 'Jumla'],
    'Province 7': ['Achham', 'Baitadi', 'Bajhang'],
}

print("Creating provinces and districts...")
for province_name, districts in provinces_data.items():
    province, created = Province.objects.get_or_create(name=province_name)
    print(f"{'Created' if created else 'Found'} Province: {province_name}")
    
    for district_name in districts:
        district, created = District.objects.get_or_create(
            name=district_name,
            province=province
        )
        print(f"  {'Created' if created else 'Found'} District: {district_name}")
        
        # Create electoral areas linked to districts
        electoral_area, created = ElectoralArea.objects.get_or_create(
            name=f"{district_name} Area",
            district=district,
            province=province
        )
        print(f"    {'Created' if created else 'Found'} Electoral Area: {district_name} Area")

# Create parties
print("\nCreating parties...")
parties_data = [
    {'name': 'Nepal Communist Party', 'symbol': 'Hammer & Sickle'},
    {'name': 'Nepali Congress', 'symbol': 'Tree'},
    {'name': 'Rastriya Prajatantra Party', 'symbol': 'Crown'},
    {'name': 'Janata Samajbadi Party', 'symbol': 'Flag'},
]

for party_data in parties_data:
    party, created = Party.objects.get_or_create(
        name=party_data['name'],
        defaults={'symbol': party_data['symbol'], 'is_active': True}
    )
    print(f"{'Created' if created else 'Found'} Party: {party_data['name']}")

# Create candidates
print("\nCreating candidates...")
province_3 = Province.objects.get(name='Province 3')
electoral_area = ElectoralArea.objects.filter(province=province_3).first()

if electoral_area:
    for i in range(1, 6):
        party = Party.objects.all()[i % 4]
        candidate, created = Candidate.objects.get_or_create(
            name=f"Candidate {i}",
            electoral_area=electoral_area,
            defaults={'party': party}
        )
        print(f"{'Created' if created else 'Found'} Candidate: Candidate {i}")
else:
    print("No electoral area found in Province 3")

print("\n✓ Database population complete!")
