import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FaUser } from 'react-icons/fa';
import NotificationBell from './common/NotificationBell';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { language, toggleLanguage, t, getLanguageDisplayName } = useLanguage();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleLanguageSwitch = () => {
    toggleLanguage();
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
        🇳🇵 {t('appName')}
      </div>

      <div className="navbar-right">
        {isAuthenticated && <NotificationBell />}

        {/* Admin Link for admin users */}
        {isAuthenticated && (user?.is_admin || user?.is_superuser) && (
          <div
            className="admin-link"
            onClick={handleAdminClick}
            role="button"
            tabIndex={0}
            aria-label="Go to admin panel"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAdminClick();
              }
            }}
            style={{
              padding: '8px 12px',
              marginRight: '12px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Admin
          </div>
        )}

        {/* LANGUAGE SWITCH */}
        <div className="lang-switch">
          <span className="lang-text">{getLanguageDisplayName()}</span>

          <input
            type="checkbox"
            id="languageToggle"
            className="lang-toggle"
            onChange={handleLanguageSwitch}
          />

          <label htmlFor="languageToggle" className="lang-slider"></label>
        </div>


        {/* PROFILE */}
        <div
          className="profile-containe"
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
          <div className="profile-icon">
            {user?.faceImage || localStorage.getItem(`profileImage_${user?.id}`) ? (
              <img src={user?.faceImage || localStorage.getItem(`profileImage_${user?.id}`)} alt="Profile" className="profile-img" />
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
