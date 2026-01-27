#!/usr/bin/env python
"""
Fix Electoral Areas Script
Ensures electoral areas are properly linked to districts and provinces
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from elections.models import Province, District, ElectoralArea

def fix_electoral_areas():
    """Fix electoral area data structure"""
    
    print("[INFO] Fixing Electoral Areas...")
    
    try:
        # Get all provinces
        provinces = Province.objects.all()
        
        for province in provinces:
            print(f"\n[INFO] Processing {province.name}...")
            
            # Get districts in this province
            districts = District.objects.filter(province=province)
            
            for district in districts:
                # Check if electoral area exists for this district
                electoral_area_name = f"{district.name} Area"
                
                electoral_area, created = ElectoralArea.objects.get_or_create(
                    name=electoral_area_name,
                    district=district,
                    defaults={
                        'province': province
                    }
                )
                
                if created:
                    print(f"  [OK] Created: {electoral_area_name}")
                else:
                    # Update existing electoral area to ensure proper links
                    electoral_area.district = district
                    electoral_area.province = province
                    electoral_area.save()
                    print(f"  [OK] Updated: {electoral_area_name}")
        
        # Verify the fix
        total_electoral_areas = ElectoralArea.objects.count()
        print(f"\n[OK] Total Electoral Areas: {total_electoral_areas}")
        
        # Show breakdown by province
        for province in provinces:
            count = ElectoralArea.objects.filter(province=province).count()
            print(f"  {province.name}: {count} areas")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error fixing electoral areas: {str(e)}")
        return False

def verify_registration_data_endpoint():
    """Test the registration data endpoint structure"""
    
    print("\n[INFO] Verifying Registration Data Structure...")
    
    try:
        provinces = Province.objects.all()
        
        for province in provinces:
            districts = District.objects.filter(province=province)
            electoral_areas = ElectoralArea.objects.filter(province=province)
            
            print(f"\n{province.name}:")
            print(f"  Districts: {districts.count()}")
            print(f"  Electoral Areas: {electoral_areas.count()}")
            
            # Show first few for verification
            for district in districts[:3]:
                district_areas = ElectoralArea.objects.filter(district=district)
                print(f"    {district.name}: {district_areas.count()} areas")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error verifying data: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("FIXING ELECTORAL AREAS ISSUE")
    print("=" * 60)
    
    # Fix electoral areas
    success1 = fix_electoral_areas()
    
    # Verify the fix
    success2 = verify_registration_data_endpoint()
    
    if success1 and success2:
        print("\n[SUCCESS] Electoral areas fixed!")
        print("The registration form should now show electoral area options.")
    else:
        print("\n[FAILED] Could not fix electoral areas")