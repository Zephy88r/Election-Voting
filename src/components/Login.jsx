import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { t } = useLanguage();

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
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordMinLength');
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
      setError(t('fixFormErrors'));
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
          <h1>{t('appName')}</h1>
          <p>{t('pleaseEnterDetails')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email */}
          <Input
            type="email"
            label={t('email')}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('enterEmail')}
            required
            error={errors.email}
          />

          {/* Password */}
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            label={t('password')}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('enterPassword')}
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
              <span>{t('rememberMe')}</span>
            </label>
            <p className="remember-me-help">{t('stayLoggedIn')}</p>
          </div>

          {/* Forgot Password */}
          <div className="login-extra">
            <Button
              type="button"
              variant="primary"
              onClick={() => alert(t('forgotPasswordSoon'))}
              className="gradient-button"
            >
              {t('forgotPassword')}
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
            {isLoading ? t('loggingIn') : t('logIn')}
          </Button>

          {/* New User Register */}
          <div className="new-user">
            <p>
              {t('newUser')}{' '}
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/register')}
                className="gradient-button"
              >
                {t('registerHere')}
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
