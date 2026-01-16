import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CameraCapture from './CameraCapture';
import { validateField } from '../utils/validation';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import ErrorMessage from './common/ErrorMessage';
import SuccessMessage from './common/SuccessMessage';
import './Login.css';

/**
 * Login Component
 * Handles user authentication with face verification
 * Uses AuthContext for authentication state management
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [faceImage, setFaceImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    voterId: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const newErrors = {};

    const voterIdValidation = validateField('voterId', formData.voterId);
    if (!voterIdValidation.valid) {
      newErrors.voterId = voterIdValidation.error;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    if (!faceImage) {
      setError('Please capture your face for verification before logging in');
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        voterId: formData.voterId.trim(),
        password: formData.password,
        faceImage: faceImage,
      };

      await login(credentials);

      setSuccess('Login successful! Redirecting...');

      // Redirect to dashboard or previous location
      const from = location.state?.from?.pathname || '/';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" variant="elevated">
        <div className="login-header">
          <h1>Nepal Election Voting System</h1>
          <p>Please enter your details to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Voter ID */}
          <Input
            type="text"
            label="Voter ID"
            name="voterId"
            value={formData.voterId}
            onChange={handleChange}
            placeholder="Enter your voter ID"
            required
            error={errors.voterId}
          />

          {/* Password */}
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={errors.password}
            rightIcon={
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                role="button"
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsPasswordVisible(!isPasswordVisible);
                  }
                }}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            }
          />

          {/* Forgot Password */}
          <div className="login-extra">
            <Button
              type="button"
              variant="outline"
              onClick={() => alert('Forgot password functionality coming soon!')}
              className="gradient-button"
            >
              Forgot Password?
            </Button>
          </div>

          {/* Face Verification */}
          <div className="l-cam">
            <h3>Face Verification</h3>
            <CameraCapture onCapture={setFaceImage} />
            {faceImage && <p>Face captured successfully ✔</p>}
          </div>

          {/* Error and Success Messages */}
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            className="submit-button-login"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>

          {/* New User Register */}
          <div className="new-user">
            <p>
              New User?{' '}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/register')}
                className="gradient-button"
              >
                Register Here
              </Button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Login;
