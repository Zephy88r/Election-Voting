import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FaUser } from 'react-icons/fa';
import NotificationBell from './common/NotificationBell';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
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

        {/* LANGUAGE SWITCH */}
        <div className="lang-switch">
          <span className="lang-text">{language}</span>

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
