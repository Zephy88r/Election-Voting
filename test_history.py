#!/usr/bin/env python
"""
Test voting history endpoint
"""

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

BASE_URL = "http://127.0.0.1:8000"

def test_voting_history():
    """Test voting history endpoint"""
    
    # Test with user_email parameter
    print("Testing voting history with user_email parameter...")
    response = requests.get(f"{BASE_URL}/elections/api/voting-history?user_email=sadi@gmail.com")
    print(f"Response status: {response.status_code}")
    print(f"Response text: {response.text}")
    
    # Test with session (login first)
    print("\nTesting with session authentication...")
    session = requests.Session()
    
    login_data = {
        "email": "sadi@gmail.com",
        "password": "sadi123"
    }
    
    login_response = session.post(f"{BASE_URL}/elections/api/voter/login/", json=login_data)
    print(f"Login status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        history_response = session.get(f"{BASE_URL}/elections/api/voting-history/")
        print(f"History status: {history_response.status_code}")
        print(f"History response: {history_response.text}")

if __name__ == "__main__":
    test_voting_history()