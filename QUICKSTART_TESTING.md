# QUICK START GUIDE - Nepal Election Voting System

## ✅ System Status: READY FOR TESTING

Both backend and frontend are running and fully integrated.

---

## ACCESSING THE SYSTEM

### Frontend (React)
🌐 **URL:** http://localhost:5174/

### Backend API
🔌 **URL:** http://127.0.0.1:8000/

---

## TEST ACCOUNTS

All three accounts are ready to use. Pick any one:

```
┌─────────────────────────────────────────────────────────────┐
│ Account 1 (Bagmati Province)                               │
├─────────────────────────────────────────────────────────────┤
│ Username/Email: voter1 | voter1@test.com                    │
│ Password: testpass123                                        │
│ Province: Bagmati (District: Kathmandu)                      │
│ Electoral Area: Bagmati Electoral Area 1                     │
│ Candidates Available: 3                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Account 2 (Gandaki Province)                                │
├─────────────────────────────────────────────────────────────┤
│ Username/Email: voter2 | voter2@test.com                    │
│ Password: testpass123                                        │
│ Province: Gandaki (District: Pokhara)                        │
│ Electoral Area: Gandaki Electoral Area 1                     │
│ Candidates Available: 3                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Account 3 (Lumbini Province)                                │
├─────────────────────────────────────────────────────────────┤
│ Username/Email: voter3 | voter3@test.com                    │
│ Password: testpass123                                        │
│ Province: Lumbini (District: Kapilvastu)                     │
│ Electoral Area: Lumbini Electoral Area 1                     │
│ Candidates Available: 3                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## TESTING WORKFLOW

### 1️⃣ LOGIN
- Open http://localhost:5174/
- Click "Log In"
- Enter credentials for voter1 (or voter2/voter3)
  - Email: `voter1@test.com`
  - Password: `testpass123`
- Click "Log In"

### 2️⃣ VIEW DASHBOARD
- After login, you should see the dashboard
- Only your assigned province will be enabled (clickable)
- Other provinces will be grayed out

**Example:**
- If logged in as voter1 → Only "Bagmati" is clickable
- If logged in as voter2 → Only "Gandaki" is clickable
- If logged in as voter3 → Only "Lumbini" is clickable

### 3️⃣ ACCESS YOUR PROVINCE
- Click your province card
- This will load the province voting page
- You should see:
  - Province name and details
  - Available candidates (3 per electoral area)
  - Political parties (5 available)

### 4️⃣ VIEW CANDIDATES
- Scroll down to see candidate list
- Each candidate shows:
  - Candidate name
  - Associated party
  - Vote button

### 5️⃣ CAST YOUR VOTE
- Click "Vote for [Candidate Name]"
- You should see a success notification
- Voting should now be locked for this vote type

### 6️⃣ CHECK VOTING HISTORY
- Navigate to "Voting History" (via Navbar)
- Should display:
  - Your vote details
  - Province voted in
  - Vote timestamp
  - Total votes cast

### 7️⃣ CHECK NOTIFICATIONS
- Click the bell icon (🔔) in the top-right
- Notification dropdown should show:
  - Voting confirmations
  - System messages
  - Option to mark as read or clear

---

## AVAILABLE FEATURES

### ✅ Working Features
- [x] User login with email/password
- [x] Session-based authentication
- [x] Province access control (users can only vote in their registered province)
- [x] Candidate display with party affiliation
- [x] Vote submission (FPTP and PR systems)
- [x] Voting history retrieval
- [x] Notification system
- [x] User profile viewing
- [x] Multi-province support
- [x] CSRF protection
- [x] CORS enabled for frontend

### 📋 Test Data Available
- **7 Provinces:** Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim
- **28 Districts:** Multiple districts per province
- **14 Electoral Areas:** 2 per province
- **42 Candidates:** 3 per electoral area (6 total per province)
- **5 Political Parties:** Nepali Congress, CPN-UML, CPN-Maoist, Janata Dal, Socialist Party
- **3 Test Voters:** Pre-configured with different provinces

---

## TROUBLESHOOTING

### ❌ "Failed to fetch" error
**Solution:** 
- Ensure Django backend is running: `python manage.py runserver 127.0.0.1:8000`
- Check that frontend is using `http://127.0.0.1:8000` (not localhost)
- Verify CORS is enabled in Django settings

### ❌ "Server response is not JSON"
**Solution:**
- Backend is likely returning HTML error page
- Check Django console for errors
- Verify all API routes are correct in `elections/urls.py`

### ❌ "401 Unauthorized" on API calls
**Solution:**
- Login first (session must be established)
- Check that cookies are being sent (enable in browser)
- Verify user has `is_authenticated` flag

### ❌ "Cannot access province - showing 'Access Denied'"
**Solution:**
- This is working as intended - users can only vote in their registered province
- Try logging in with a different test account to access different provinces
- To change your province: Create new user with seed script or manual creation

### ❌ "No candidates showing"
**Solution:**
- This should not happen after seeding
- If occurs, restart Django server
- Re-run: `python manage.py seed_test_users` to refresh candidates

### ❌ Frontend stuck on loading
**Solution:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check browser console (F12) for JavaScript errors

---

## TESTING MULTIPLE VOTERS

To test with all three voters:

1. **Login as voter1**, vote in Bagmati, check history
2. **Logout** (click profile → Logout)
3. **Login as voter2**, vote in Gandaki, check history
4. **Logout**
5. **Login as voter3**, vote in Lumbini, check history

This verifies:
- ✅ Multiple users can vote independently
- ✅ Province isolation works correctly
- ✅ Voting history is per-user
- ✅ No cross-user data leakage

---

## ADMIN ACCESS

Django Admin is available at: `http://127.0.0.1:8000/admin/`

**Note:** No admin user created by default. To create one:
```bash
cd Vot/voting_system
python manage.py createsuperuser
```

Then use those credentials to access `/admin/`

---

## IMPORTANT NOTES

1. **Session-Based Auth:** Each user is identified by Django session cookie
   - No JWT tokens are used
   - Sessions expire after browser close or timeout
   - Cookies must be enabled in browser

2. **Electoral Area Restrictions:** Users can ONLY vote in their registered electoral area
   - This is enforced at both frontend and backend
   - Try to access a different province → you'll be blocked

3. **One Vote Per Type:** Each user can only submit:
   - 1 FPTP vote (candidate vote)
   - 1 PR vote (party vote)
   - Attempting to vote twice returns 409 Conflict

4. **Data Persistence:** All votes and user data stored in SQLite database
   - Database file: `Vot/voting_system/db.sqlite3`
   - Survives server restarts
   - Clear database to reset: `rm db.sqlite3` then re-migrate

---

## API ENDPOINTS (REFERENCE)

```
POST   /elections/api/auth/login/              → Login
POST   /elections/api/auth/logout/             → Logout
GET    /elections/api/voter/profile/           → Get user profile
POST   /elections/api/voter/register/          → Register new voter
GET    /elections/api/candidates/              → Get candidates for electoral area
GET    /elections/api/parties/                 → Get all parties
POST   /elections/api/vote/                    → Submit vote
GET    /elections/api/voting/status/           → Get voting status
GET    /elections/api/voting-history/          → Get voting history
GET    /elections/api/notifications/           → Get notifications
POST   /elections/api/notifications/           → Create notification
POST   /elections/api/notifications/{id}/read/ → Mark as read
DELETE /elections/api/notifications/{id}/      → Delete notification
```

---

## NEXT STEPS

1. ✅ Backend running? Check: `curl http://127.0.0.1:8000/`
2. ✅ Frontend running? Check: `http://localhost:5174/`
3. ✅ Can you login? Try with voter1/testpass123
4. ✅ Can you see candidates? Click your province
5. ✅ Can you vote? Submit and check confirmation
6. ✅ All working? System is ready for production testing!

---

**Last Updated:** January 21, 2026  
**Status:** ✅ READY FOR TESTING  
**Questions?** Check `INCIDENT_RESOLUTION_REPORT.md` for detailed technical documentation
