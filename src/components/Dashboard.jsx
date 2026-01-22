import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PROVINCES_DATA } from '../constants/provinces';
import Navbar from './Navbar';
import Card from './common/Card';
import Button from './common/Button';
import './Dashboard.css';

/**
 * Province data from constants
 */
const provinces = PROVINCES_DATA;

/**
 * Dashboard Component
 * Main landing page displaying provinces
 * Shows only user's registered province for authenticated users
 * Shows all provinces (disabled) for unauthenticated users
 */
function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  /**
   * Get user's province name from registration (e.g. 'Koshi')
   */
  const userProvinceName = user?.province?.name;

  /**
   * Check if a province is accessible to the user
   * Compare by `name` (e.g. 'Koshi') rather than the displayName ('Province 1')
   */
  const isProvinceAccessible = (provinceObj) => {
    if (!isAuthenticated || !userProvinceName) return false;
    return String(provinceObj.name).toLowerCase().trim() === String(userProvinceName).toLowerCase().trim();
  };

  /**
   * Handle province card click
   * Redirects to login if user is not authenticated
   * Only allows access to user's registered province
   */
  const handleProvinceClick = (province) => {
    if (!isAuthenticated) {
      alert('Please sign in to access province voting pages');
      navigate('/login');
      return;
    }

    // Check if user has access to this province (pass the full province object)
    if (!isProvinceAccessible(province)) {
      alert(`Access Denied: You can only vote in ${userProvinceName}`);
      return;
    }

    navigate(province.path);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-content">
          {loading ? (
            <div className="dashboard-loading">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {isAuthenticated && user && (
                <div className="dashboard-welcome">
                  <h2>Welcome back, {user.name}!</h2>
                  <p>You are registered in: <strong>{userProvinceName}</strong></p>
                  <p>Select your province to view voting information</p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="dashboard-welcome">
                  <h2>Nepal Election Voting System</h2>
                  <p>Please sign in to access your province voting page</p>
                </div>
              )}

              <h1>Select Your Province</h1>

              <div className="province-grid">
                {provinces.map((province) => {
                  const isAccessible = isProvinceAccessible(province);
                  const isDisabled = !isAuthenticated || !isAccessible;

                  return (
                    <div
                      key={province.name}
                      className={`province-card ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => handleProvinceClick(province)}
                      role="button"
                      tabIndex={isDisabled ? -1 : 0}
                      aria-label={`Navigate to ${province.name} province`}
                      aria-disabled={isDisabled}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                          handleProvinceClick(province);
                        }
                      }}
                      style={{
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <img src={province.img} alt={province.name} loading="lazy" />
                      <div className="province-overlay">
                        <h2>{province.name}</h2>
                        {isAuthenticated && !isAccessible && (
                          <p className="province-restricted"> Access Restricted</p>
                        )}
                        {isAccessible && (
                          <p className="province-accessible">Your Province</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">🇳🇵 Nepal Voting System</div>
        <div className="footer-contact">
          <p>support@nepalvoting.gov.np</p>
          <p>+977-1-5555555</p>
        </div>
      </footer>
    </>
  );
}

export default Dashboard;
