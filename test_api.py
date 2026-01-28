#!/usr/bin/env python
"""
Test the login API endpoint directly
"""
import requests
import json

def test_login_api():
    url = "http://127.0.0.1:8000/elections/api/voter/login/"
    
    # Test data
    login_data = {
        "email": "daru@gmail.com",
        "password": "test123"
    }
    
    try:
        print(f"Testing login API: {url}")
        print(f"Data: {login_data}")
        
        response = requests.post(
            url,
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login API works!")
        else:
            print("❌ Login API failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server. Is it running?")
        print("Start the server with: cd backend && python manage.py runserver")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_login_api()