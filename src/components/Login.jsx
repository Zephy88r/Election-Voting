import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import CameraCapture from './CameraCapture';
import { validateField } from '../utils/validation';
import { getErrorMessage, getSuccessMessage } from '../utils/errorMessages';
import { sanitizeEmail } from '../utils/sanitize';
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
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Sanitize email input
    const sanitizedValue = name === 'email' ? sanitizeEmail(value) : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

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

    const emailValidation = validateField('email', formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
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

    // Note: Face verification is optional for now - can be enabled later
    // if (!faceImage) {
    //   setError('Please capture your face for verification before logging in');
    //   return;
    // }

    setIsLoading(true);

    try {
      // TODO: Replace with POST /api/login endpoint
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
        faceImage: faceImage,
      };

      const response = await login(credentials);

      setSuccess(getSuccessMessage('login', { name: response.user?.name }));

      // Redirect to dashboard or previous location
      const from = location.state?.from?.pathname || '/dashboard';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err, 'login'));
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
          {/* Email */}
          <Input
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={errors.email}
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
                {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            }
          />

          {/* Remember Me */}
          <div className="login-remember-me">
            <label className="remember-me-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                aria-label="Remember me on this device"
              />
              <span>Remember me</span>
            </label>
            <p className="remember-me-help">Stay logged in on this Device</p>
          </div>

          {/* Forgot Password */}
          <div className="login-extra">
            <Button
              type="button"
              variant="primary"
              onClick={() => alert('Forgot password functionality coming soon!')}
              className="gradient-button"
            >
              Forgot Password?
            </Button>
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
                variant="primary"
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


//  {/* Face Verification */}
//           <div className="l-cam">
//             <h3>Face Verification</h3>
//             <CameraCapture onCapture={setFaceImage} />
//             {faceImage && <p>Face captured successfully ✔</p>}
//           </div>

          // {/* Error and Success Messages */}
          // {error && <ErrorMessage message={error} />}
          // {success && <SuccessMessage message={success} />}
