#!/usr/bin/env python
import requests
from http.cookiejar import CookieJar

# Create session to handle cookies
session = requests.Session()

print("=" * 60)
print("TESTING ADMIN LOGIN")
print("=" * 60)

# Step 1: Get login page to get CSRF token
print("\n1. Fetching login page...")
response = session.get('http://127.0.0.1:8000/admin/login/')
print(f"   Status: {response.status_code}")

# Extract CSRF token from cookies
csrf_token = session.cookies.get('csrftoken')
print(f"   CSRF Token: {csrf_token}")

if not csrf_token:
    # Try to extract from HTML
    import re
    match = re.search(r'csrfmiddlewaretoken["\']?\s*[:=]\s*["\']([^"\']+)["\']', response.text)
    if match:
        csrf_token = match.group(1)
        print(f"   CSRF Token from HTML: {csrf_token}")

# Step 2: Login
if csrf_token:
    print("\n2. Attempting login...")
    login_data = {
        'username': 'admin',
        'password': 'admin',
        'csrfmiddlewaretoken': csrf_token,
    }
    
    response = session.post(
        'http://127.0.0.1:8000/admin/login/',
        data=login_data,
        allow_redirects=False
    )
    print(f"   Status: {response.status_code}")
    print(f"   Location: {response.headers.get('Location', 'N/A')}")
    
    # Check if we have session
    session_cookie = session.cookies.get('sessionid')
    print(f"   Session ID: {session_cookie}")
    
    # Step 3: Access admin dashboard
    if response.status_code in [301, 302]:
        print("\n3. Following redirect to admin dashboard...")
        response = session.get(response.headers['Location'])
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Successfully accessed admin dashboard!")
        else:
            print("   ❌ Failed to access dashboard")
            print(f"   Response: {response.text[:200]}")
else:
    print("❌ Could not find CSRF token")
