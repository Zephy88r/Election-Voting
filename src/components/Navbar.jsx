import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser } from 'react-icons/fa';
import NotificationBell from './common/NotificationBell';
import './Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth(); // user can be used for future image
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = (e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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
          ref={dropdownRef}
          onClick={toggleDropdown}
          role="button"
          tabIndex={0}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDropdown(e);
            }
          }}
        >
          {/* Default FaUser icon */}
          <div className="profile-icon">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="profile-img" />
            ) : (
              <FaUser />
            )}
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu" role="menu" onClick={(e) => e.stopPropagation()}>
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <button role="menuitem" onClick={() => setDropdownOpen(false)}>View Profile</button>
                  </Link>
                  <Link to="/voting-history">
                    <button role="menuitem" onClick={() => setDropdownOpen(false)}>Voting History</button>
                  </Link>
                  <button onClick={handleLogout} role="menuitem">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button role="menuitem" onClick={() => setDropdownOpen(false)}>Sign In</button>
                  </Link>
                  <Link to="/register">
                    <button role="menuitem" onClick={() => setDropdownOpen(false)}>Register</button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
