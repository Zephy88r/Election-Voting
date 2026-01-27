import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';
import App from './App.jsx';
import { API_CONFIG } from './config/apiConfig';

// Verify root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found!');
}

// Create root and render
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);

// When running in API mode, ensure CSRF cookie is set for Django session auth
if (API_CONFIG.USE_API) {
  const base = API_CONFIG.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  fetch(`${base}/elections/api/csrf/`, { credentials: 'include' }).catch(()=>{});
}

