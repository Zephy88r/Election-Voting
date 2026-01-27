import requests

session = requests.Session()

# Login
login_data = {
    "email": "demo@example.com",
    "password": "Demo@12345",
}

response = session.post("http://127.0.0.1:8000/elections/api/voter/login/", json=login_data)
print(f"Login: {response.status_code}")
print(f"Response: {response.json()}")

# Try voting history
response = session.get("http://127.0.0.1:8000/elections/api/voting-history/")
print(f"Voting history status: {response.status_code}")
print(f"Response: {response.text[:200]}")
