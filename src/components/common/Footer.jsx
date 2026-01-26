import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <h3>Nepal Election System</h3>
            <p className="tagline">Democratic • Transparent • Secure</p>
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
              <span className="stat-label">Provinces</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">77</span>
              <span className="stat-label">Districts</span>
            </div>
          </div>
          <p className="copyright">&copy; {currentYear} Nepal Election Commission</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;