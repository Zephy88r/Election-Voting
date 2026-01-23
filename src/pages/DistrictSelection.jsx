import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { votingAPI } from '../services/api';
import voteLogo from '../assets/vote-logo.png';
import './DistrictSelection.css';

export default function DistrictSelection() {
  const navigate = useNavigate();
  const { provinceId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState([]);
  const [electoralAreas, setElectoralAreas] = useState([]);
  const [showElectoralModal, setShowElectoralModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const provinceNames = {
    koshi: 'Koshi',
    madhesh: 'Madhesh', 
    bagmati: 'Bagmati',
    gandaki: 'Gandaki',
    lumbini: 'Lumbini',
    karnali: 'Karnali',
    sudurpaschim: 'Sudurpashchim'
  };

  const userProvinceName = user?.province?.name || user?.province;
  const requiredProvinceName = provinceNames[provinceId];
  const hasAccess = userProvinceName === requiredProvinceName;

  useEffect(() => {
    const loadData = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use existing registration data endpoint
        const response = await fetch('/elections/api/registration-data/');
        const data = await response.json();
        
        const provinceData = data.provinces?.find(p => p.name === requiredProvinceName);
        
        if (provinceData) {
          setDistricts(provinceData.districts || []);
          setElectoralAreas(provinceData.electoral_areas || []);
        }
      } catch (err) {
        console.error('Error loading districts:', err);
        // Fallback to mock data
        const mockDistricts = [
          { id: 1, name: user?.district?.name || user?.district || 'Your District' }
        ];
        const mockElectoralAreas = [
          { id: 1, name: user?.electoral_area?.name || user?.electoral_area || 'Your Electoral Area' }
        ];
        setDistricts(mockDistricts);
        setElectoralAreas(mockElectoralAreas);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hasAccess, requiredProvinceName, user]);

  const handleDistrictClick = (district) => {
    const userDistrictName = user?.district?.name || user?.district;
    
    if (district.name !== userDistrictName) {
      return; // Restricted district
    }

    setSelectedDistrict(district);
    setShowElectoralModal(true);
  };

  const handleElectoralAreaSelect = (electoralArea) => {
    const userElectoralAreaName = user?.electoral_area?.name || user?.electoral_area;
    
    if (electoralArea.name !== userElectoralAreaName) {
      return; // Restricted electoral area
    }

    // Navigate to voting page
    navigate(`/${provinceId}/vote`);
  };

  const closeModal = () => {
    setShowElectoralModal(false);
    setSelectedDistrict(null);
  };

  if (!hasAccess) {
    return (
      <>
        <Navbar />
        <div className="districtShell">
          <div className="districtWrap">
            <div className="accessDenied">
              <h2>Access Denied</h2>
              <p>You can only vote in your registered province: <b>{userProvinceName}</b></p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Electoral Area Modal */}
      {showElectoralModal && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>{t('selectElectoralArea')}</h3>
              <button className="modalClose" onClick={closeModal}>×</button>
            </div>
            
            <div className="modalBody">
              <p className="modalSubtext">
                {t('chooseElectoralArea')} <strong>{selectedDistrict?.name}</strong>
              </p>
              
              <div className="electoralGrid">
                {electoralAreas.length > 0 ? (
                  electoralAreas.map((electoralArea) => {
                    const userElectoralAreaName = user?.electoral_area?.name || user?.electoral_area;
                    const isUserArea = electoralArea.name === userElectoralAreaName;
                    const isRestricted = !isUserArea;

                    return (
                      <div
                        key={electoralArea.id}
                        className={`electoralCard ${isRestricted ? 'restricted' : ''} ${isUserArea ? 'userArea' : ''}`}
                        onClick={() => handleElectoralAreaSelect(electoralArea)}
                      >
                        <div className="electoralIcon">🗳️</div>
                        <div className="electoralName">{electoralArea.name}</div>
                        {isUserArea && <div className="userBadge">{t('yourArea')}</div>}
                        {isRestricted && <div className="restrictedBadge">{t('restricted')}</div>}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="electoralCard userArea"
                    onClick={() => handleElectoralAreaSelect({ name: user?.electoral_area?.name || user?.electoral_area })}
                  >
                    <div className="electoralIcon">🗳️</div>
                    <div className="electoralName">{user?.electoral_area?.name || user?.electoral_area || t('yourElectoralArea')}</div>
                    <div className="userBadge">{t('yourArea')}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="districtShell">
        <div className="districtWrap">
          {loading ? (
            <div className="loadingBox">
              <LoadingSpinner size="lg" />
              <div>Loading districts...</div>
            </div>
          ) : (
            <div className="districtHero">
              <div className="districtHeader">
                <div className="districtTitleBlock">
                  <h1 className="districtTitle">{requiredProvinceName} {t('districts')}</h1>
                  <p className="districtSubtitle">{t('selectDistrictToProceed')}</p>
                </div>
                
                <div className="districtBadges">
                  <span className="pill pillStrong">{t('districtSelection')}</span>
                  <span className="pill">{t('province')}: {requiredProvinceName}</span>
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              <div className="districtGrid">
                {districts.map((district) => {
                  const userDistrictName = user?.district?.name || user?.district;
                  const isUserDistrict = district.name === userDistrictName;
                  const isRestricted = !isUserDistrict;

                  return (
                    <div
                      key={district.id}
                      className={`districtCard ${isRestricted ? 'restricted' : ''} ${isUserDistrict ? 'userDistrict' : ''}`}
                      onClick={() => handleDistrictClick(district)}
                    >
                      <div className="districtCardInner">
                        <div className="districtIcon">
                          <img src={voteLogo} alt="Vote" className="voteLogoIcon" />
                        </div>
                        <h3 className="districtName">{district.name}</h3>
                        <p className="districtInfo">
                          {isUserDistrict ? t('yourRegisteredDistrict') : t('accessRestricted')}
                        </p>
                        {isUserDistrict && (
                          <div className="userBadge">{t('available')}</div>
                        )}
                        {isRestricted && (
                          <div className="restrictedBadge">🔒 {t('restricted')}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="districtActions">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  {t('backToDashboard')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}