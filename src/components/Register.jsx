import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CameraCapture from './CameraCapture';
import { validateADDate } from '../utils/dateValidation';
import { validateField } from '../utils/validation';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import ErrorMessage from './common/ErrorMessage';
import SuccessMessage from './common/SuccessMessage';
import LoadingSpinner from './common/LoadingSpinner';
import './Register.css';

/**
 * Register Component
 * Handles user registration with Nepali date conversion, face verification, and validation
 * Uses AuthContext for authentication state management
 */
function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [faceImage, setFaceImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '', // AD date string (YYYY-MM-DD)
    citizenshipNumber: '',
    voterId: '',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({});

  /**
   * Handle input field changes with real-time validation
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Sanitize numeric fields
    if (name === 'citizenshipNumber' || name === 'voterId' || name === 'phone') {
      newValue = value.replace(/[^0-9-+]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Real-time validation
    if (errors[name]) {
      const validation = validateField(name, newValue, { password: formData.password });
      if (validation.valid) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  /**
   * Validate all form fields
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    const nameValidation = validateField('name', formData.name);
    if (!nameValidation.valid) newErrors.name = nameValidation.error;

    const emailValidation = validateField('email', formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.error;

    const phoneValidation = validateField('phone', formData.phone);
    if (!phoneValidation.valid) newErrors.phone = phoneValidation.error;

    const addressValidation = validateField('address', formData.address);
    if (!addressValidation.valid) newErrors.address = addressValidation.error;

    // Date validation (AD date)
    const dateValue = formData.dateOfBirth ? String(formData.dateOfBirth).trim() : '';
    if (!dateValue) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    } else {
      const dateValidation = validateADDate(dateValue);
      if (!dateValidation.valid) {
        newErrors.dateOfBirth = dateValidation.error;
      }
    }

    const citizenshipValidation = validateField('citizenshipNumber', formData.citizenshipNumber);
    if (!citizenshipValidation.valid) newErrors.citizenshipNumber = citizenshipValidation.error;

    const voterIdValidation = validateField('voterId', formData.voterId);
    if (!voterIdValidation.valid) newErrors.voterId = voterIdValidation.error;

    const passwordValidation = validateField('password', formData.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error;

    const confirmValidation = validateField('passwordMatch', formData.confirm, { password: formData.password });
    if (!confirmValidation.valid) newErrors.confirm = confirmValidation.error;

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
      setError('Please capture your face before submitting');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth, // AD date
        citizenshipNumber: formData.citizenshipNumber.trim(),
        voterId: formData.voterId.trim(),
        password: formData.password,
        faceImage: faceImage,
      };

      await register(userData);
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle date input change
   */
  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, dateOfBirth: value }));

    // Validate date
    if (value) {
      const dateValidation = validateADDate(value);
      if (!dateValidation.valid) {
        setErrors((prev) => ({ ...prev, dateOfBirth: dateValidation.error }));
      } else {
        setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
      }
    } else {
      setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card" variant="elevated">
        <div className="register-header">
          <h1>Nepal Election Voting System</h1>
          <p>Please enter your details to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* Name */}
          <Input
            type="text"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            error={errors.name}
          />

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

          {/* Phone */}
          <Input
            type="tel"
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+977-98-1234567"
            required
            error={errors.phone}
            helperText="Nepal format: +977-XX-XXXXXXX"
          />

          {/* Address */}
          <Input
            type="text"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
            error={errors.address}
          />

          {/* DOB + Voter ID Row */}
          <div className="r-flex-row">
            {/* Date of Birth */}
            <div className="r-flex-child">
              <div className="r-form-group">
                <label htmlFor="dateOfBirth">
                  Date of Birth <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  className={`r-date-input ${errors.dateOfBirth ? 'error' : ''}`}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                />
                {errors.dateOfBirth && <span className="r-error-message">{errors.dateOfBirth}</span>}
                {formData.dateOfBirth && !errors.dateOfBirth && (
                  <span className="r-date-helper">
                    You must be 18+ years old to register
                  </span>
                )}
              </div>
            </div>

            {/* Voter ID */}
            <div className="r-flex-child">
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
            </div>
          </div>

          {/* Citizenship Number */}
          <Input
            type="text"
            label="Citizenship Number"
            name="citizenshipNumber"
            value={formData.citizenshipNumber}
            onChange={handleChange}
            placeholder="Enter your citizenship number"
            required
            error={errors.citizenshipNumber}
          />

          {/* Password */}
          <div className="r-form-group">
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              error={errors.password}
              helperText="Must contain uppercase, lowercase, and special characters"
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
          </div>

          {/* Confirm Password */}
          <div className="r-form-group">
            <Input
              type={isConfirmVisible ? 'text' : 'password'}
              label="Confirm Password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              error={errors.confirm}
              rightIcon={
                <span
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  role="button"
                  aria-label={isConfirmVisible ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsConfirmVisible(!isConfirmVisible);
                    }
                  }}
                >
                  {isConfirmVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              }
            />
          </div>

          {/* Face Capture */}
          <div className="r-cam">
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
            className="r-submit-button"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>

          {/* Already have account */}
          <div className="Already-account">
            <p>
              Already have an account?{' '}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
                className="r-gradient-button"
              >
                Sign In
              </Button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Register;
