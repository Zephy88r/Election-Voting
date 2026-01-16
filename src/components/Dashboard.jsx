import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Card from './common/Card';
import Button from './common/Button';
import './Dashboard.css';
import p1 from '../assets/Province-1.png';
import p2 from '../assets/Province-2.png';
import p3 from '../assets/Province-3.jpg';
import p4 from '../assets/Province-4.jpg';
import p5 from '../assets/Province-5.jpg';
import p6 from '../assets/province-6.png';
import p7 from '../assets/province-7.jpg';

/**
 * Province data with images and routes
 */
const provinces = [
  { name: 'Koshi', img: p1, path: '/koshi' },
  { name: 'Madhesh', img: p2, path: '/madhesh' },
  { name: 'Bagmati', img: p3, path: '/bagmati' },
  { name: 'Gandaki', img: p4, path: '/gandaki' },
  { name: 'Lumbini', img: p5, path: '/lumbini' },
  { name: 'Karnali', img: p6, path: '/karnali' },
  { name: 'Sudurpashchim', img: p7, path: '/sudurpaschim' },
];

/**
 * Dashboard Component
 * Main landing page displaying all provinces
 * Shows welcome message and quick stats for authenticated users
 */
function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  /**
   * Handle province card click
   * Redirects to login if user is not authenticated
   */
  const handleProvinceClick = (path) => {
    if (!isAuthenticated) {
      alert('Please sign in to access province voting pages');
      navigate('/login');
      return;
    }
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-content">
          {isAuthenticated && user && (
            <div className="dashboard-welcome">
              <h2>Welcome back, {user.name}!</h2>
              <p>Select a province to view voting information</p>
            </div>
          )}

          <h1>Select Your Province</h1>

          <div className="province-grid">
            {provinces.map((province, index) => (
              <div
                key={province.name}
                className={`province-card ${!isAuthenticated ? 'disabled' : ''}`}
                onClick={() => handleProvinceClick(province.path)}
                role="button"
                tabIndex={0}
                aria-label={`Navigate to ${province.name} province`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleProvinceClick(province.path);
                  }
                }}
              >
                <img src={province.img} alt={province.name} loading="lazy" />
                <div className="province-overlay">
                  <h2>{province.name}</h2>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">🇳🇵 Nepal Voting System</div>
        <div className="footer-contact">
          <p>support@nepalvoting.gov.np</p>
          <p>+977-1-5555555</p>
        </div>
      </footer>
    </>
  );
}

export default Dashboard;
