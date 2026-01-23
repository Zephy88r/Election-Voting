import requests
import json

# Test vote submission
def test_vote_submission():
    base_url = "http://127.0.0.1:8000"
    
    # First login
    login_data = {
        "voterId": "ankit@gmail.com",  # Existing test user
        "password": "password123"
    }
    
    session = requests.Session()
    
    # Get CSRF token
    csrf_response = session.get(f"{base_url}/elections/api/csrf/")
    if csrf_response.status_code == 200:
        csrf_token = csrf_response.json().get('csrf')
        session.headers.update({'X-CSRFToken': csrf_token})
    
    # Login
    login_response = session.post(
        f"{base_url}/elections/api/auth/login/",
        json=login_data
    )
    
    if login_response.status_code == 200:
        print("✅ Login successful")
        
        # Submit a PR vote
        vote_data = {
            "vote_type": "PR",
            "party_id": 1  # CPN UML
        }
        
        vote_response = session.post(
            f"{base_url}/elections/api/vote/",
            json=vote_data
        )
        
        print(f"Vote response: {vote_response.status_code}")
        print(f"Vote data: {vote_response.text}")
        
        if vote_response.status_code == 201:
            print("✅ Vote submitted successfully!")
            
            # Check voting history
            history_response = session.get(f"{base_url}/elections/api/voting-history/")
            if history_response.status_code == 200:
                history = history_response.json()
                print(f"✅ Voting history: {json.dumps(history, indent=2)}")
            else:
                print(f"❌ Failed to get voting history: {history_response.text}")
        else:
            print(f"❌ Vote submission failed: {vote_response.text}")
    else:
        print(f"❌ Login failed: {login_response.text}")

if __name__ == "__main__":
    test_vote_submission()