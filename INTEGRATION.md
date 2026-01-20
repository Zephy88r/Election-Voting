Integration notes — React frontend <-> Django backend

Quick steps to run locally (development):

1. Create and activate a Python virtualenv:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install Python dependencies:

```powershell
python -m pip install -r requirements.txt
```

3. Load initial data (for testing):

```powershell
python voting_system\manage.py load_initial_data
```

4. Run Django migrations and start the dev server:

```powershell
python voting_system\manage.py migrate
python voting_system\manage.py runserver 8000
```

5. Start the React dev server (from project root):

```powershell
npm install
npm run dev
```

Testing the integration:

- Run the integration test script to validate the full register/login/vote cycle:

```powershell
python scripts\integration_test.py
```

Expected output (successful integration):
```
register 201 {"success": "Voter registered successfully"}
login 200 {"success": true, "user": {"id": 1, "username": "testuser@example.com", "email": "testuser@example.com"}}
csrf 200 {"csrf": "MleiWehkc6nUtaXnXFKY6J4X2NHycqU7Q3Jbc5sMARa3jSzlUzGSHFthAJHgoHJA"}
csrftoken cookie: eSF3q1lCyVXj0SM87464L6zuI6aSmrZD
profile 200 {"id": 1, "username": "testuser@example.com", "email": "testuser@example.com", "province": {"id": 1, "name": "Province 1"}, "district": {"id": 1, "name": "District 1"}, "electoral_area": {"id": 1, "name": "Area 1"}}
vote 201 {"success": "Vote recorded successfully."}
```

Frontend notes:
- The frontend now uses `src/config/apiConfig.js` to toggle API mode. By default `USE_API` is enabled and `API_BASE_URL` defaults to `http://localhost:8000`.
- The frontend `src/services/api.js` was updated to use session-based auth (fetch with `credentials: 'include'`). The Django backend is configured to allow CORS in development.

Backend notes:
- CORS is enabled via `django-cors-headers` and `CORS_ALLOW_ALL_ORIGINS = True` for development. This is not suitable for production.
- Simple JSON login/logout endpoints were added at:
  - `/elections/api/auth/login/` (POST JSON: `{ "voterId": "...", "password": "..." }`)
  - `/elections/api/auth/logout/` (POST)
- Registration endpoint is available at `/elections/api/voter/register/` and profile at `/elections/api/voter/profile/`.
- A custom `@api_login_required` decorator was created to return JSON 401 responses instead of HTML redirects for API endpoints.

Production & hardening notes:
- Settings are now environment-driven. Copy `.env.sample` to `.env` and fill production values.
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` are read from environment variables.
- In development (`DJANGO_DEBUG=True`) the app uses SQLite to simplify local setup. In production, configure your preferred DB using env vars and set `DJANGO_DEBUG=False`.

Next steps (recommended):
- Ensure `.env` is created on the server and secrets are stored securely (don't commit `.env`).
- Switch to token/JWT auth or configure secure CSRF cookie handling when deploying behind a proxy.
- Configure `CORS_ALLOWED_ORIGINS` strictly (no `CORS_ALLOW_ALL_ORIGINS` in prod).
- Add deployment instructions (Gunicorn/ASGI, reverse proxy, TLS) if you'd like.
