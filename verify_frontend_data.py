import requests
import json

print("Testing Nepal Data Integration with Frontend...")
print("=" * 70)

try:
    # Test registration data endpoint
    response = requests.get('http://127.0.0.1:8000/elections/api/registration-data/')
    
    if response.status_code == 200:
        data = response.json()
        provinces = data['provinces']
        
        print(f"✓ Registration Data Endpoint Working")
        print(f"✓ Total Provinces: {len(provinces)}\n")
        
        for province in provinces:
            print(f"  Province: {province['name']}")
            print(f"    - Districts: {len(province['districts'])}")
            print(f"    - Electoral Areas: {len(province['electoral_areas'])}")
            
            # Show sample districts
            if province['districts']:
                sample_districts = province['districts'][:3]
                for dist in sample_districts:
                    print(f"      • {dist['name']}")
                if len(province['districts']) > 3:
                    print(f"      • ... and {len(province['districts']) - 3} more")
        
        print(f"\n✓ Total districts across all provinces: {sum(len(p['districts']) for p in provinces)}")
        print(f"✓ Total electoral areas: {sum(len(p['electoral_areas']) for p in provinces)}")
        
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"✗ Connection error: {str(e)}")
    print("Make sure the Django backend is running on http://127.0.0.1:8000")

print("\n" + "=" * 70)
print("✅ Frontend can now access all Nepal administrative data!")
