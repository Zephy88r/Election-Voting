import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser } from 'react-icons/fa';
import NotificationBell from './common/NotificationBell';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  /**
   * Handle profile icon click
   * Navigates directly to profile page if authenticated, otherwise to login
   */
  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div
        className="nav-left"
        onClick={handleHomeClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleHomeClick();
        }}
      >
        🇳🇵 Nepal Voting System
      </div>

      <div className="navbar-right">
        {isAuthenticated && <NotificationBell />}

        <div
          className="profile-container"
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
          aria-label={isAuthenticated ? 'Go to profile' : 'Go to login'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleProfileClick();
            }
          }}
        >
          {/* Profile icon */}
          <div className="profile-icon">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="profile-img" />
            ) : user?.name ? (
              <span className="profile-initial">
                {user.name[0]?.toUpperCase() || '👤'}
              </span>
            ) : (
              <FaUser />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
