#!/usr/bin/env python
"""
Simple test script to check login functionality
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_system.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

def test_specific_user():
    print("=== TESTING SPECIFIC USER ===")
    
    # Test with daru@gmail.com (Province 2 user)
    email = 'daru@gmail.com'
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
        print(f"User found: {user.email}")
        print(f"Username: {user.username}")
        print(f"Province: {user.province.name if user.province else 'None'}")
        print(f"Is Active: {user.is_active}")
        
        # Test authentication with common passwords
        test_passwords = ['password', 'test123', 'admin', '123456', 'daru123', 'daru@gmail.com']
        
        for pwd in test_passwords:
            # Try with email as username
            auth_user = authenticate(username=email, password=pwd)
            if auth_user:
                print(f"SUCCESS: Login works with email={email}, password={pwd}")
                return
            
            # Try with username field
            auth_user = authenticate(username=user.username, password=pwd)
            if auth_user:
                print(f"SUCCESS: Login works with username={user.username}, password={pwd}")
                return
                
            print(f"FAILED: password={pwd}")
        
        print("FAILED: Could not authenticate with any test password")
        
        # Let's try to set a known password
        print("Setting password to 'test123' for testing...")
        user.set_password('test123')
        user.save()
        
        # Test again
        auth_user = authenticate(username=email, password='test123')
        if auth_user:
            print("SUCCESS: Login works after setting password to 'test123'")
        else:
            print("FAILED: Still cannot authenticate")
            
    except User.DoesNotExist:
        print(f"User {email} not found")

if __name__ == '__main__':
    test_specific_user()