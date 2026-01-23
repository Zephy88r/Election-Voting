# 🇳🇵 Nepal Election Voting System - Full Stack Integration

## ✅ Integration Complete

The frontend and backend are now fully integrated! The system now:

- **Stores votes in Django backend database**
- **Pulls candidates and parties from backend API**
- **Supports both English and Nepali languages**
- **Uses session-based authentication**

## 🚀 Quick Start

### Option 1: Use the Start Script
```bash
# Run both frontend and backend together
start-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1: Start Django Backend
cd voting_system
python manage.py runserver 127.0.0.1:8000

# Terminal 2: Start React Frontend  
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend Admin**: http://127.0.0.1:8000/admin
- **Backend API**: http://127.0.0.1:8000/elections/api/

## 🔧 Backend Integration Features

### API Endpoints Used:
- `POST /elections/api/voter/register/` - User registration
- `POST /elections/api/voter/login/` - User login  
- `GET /elections/api/voter/profile/` - User profile
- `GET /elections/api/parties/` - Get parties list
- `GET /elections/api/candidates/` - Get candidates list
- `POST /elections/api/vote/` - Submit vote

### Data Flow:
1. **Registration**: User data stored in Django User model
2. **Login**: Session-based authentication with Django
3. **Voting**: Votes stored in Django Vote model
4. **Parties/Candidates**: Loaded from Django database

## 🗳️ Voting Process

1. User registers/logs in through frontend
2. Frontend fetches parties from Django API
3. User selects party and submits vote
4. Vote is stored in Django database
5. Frontend shows confirmation

## 🔄 Language Support

The system supports both English and Nepali:
- **English**: Default language
- **Nepali**: Full translation including province names
- **Toggle**: Use NP/EN switch in navbar

## 🛠️ Development Notes

### Frontend Changes:
- Updated `apiConfig.js` to enable API mode
- Modified `votingService.js` to use backend APIs
- Updated `api.js` with correct Django endpoints
- Added fallback data for offline development

### Backend Changes:
- Added JSON API endpoint for vote submission
- Updated URL patterns for frontend integration
- CSRF token handling for session auth

### Proxy Configuration:
- Vite proxies `/elections/api/*` to Django
- Avoids CORS issues in development
- Session cookies work properly

## 📊 Database Schema

The backend uses these main models:
- **User**: Voter information and authentication
- **Province**: Nepal's 7 provinces
- **District**: Districts within provinces  
- **Party**: Political parties
- **Candidate**: Candidates for elections
- **Vote**: Individual vote records

## 🔒 Security Features

- Session-based authentication
- CSRF protection
- Vote duplication prevention
- User access control by province/district

## 🧪 Testing

1. Register a new user
2. Login with credentials
3. Select a province (must match registration)
4. Vote for a party
5. Check vote is stored in Django admin

## 📝 Next Steps

- Add candidate voting (FPTP)
- Implement voting history display
- Add real-time results
- Deploy to production environment

---

**The system is now fully integrated and ready for use!** 🎉