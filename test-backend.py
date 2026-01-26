import requests
import json

def test_backend():
    """Test if the Django backend is running and responding"""
    base_url = "http://127.0.0.1:8000"
    
    print("Testing Nepal Election Backend...")
    print(f"Base URL: {base_url}")
    print("-" * 50)
    
    # Test endpoints
    endpoints = [
        "/elections/api/csrf/",
        "/elections/api/parties/",
        "/elections/api/auth/status/"
    ]
    
    for endpoint in endpoints:
        try:
            url = base_url + endpoint
            print(f"Testing: {url}")
            
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                print(f"✅ SUCCESS: {endpoint} - Status: {response.status_code}")
            else:
                print(f"⚠️  WARNING: {endpoint} - Status: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ ERROR: {endpoint} - Connection refused (backend not running?)")
        except requests.exceptions.Timeout:
            print(f"❌ ERROR: {endpoint} - Request timeout")
        except Exception as e:
            print(f"❌ ERROR: {endpoint} - {str(e)}")
        
        print()
    
    print("-" * 50)
    print("Backend test completed!")

if __name__ == "__main__":
    test_backend()