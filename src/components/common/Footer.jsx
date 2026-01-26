import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <h3>{t('footerTitle')}</h3>
            <p className="tagline">{t('footerTagline')}</p>
          </div>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+977-1-5555555</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>support@nepalvoting.gov.np</span>
            </div>
          </div>
        </div>
        
        <div className="footer-right">
          <div className="stats-info">
            <div className="stat-item">
              <span className="stat-number">7</span>
              <span className="stat-label">{t('footerProvinces')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">77</span>
              <span className="stat-label">{t('footerDistricts')}</span>
            </div>
          </div>
          <p className="copyright">&copy; {currentYear} {t('footerCopyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;