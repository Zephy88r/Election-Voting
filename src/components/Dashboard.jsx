import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PROVINCES_DATA, getTranslatedProvinceName } from '../constants/provinces';
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
  const { t } = useLanguage();

  /**
   * Get user's province name from registration (e.g. 'Province 1')
   */
  const userProvinceName = user?.province?.name;
  
  // Debug: Log user data
  console.log('Dashboard user data:', user);
  console.log('User province name:', userProvinceName);

  /**
   * Check if a province is accessible to the user
   * Compare by `displayName` (e.g. 'Province 1') which matches the backend data
   */
  const isProvinceAccessible = (provinceObj) => {
    if (!isAuthenticated || !userProvinceName) return false;
    return String(provinceObj.displayName).toLowerCase().trim() === String(userProvinceName).toLowerCase().trim();
  };

  /**
   * Handle province card click
   * Redirects to login if user is not authenticated
   * Only allows access to user's registered province
   */
  const handleProvinceClick = (province) => {
    if (!isAuthenticated) {
      alert(t('pleaseSignIn'));
      navigate('/login');
      return;
    }

    // Check if user has access to this province (pass the full province object)
    if (!isProvinceAccessible(province)) {
      alert(t('accessDenied').replace('{provinceName}', userProvinceName));
      return;
    }

    navigate(`/vote/${province.routeName}`);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-content">
          {loading ? (
            <div className="dashboard-loading">
              <p>{t('loading')}</p>
            </div>
          ) : (
            <>
              {isAuthenticated && user && (
                <div className="dashboard-welcome">
                  <h2>{t('welcomeBack').replace('{name}', user.first_name || user.name || user.username)}</h2>
                  <p>{t('registeredIn')}: <strong>{userProvinceName || 'Not specified'}</strong></p>
                  <p>{t('selectProvinceToViewVoting')}</p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="dashboard-welcome">
                  <h2>{t('nepalElectionVotingSystem')}</h2>
                  <p>{t('pleaseSignInToAccess')}</p>
                </div>
              )}

              <h1>{t('selectYourProvince')}</h1>

              <div className="province-grid">
                {provinces.map((province) => {
                  const isAccessible = isProvinceAccessible(province);
                  const isDisabled = !isAuthenticated || !isAccessible;

                  return (
                    <div
                      key={province.name}
                      className={`province-card ${isDisabled ? 'disabled' : ''} ${!isAuthenticated ? 'not-authenticated' : ''}`}
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
                      {isDisabled && (
                        <div className="province-disabled-overlay">
                          <span className="province-disabled-text">
                            {!isAuthenticated ? t('validation.signInRequired') : t('validation.accessRestricted')}
                          </span>
                        </div>
                      )}
                      <div className="province-overlay">
                        <div className="province-info">
                          <h2>{getTranslatedProvinceName(province.routeName, t).replace(' Province', '').replace(' प्रदेश', '')}</h2>
                          <p className="province-label">{t('province')}</p>
                          {isAuthenticated && !isAccessible && (
                            <p className="province-restricted">{t('accessRestricted')}</p>
                          )}
                          {isAccessible && (
                            <p className="province-accessible">{t('yourProvince')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
