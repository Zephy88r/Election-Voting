import requests, time
BASE='http://localhost:5175'
s=requests.Session()
print('GET registration-data', s.get(f'{BASE}/elections/api/registration-data/').status_code)
uid='proxytest_'+time.strftime('%Y%m%d%H%M%S')
payload={'name':'Proxy Test', 'email':f'{uid}@test.com', 'password':'TestPass123!','province_id':1,'district_id':1,'electoral_area_id':1}
r=s.post(f'{BASE}/elections/api/voter/register/', json=payload)
print('Register status', r.status_code)
print('Response', r.text)
r2=s.get(f'{BASE}/elections/api/voter/profile/')
print('Profile status', r2.status_code, 'body', r2.text)
