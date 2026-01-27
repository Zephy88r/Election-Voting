#!/usr/bin/env python
"""
Load Nepal's Complete Administrative Data
Provinces, Districts, and Electoral Areas
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from elections.models import Province, District, ElectoralArea

# Nepal's 7 Provinces with Districts and Electoral Areas
NEPAL_DATA = {
    "Province 1": {
        "districts": {
            "Bhojpur": ["Bhojpur Area"],
            "Dhankuta": ["Dhankuta Area"],
            "Ilam": ["Ilam Area"],
            "Jhapa": ["Jhapa Area"],
            "Khotang": ["Khotang Area"],
            "Morang": ["Morang Area"],
            "Okhaldhunga": ["Okhaldhunga Area"],
            "Panchthar": ["Panchthar Area"],
            "Sankhuwasabha": ["Sankhuwasabha Area"],
            "Sunsari": ["Sunsari Area"],
            "Taplejung": ["Taplejung Area"],
            "Terhathum": ["Terhathum Area"],
        }
    },
    "Province 2": {
        "districts": {
            "Araria": ["Araria Area"],
            "Bara": ["Bara Area"],
            "Dhanusa": ["Dhanusa Area"],
            "Mahottari": ["Mahottari Area"],
            "Parsa": ["Parsa Area"],
            "Rautahat": ["Rautahat Area"],
            "Saptari": ["Saptari Area"],
            "Sarlahi": ["Sarlahi Area"],
        }
    },
    "Province 3": {
        "districts": {
            "Bhaktapur": ["Bhaktapur Area"],
            "Chitwan": ["Chitwan Area"],
            "Dhading": ["Dhading Area"],
            "Kathmandu": ["Kathmandu Area"],
            "Kavrepalanchok": ["Kavrepalanchok Area"],
            "Lalitpur": ["Lalitpur Area"],
            "Makwanpur": ["Makwanpur Area"],
            "Nuwakot": ["Nuwakot Area"],
            "Ramechhap": ["Ramechhap Area"],
            "Rasuwa": ["Rasuwa Area"],
            "Sindhuli": ["Sindhuli Area"],
        }
    },
    "Province 4": {
        "districts": {
            "Baglung": ["Baglung Area"],
            "Gorkha": ["Gorkha Area"],
            "Gulmi": ["Gulmi Area"],
            "Kaski": ["Kaski Area"],
            "Lamjung": ["Lamjung Area"],
            "Myagdi": ["Myagdi Area"],
            "Nawalpur": ["Nawalpur Area"],
            "Parbat": ["Parbat Area"],
            "Syangja": ["Syangja Area"],
            "Tanahu": ["Tanahu Area"],
        }
    },
    "Province 5": {
        "districts": {
            "Argakhanchi": ["Argakhanchi Area"],
            "Banke": ["Banke Area"],
            "Bardiya": ["Bardiya Area"],
            "Dang": ["Dang Area"],
            "Gulmi": ["Gulmi Area"],
            "Kapilvastu": ["Kapilvastu Area"],
            "Palpa": ["Palpa Area"],
            "Rupandehi": ["Rupandehi Area"],
        }
    },
    "Province 6": {
        "districts": {
            "Achham": ["Achham Area"],
            "Bajhang": ["Bajhang Area"],
            "Bajura": ["Bajura Area"],
            "Dailekh": ["Dailekh Area"],
            "Doti": ["Doti Area"],
            "Janakpur": ["Janakpur Area"],
            "Kailali": ["Kailali Area"],
            "Kanchanpur": ["Kanchanpur Area"],
        }
    },
    "Province 7": {
        "districts": {
            "Baitadi": ["Baitadi Area"],
            "Bajhang": ["Bajhang Area"],
            "Darchula": ["Darchula Area"],
            "Pithoragarh": ["Pithoragarh Area"],
            "Udaypur": ["Udaypur Area"],
        }
    },
}

def load_nepal_data():
    """Load Nepal's administrative data into database"""
    print("Starting Nepal Administrative Data Load...")
    print("=" * 70)
    
    total_provinces = 0
    total_districts = 0
    total_electoral_areas = 0
    
    for province_name, province_data in NEPAL_DATA.items():
        # Create or get Province
        province, created = Province.objects.get_or_create(name=province_name)
        if created:
            print(f"✓ Created Province: {province_name}")
            total_provinces += 1
        else:
            print(f"• Already exists: {province_name}")
        
        # Create Districts for this Province
        for district_name, electoral_areas in province_data["districts"].items():
            # Create or get District
            district, created = District.objects.get_or_create(
                name=district_name,
                province=province
            )
            if created:
                print(f"  ✓ Created District: {district_name}")
                total_districts += 1
            else:
                print(f"  • Already exists: {district_name}")
            
            # Create Electoral Areas for this District
            for electoral_area_name in electoral_areas:
                ea, created = ElectoralArea.objects.get_or_create(
                    name=electoral_area_name,
                    province=province
                )
                if created:
                    print(f"    ✓ Created Electoral Area: {electoral_area_name}")
                    total_electoral_areas += 1
                else:
                    print(f"    • Already exists: {electoral_area_name}")
    
    print("=" * 70)
    print("\n📊 Data Load Summary:")
    print(f"  Provinces created: {total_provinces}")
    print(f"  Districts created: {total_districts}")
    print(f"  Electoral Areas created: {total_electoral_areas}")
    
    # Verify totals
    total_provinces_in_db = Province.objects.count()
    total_districts_in_db = District.objects.count()
    total_electoral_areas_in_db = ElectoralArea.objects.count()
    
    print(f"\n✓ Total in Database:")
    print(f"  Provinces: {total_provinces_in_db}")
    print(f"  Districts: {total_districts_in_db}")
    print(f"  Electoral Areas: {total_electoral_areas_in_db}")
    
    return total_provinces, total_districts, total_electoral_areas

if __name__ == "__main__":
    try:
        load_nepal_data()
        print("\n✅ Nepal administrative data successfully loaded!")
    except Exception as e:
        print(f"\n❌ Error loading data: {str(e)}")
        sys.exit(1)
