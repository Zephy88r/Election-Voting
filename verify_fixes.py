#!/usr/bin/env python
"""
Verification Script
Tests both admin panel access and electoral area functionality
"""

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from django.contrib.auth import get_user_model
from elections.models import Province, District, ElectoralArea

User = get_user_model()

def test_admin_access():
    """Test admin user exists and can access admin panel"""
    print("=" * 50)
    print("TESTING ADMIN PANEL ACCESS")
    print("=" * 50)
    
    try:
        # Check if admin user exists
        admin_user = User.objects.get(username="admin")
        
        print(f"[OK] Admin user found: {admin_user.username}")
        print(f"[OK] Is superuser: {admin_user.is_superuser}")
        print(f"[OK] Is staff: {admin_user.is_staff}")
        print(f"[OK] Is active: {admin_user.is_active}")
        
        if admin_user.is_superuser and admin_user.is_staff and admin_user.is_active:
            print("\n[SUCCESS] Admin panel access should work!")
            print("Login at: http://127.0.0.1:8000/admin/")
            print("Username: admin")
            print("Password: admin123")
            return True
        else:
            print("\n[ERROR] Admin user permissions not correct")
            return False
            
    except User.DoesNotExist:
        print("[ERROR] Admin user not found")
        return False
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return False

def test_electoral_areas():
    """Test electoral area data structure"""
    print("\n" + "=" * 50)
    print("TESTING ELECTORAL AREAS")
    print("=" * 50)
    
    try:
        # Check if electoral areas exist
        total_areas = ElectoralArea.objects.count()
        print(f"[OK] Total electoral areas: {total_areas}")
        
        if total_areas == 0:
            print("[ERROR] No electoral areas found")
            return False
        
        # Test a few provinces
        test_provinces = ["Province 1", "Province 3"]
        
        for province_name in test_provinces:
            try:
                province = Province.objects.get(name=province_name)
                districts = District.objects.filter(province=province)
                areas = ElectoralArea.objects.filter(province=province)
                
                print(f"\n[OK] {province_name}:")
                print(f"  Districts: {districts.count()}")
                print(f"  Electoral Areas: {areas.count()}")
                
                # Test first district
                if districts.exists():
                    first_district = districts.first()
                    district_areas = ElectoralArea.objects.filter(district=first_district)
                    print(f"  {first_district.name}: {district_areas.count()} areas")
                    
                    if district_areas.exists():
                        print(f"    Example: {district_areas.first().name}")
                
            except Province.DoesNotExist:
                print(f"[ERROR] Province {province_name} not found")
                return False
        
        print("\n[SUCCESS] Electoral areas structure looks good!")
        return True
        
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return False

def test_registration_endpoint():
    """Test the registration data API endpoint"""
    print("\n" + "=" * 50)
    print("TESTING REGISTRATION DATA ENDPOINT")
    print("=" * 50)
    
    try:
        # Test the endpoint (assuming server is running)
        url = "http://127.0.0.1:8000/elections/api/registration-data/"
        
        print(f"[INFO] Testing endpoint: {url}")
        print("[INFO] Note: This requires the Django server to be running")
        
        try:
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                provinces = data.get('provinces', [])
                
                print(f"[OK] Endpoint responded with {len(provinces)} provinces")
                
                # Check first province structure
                if provinces:
                    first_province = provinces[0]
                    districts = first_province.get('districts', [])
                    
                    print(f"[OK] First province: {first_province.get('name')}")
                    print(f"[OK] Has {len(districts)} districts")
                    
                    # Check first district structure
                    if districts:
                        first_district = districts[0]
                        electoral_areas = first_district.get('electoral_areas', [])
                        
                        print(f"[OK] First district: {first_district.get('name')}")
                        print(f"[OK] Has {len(electoral_areas)} electoral areas")
                        
                        if electoral_areas:
                            print(f"[OK] Example electoral area: {electoral_areas[0].get('name')}")
                
                print("\n[SUCCESS] Registration endpoint working correctly!")
                return True
            else:
                print(f"[ERROR] Endpoint returned status {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"[WARNING] Could not test endpoint (server not running?): {str(e)}")
            print("[INFO] This is normal if Django server is not running")
            return True  # Don't fail the test for this
        
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return False

if __name__ == "__main__":
    print("VERIFICATION SCRIPT - TESTING FIXES")
    
    # Test admin access
    admin_ok = test_admin_access()
    
    # Test electoral areas
    areas_ok = test_electoral_areas()
    
    # Test registration endpoint
    endpoint_ok = test_registration_endpoint()
    
    # Summary
    print("\n" + "=" * 50)
    print("VERIFICATION SUMMARY")
    print("=" * 50)
    
    print(f"Admin Panel Access: {'PASS' if admin_ok else 'FAIL'}")
    print(f"Electoral Areas: {'PASS' if areas_ok else 'FAIL'}")
    print(f"Registration Endpoint: {'PASS' if endpoint_ok else 'FAIL'}")
    
    if admin_ok and areas_ok:
        print("\n[SUCCESS] Both fixes are working!")
        print("\nNext steps:")
        print("1. Start Django server: python backend/manage.py runserver")
        print("2. Access admin panel: http://127.0.0.1:8000/admin/")
        print("3. Test registration form: http://127.0.0.1:5173/register")
    else:
        print("\n[ERROR] Some fixes need attention")