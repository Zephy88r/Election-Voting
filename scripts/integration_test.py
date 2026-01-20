import requests

BASE = "http://127.0.0.1:8000/elections"

s = requests.Session()

# 1) Register a test user
reg = s.post(f"{BASE}/api/voter/register/", json={
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "pass1234",
    "province_id": 1,
    "district_id": 1,
    "electoral_area": 1,
})
print('register', reg.status_code, reg.text)

# 2) Login
login = s.post(f"{BASE}/api/auth/login/", json={
    "voterId": "testuser@example.com",
    "password": "pass1234",
})
print('login', login.status_code, login.text)

# 3) Get CSRF token (sets cookie)
csrf = s.get(f"{BASE}/api/csrf/")
print('csrf', csrf.status_code, csrf.text)
csrftoken = s.cookies.get('csrftoken')
print('csrftoken cookie:', csrftoken)

# 4) Try profile
profile = s.get(f"{BASE}/api/voter/profile/")
print('profile', profile.status_code, profile.text)

# 5) Try to submit a PR vote (assuming party id 1 exists)
headers = {'X-CSRFToken': csrftoken} if csrftoken else {}
vote = s.post(f"{BASE}/api/vote/", json={
    "vote_type": "PR",
    "party_id": 1,
}, headers=headers)
print('vote', vote.status_code, vote.text)
