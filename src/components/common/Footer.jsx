import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Decorative Mountain Silhouette */}
      <div className="footer-mountains">
        <svg viewBox="0 0 1200 120" className="mountain-svg">
          <path d="M0,120 L0,80 L200,20 L400,60 L600,10 L800,50 L1000,30 L1200,70 L1200,120 Z" 
                fill="rgba(220, 20, 60, 0.1)" />
          <path d="M0,120 L0,90 L150,40 L350,70 L550,25 L750,55 L950,35 L1200,75 L1200,120 Z" 
                fill="rgba(0, 56, 147, 0.1)" />
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <div className="nepal-flag">
                  <div className="flag-triangle flag-blue"></div>
                  <div className="flag-triangle flag-red"></div>
                  <div className="flag-symbols">
                    <div className="sun">☀</div>
                    <div className="moon">☽</div>
                  </div>
                </div>
              </div>
              <div className="logo-text">
                <h3>{t('appName')}</h3>
                <p className="tagline">Democratic • Transparent • Secure</p>
              </div>
            </div>
            <p className="footer-description">
              Empowering Nepal's democratic future through secure, transparent, and accessible digital voting technology.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/voting-history">Voting History</a></li>
              <li><a href="/help">Help Center</a></li>
            </ul>
          </div>

          {/* Voting Info */}
          <div className="footer-section">
            <h4>Voting Information</h4>
            <ul className="footer-links">
              <li><a href="/provinces">Province Voting</a></li>
              <li><a href="/districts">District Voting</a></li>
              <li><a href="/candidates">Candidates</a></li>
              <li><a href="/results">Election Results</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
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
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Nepal Election Commission. All rights reserved.</p>
              <p className="built-with">Built with ❤️ for Nepal 🇳🇵</p>
            </div>
            <div className="footer-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>Secure</span>
              </div>
              <div className="badge">
                <span className="badge-icon">✅</span>
                <span>Verified</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🏛️</span>
                <span>Official</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="footer-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </footer>
  );
};

export default Footer;