# Nepal Election Voting System - Frontend

A React-based frontend application for the Nepal Election Voting System.

## Features

- **Login Page**: Form with Name, Address, Citizenship Number, and Voter ID fields
- **Dashboard Page**: Placeholder page ready for expansion
- **Form Validation**: Client-side validation for all required fields
- **Nepal Flag Theme**: Styled with red, blue, and white colors inspired by the Nepal flag
- **Backend-Ready**: Proper form handling and structure for easy backend integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Backend Integration

The Login component is structured to easily integrate with your backend API. The form data is available in the `handleSubmit` function and can be sent to your backend endpoint.

Example API integration in `Login.jsx`:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) {
    return
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    if (response.ok) {
      navigate('/dashboard')
    } else {
      // Handle error
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
```

## Project Structure

```
nepal-election-frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

- React 19
- React Router DOM
- Vite
- CSS3
