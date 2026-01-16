import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRemainingSessionTime, formatRemainingTime, extendSession, clearSessionTimeout } from '../../utils/sessionManager';
import Button from './Button';
import Card from './Card';
import './SessionWarning.css';

/**
 * Session Warning Component
 * Shows warning when session is about to expire
 * Allows user to extend session or logout
 */
function SessionWarning() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const remaining = getRemainingSessionTime();
      
      if (remaining !== null && remaining <= 5 * 60 * 1000 && remaining > 0) {
        setShowWarning(true);
        setRemainingTime(remaining);
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately
    checkSession();

    // Check every 10 seconds
    const interval = setInterval(checkSession, 10000);

    // Update remaining time every second when warning is shown
    const timeInterval = showWarning
      ? setInterval(() => {
          const remaining = getRemainingSessionTime();
          setRemainingTime(remaining);
          
          if (remaining <= 0) {
            handleLogout();
          }
        }, 1000)
      : null;

    return () => {
      clearInterval(interval);
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [showWarning]);

  const handleExtendSession = () => {
    extendSession();
    setShowWarning(false);
    setRemainingTime(null);
  };

  const handleLogout = () => {
    clearSessionTimeout();
    logout();
    navigate('/login');
  };

  if (!showWarning || !remainingTime) return null;

  return (
    <div className="session-warning-overlay">
      <Card className="session-warning-card" variant="elevated">
        <div className="session-warning-content">
          <h3>Session Expiring Soon</h3>
          <p>
            Your session will expire in{' '}
            <strong>{formatRemainingTime(remainingTime)}</strong>.
          </p>
          <p>Would you like to extend your session?</p>
          <div className="session-warning-actions">
            <Button
              variant="primary"
              onClick={handleExtendSession}
              className="session-extend-btn"
            >
              Extend Session
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="session-logout-btn"
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SessionWarning;
