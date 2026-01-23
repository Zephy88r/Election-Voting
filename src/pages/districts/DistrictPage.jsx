import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../components/Navbar';
import ElectoralModal from '../electoral/ElectoralModal';
import './DistrictPage.css';

const DistrictCard = ({ district, onClick, isDisabled }) => {
  const { t } = useLanguage();
  return (
    <div
      className={`district-card ${isDisabled ? 'disabled' : ''}`}
      onClick={() => !isDisabled && onClick(district)}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
          onClick(district);
        }
      }}
    >
      <h3>{district.name}</h3>
      {isDisabled && <p className="district-restricted">{t('accessRestricted')}</p>}
    </div>
  );
};

function DistrictPage() {
  const { provinceId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(`/api/districts/?province_id=${provinceId}`);
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    fetchDistricts();
  }, [provinceId]);

  const userDistrictName = user?.district?.name;

  const isDistrictAccessible = (district) => {
    if (!userDistrictName) return false;
    return String(district.name).toLowerCase().trim() === String(userDistrictName).toLowerCase().trim();
  };

  const handleDistrictClick = (district) => {
    if (!isDistrictAccessible(district)) {
      alert(t('accessDenied', { districtName: userDistrictName }));
      return;
    }
    setSelectedDistrict(district);
  };

  const handleCloseModal = () => {
    setSelectedDistrict(null);
  };

  return (
    <>
      <Navbar />
      <div className="district-page">
        <div className="district-page-content">
          {loading ? (
            <div className="district-page-loading">
              <p>{t('loading')}...</p>
            </div>
          ) : (
            <>
              <h1>{t('selectYourDistrict')}</h1>
              <div className="district-grid">
                {districts.map((district) => {
                  const isAccessible = isDistrictAccessible(district);
                  const isDisabled = !isAccessible;
                  return (
                    <DistrictCard
                      key={district.id}
                      district={district}
                      onClick={handleDistrictClick}
                      isDisabled={isDisabled}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      {selectedDistrict && (
        <ElectoralModal district={selectedDistrict} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default DistrictPage;
