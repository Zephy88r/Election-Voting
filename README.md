# 🇳🇵 Nepal Election Voting System - Frontend

A professional, production-ready React-based frontend application for the Nepal Election Voting System. Built with modern React patterns, comprehensive validation, and backend-ready architecture.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration** with face verification
- **Secure Login** with face recognition
- **Profile Management** with photo upload and editing
- **Protected Routes** for authenticated users only
- **Session Management** with localStorage (ready for JWT tokens)

### 🗳️ Voting System
- **Province-based Voting** for all 7 provinces of Nepal
- **Candidate Selection** with detailed information
- **Vote Submission** with duplicate prevention
- **Voting History** tracking and display
- **Real-time Status** updates

### 📱 User Experience
- **Responsive Design** (Mobile, Tablet, Desktop)
- **Nepal Flag-Inspired Theme** (Crimson Red & Royal Blue)
- **Professional UI/UX** with smooth animations
- **Accessibility** (WCAG 2.1 AA compliant)
- **Loading States** and error handling
- **Notifications System** with bell icon

### 🛠️ Technical Features
- **Date Conversion** (AD ↔ BS - Bikram Sambat)
- **Form Validation** (Email, Phone, Password, etc.)
- **Face Capture** using device camera
- **Service Layer Architecture** for easy backend integration
- **Context API** for state management
- **Reusable Components** library

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nepal-election-demo
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
- The app will be available at `http://localhost:5173` (or the port Vite assigns)

### Build for Production

```bash
npm run build
npm run preview
```

## � Deployment

### Development Setup (Full Stack)

For local development with both frontend and backend:

1. **Follow the integration guide** in `INTEGRATION.md`
2. **Load initial data** for testing:
   ```bash
   python voting_system/manage.py load_initial_data
   ```
3. **Run integration tests**:
   ```bash
   python scripts/integration_test.py
   ```

### Production Deployment with Docker

1. **Update environment variables** in `docker-compose.yml`:
   - Set secure `DJANGO_SECRET_KEY`
   - Configure `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`
   - Update database credentials

2. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

### Manual Production Deployment

1. **Backend (Django)**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Set environment variables
   export DJANGO_DEBUG=False
   export DJANGO_SECRET_KEY=your-secure-key
   export DATABASE_URL=mysql://user:pass@host:port/db
   
   # Run migrations
   python voting_system/manage.py migrate
   
   # Load initial data
   python voting_system/manage.py load_initial_data
   
   # Collect static files
   python voting_system/manage.py collectstatic
   
   # Run with Gunicorn
   gunicorn voting_system.wsgi:application --bind 0.0.0.0:8000
   ```

2. **Frontend (React)**:
   ```bash
   npm run build
   # Serve static files with nginx or similar
   ```

## �📁 Project Structure

```
nepal-election-demo/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── SuccessMessage.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── features/        # Feature components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CameraCapture.jsx
│   │   │   └── VotingCard.jsx
│   ├── pages/
│   │   ├── Profile.jsx
│   │   ├── VotingHistory.jsx
│   │   └── provinces/       # Province voting pages
│   │       ├── Koshi.jsx
│   │       ├── Madhesh.jsx
│   │       ├── Bagmati.jsx
│   │       ├── Gandaki.jsx
│   │       ├── Lumbini.jsx
│   │       ├── Karnali.jsx
│   │       └── Sudurpashchim.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── services/
│   │   ├── api.js           # API service layer
│   │   ├── authService.js   # Authentication service
│   │   ├── votingService.js # Voting service
│   │   ├── notificationService.js
│   │   └── storageService.js
│   ├── utils/
│   │   ├── authUtils.js     # Auth utilities
│   │   ├── dateUtils.js     # Date conversion (AD ↔ BS)
│   │   ├── validation.js     # Form validation
│   │   └── storage.js       # Storage utilities
│   ├── constants/
│   │   └── theme.js         # Design system
│   ├── styles/
│   │   └── theme.css        # CSS variables
│   ├── config/
│   │   └── apiConfig.js     # API configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Color Palette (Nepal Flag Inspired)
- **Primary (Crimson Red)**: `#DC143C`
- **Secondary (Royal Blue)**: `#003893`
- **Accent (White)**: `#FFFFFF`
- **Success**: `#28A745`
- **Error**: `#DC143C`
- **Warning**: `#FFC107`
- **Info**: `#003893`

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Font Sizes**: 12px - 48px scale
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

## 🔌 Backend Integration

### Current State
The application currently uses **localStorage** for data persistence, making it perfect for development and demonstration.

### Switching to API Mode

1. **Update API Configuration**
   Edit `src/config/apiConfig.js`:
   ```javascript
   export const API_CONFIG = {
     USE_API: true,  // Enable API mode
     API_BASE_URL: 'https://your-backend-api.com/api',
   };
   ```

2. **Update Service Files**
   The service files (`authService.js`, `votingService.js`) are already structured for API integration. Simply uncomment the API calls and comment out the localStorage implementations.

3. **Backend Endpoints Required**

   **Authentication:**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `GET /api/auth/profile` - Get user profile
   - `PUT /api/auth/profile` - Update user profile
   - `POST /api/auth/logout` - Logout (optional)

   **Voting:**
   - `GET /api/voting/candidates/:provinceId` - Get candidates
   - `POST /api/voting/vote` - Submit vote
   - `GET /api/voting/status` - Get voting status

### API Request Format

All API requests include:
- **Headers**: `Content-Type: application/json`
- **Authorization**: `Bearer <token>` (for authenticated requests)
- **Body**: JSON format

### API Response Format

```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 📝 Form Validation

### Email Validation
- Valid email format
- Required field

### Phone Number Validation
- Nepal format: `+977-XX-XXXXXXX`
- Supports: `+977-98-1234567`, `977981234567`, `9812345678`

### Password Validation
- Minimum 6 characters
- Must contain: uppercase, lowercase, and special character
- Strength indicator (weak, medium, strong)

### Date Validation
- BS (Bikram Sambat) date format
- Age verification (18+)
- Future date prevention
- Automatic AD conversion

## 🗳️ Voting Flow

1. **User Registration**
   - Fill registration form
   - Capture face photo
   - Submit registration

2. **User Login**
   - Enter Voter ID and password
   - Capture face for verification
   - Access dashboard

3. **Select Province**
   - Choose province from dashboard
   - View candidates

4. **Cast Vote**
   - Select candidate
   - Submit vote
   - Receive confirmation

5. **View History**
   - Access voting history page
   - See all previous votes

## 🔔 Notifications

The application includes a notification system:
- **Vote Confirmations**: When votes are submitted
- **System Alerts**: Important updates
- **User Actions**: Registration, login confirmations

Notifications are stored in localStorage and can be easily migrated to a backend API.

## 🧪 Testing

### Manual Testing Checklist

- [ ] User Registration
  - [ ] Form validation
  - [ ] Face capture
  - [ ] Date conversion (AD ↔ BS)
  - [ ] Duplicate email/voter ID prevention

- [ ] User Login
  - [ ] Credential validation
  - [ ] Face verification
  - [ ] Error handling

- [ ] Profile Management
  - [ ] View profile
  - [ ] Edit profile
  - [ ] Photo upload

- [ ] Voting
  - [ ] Candidate selection
  - [ ] Vote submission
  - [ ] Duplicate vote prevention
  - [ ] Voting history

- [ ] Responsive Design
  - [ ] Mobile (320px+)
  - [ ] Tablet (768px+)
  - [ ] Desktop (1024px+)

## 🛠️ Technologies Used

- **React 18.2** - UI library
- **React Router DOM 6.30** - Routing
- **Vite 5.1** - Build tool
- **React Icons 4.10** - Icon library
- **Nepali Date Converter** - Date conversion utilities
- **Nepali Date Picker** - BS date picker component

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Considerations

### Current Implementation (localStorage)
- Passwords stored in plain text (for demo only)
- Face images stored as base64
- No encryption

### Production Recommendations
- **Never store passwords in plain text**
- Use JWT tokens for authentication
- Implement proper password hashing (bcrypt)
- Use HTTPS for all API calls
- Implement rate limiting
- Add CSRF protection
- Use secure storage for sensitive data

## 🚧 Future Enhancements

- [ ] Real-time vote counting
- [ ] Election results dashboard
- [ ] Candidate profiles with images
- [ ] Voting statistics
- [ ] Multi-language support (Nepali, English)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Admin dashboard
- [ ] Vote audit trail

## 📄 License

This project is for demonstration purposes.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Email: support@nepalvoting.gov.np
- Phone: +977-1-5555555

## 🙏 Acknowledgments

- Nepal Election Commission
- React Community
- Open source contributors

---

**Built with ❤️ for Nepal** 🇳🇵
