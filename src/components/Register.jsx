import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import NepaliCalendar from './common/NepaliCalendar';
import { validateBSDate, convertBSToAD } from '../utils/dateUtils';
import { validateField } from '../utils/validation';
import { API_CONFIG } from '../config/apiConfig';
import { getErrorMessage, getSuccessMessage } from '../utils/errorMessages';
import { sanitizeEmail, sanitizePhone, sanitizeText } from '../utils/sanitize';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import ErrorMessage from './common/ErrorMessage';
import SuccessMessage from './common/SuccessMessage';
import LoadingSpinner from './common/LoadingSpinner';
import PasswordStrength from './common/PasswordStrength';
import './Register.css';

// We'll fetch registration data (provinces, districts, electoral areas)
// from the backend on mount. This avoids hardcoded mappings.

/**
 * Register Component
 * Handles user registration with Nepali date conversion, face verification, and validation
 * Uses AuthContext for authentication state management
 */
function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  // const [faceImage, setFaceImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '', // BS date string (YYYY-MM-DD)
    citizenshipNumber: '',
    voterId: '',
    password: '',
    confirm: '',
    province: '', // Province selection
    district: '', // District selection
    electoral_area: '', // Electoral Area selection
  });

  // Registration data loaded from backend: provinces with nested districts and electoral_areas
  const [registrationData, setRegistrationData] = useState([]);
  const provinces = registrationData;

  // Fetch registration data on mount
  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        // Use relative URL for dev (Vite proxy), absolute for production
        const url = import.meta.env.DEV 
          ? '/elections/api/registration-data/' 
          : `${API_CONFIG.API_BASE_URL}/elections/api/registration-data/`;
        
        const response = await fetch(url, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load registration data`);
        }
        
        const data = await response.json();
        setRegistrationData(data.provinces || []);
      } catch (err) {
        console.error('Registration data load error:', err);
        setError(`Failed to load provinces: ${err.message}`);
        setRegistrationData([]);
      }
    };
    
    fetchRegistrationData();
  }, []);

  const [errors, setErrors] = useState({});

  /**
   * Handle input field changes with real-time validation
   */
  const handleChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  // ✅ Province change → reset district AND electoral_area
  if (name === 'province') {
    setFormData((prev) => ({
      ...prev,
      province: value,
      district: '',
      electoral_area: '',
    }));

    if (errors.province) {
      setErrors((prev) => ({ ...prev, province: '' }));
    }
    return;
  }

  // ✅ District change → reset electoral_area
  if (name === 'district') {
    setFormData((prev) => ({
      ...prev,
      district: value,
      electoral_area: '',
    }));

    if (errors.district) {
      setErrors((prev) => ({ ...prev, district: '' }));
    }
    return;
  }

  // ✅ Sanitize inputs (UNCHANGED logic)
  if (name === 'email') {
    newValue = sanitizeEmail(value);
  } else if (name === 'phone') {
    newValue = sanitizePhone(value);
  } else if (name === 'citizenshipNumber' || name === 'voterId') {
    newValue = value.replace(/[^0-9-+]/g, '');
  } else if (name === 'name') {
    // Allow letters and spaces only, no numbers
    newValue = value.replace(/[^a-zA-Z\s]/g, '');
  } else {
    newValue = sanitizeText(value);
  }

  // ✅ Update state (district handled here)
  setFormData((prev) => ({ ...prev, [name]: newValue }));

  // ✅ Real-time validation (UNCHANGED)
  if (errors[name]) {
    const validation = validateField(name, newValue, {
      password: formData.password,
    });
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

    // Validate province
    if (!formData.province || formData.province.trim() === '') {
      newErrors.province = 'Province selection is required';
    }

    // ✅ Validate district
    if (!formData.district || formData.district.trim() === '') {
      newErrors.district = 'District is required';
    }

    // ✅ Validate electoral area
    if (!formData.electoral_area || formData.electoral_area.trim() === '') {
      newErrors.electoral_area = 'Electoral area is required';
    }

    // Validate each field
    const nameValidation = validateField('name', formData.name);
    if (!nameValidation.valid) newErrors.name = nameValidation.error;

    const emailValidation = validateField('email', formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.error;

    const phoneValidation = validateField('phone', formData.phone);
    if (!phoneValidation.valid) newErrors.phone = phoneValidation.error;

    // Date validation (BS date)
    const dateValue = formData.dateOfBirth ? String(formData.dateOfBirth).trim() : '';
    if (!dateValue) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    } else {
      const dateValidation = validateBSDate(dateValue);
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

    // if (!faceImage) {
    //   setError('Please capture your face before submitting');
    //   return;
    // }

    setIsLoading(true);

    try {
      // TODO: Replace with POST /api/register endpoint
      // Convert BS date to AD date for backend
      const adDate = convertBSToAD(formData.dateOfBirth);
      if (!adDate) {
        setError('Invalid date of birth. Please check the date and try again.');
        return;
      }

      // Prepare user data with correct field names and integer IDs
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: adDate, // Convert BS to AD for backend
        citizenshipNumber: formData.citizenshipNumber.trim(),
        voterId: formData.voterId.trim(),
        password: formData.password,
        // Convert string IDs to integer IDs for backend
        province_id: formData.province ? parseInt(formData.province, 10) : null,
        district_id: formData.district ? parseInt(formData.district, 10) : null,
        electoral_area_id: formData.electoral_area ? parseInt(formData.electoral_area, 10) : null,
        // faceImage: faceImage,
      };

      await register(userData);
      
      setSuccess(getSuccessMessage('register'));
      
      // Redirect to login page after registration
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (err) {
      setError(getErrorMessage(err, 'register'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Nepali date input change
   */
  const handleDateChange = (bsDate) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: bsDate }));

    // Validate BS date
    if (bsDate) {
      const dateValidation = validateBSDate(bsDate);
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
          <h1>{t('nepalElectionVotingSystem')}</h1>
          <p>{t('pleaseEnterDetails')}</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* Name */}
          <Input
            type="text"
            label={t('fullName')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('enterFullName')}
            required
            error={errors.name}
          />

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

          {/* Phone */}
          <Input
            type="tel"
            label={t('phoneNumber')} 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+977 XXX-XXXXXXX"
            required
            error={errors.phone}
            helperText={
            <span style={{ color: "black" }}>
              {t('nepalPhoneFormat')}
            </span>
          }

          />

{/* Province Selection */}
          <div className="r-form-group">
            <label htmlFor="province">
              {t('province')} <span className="required">*</span>
            </label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={`r-select-input ${errors.province ? 'error' : ''}`}
              required
            >
              <option value="">{t('selectProvince')}</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {errors.province && (
              <span className="r-error-message">{errors.province}</span>
            )}
          </div>


          {/* District Selection */}
          <div className="r-form-group">
            <label htmlFor="district">
              {t('district')} <span className="required">*</span>
            </label>

            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={`r-select-input ${errors.district ? 'error' : ''}`}
              disabled={!formData.province}
              required
            >
              <option value="">
                {formData.province ? t('selectDistrict') : t('selectProvinceFirst')}
              </option>

              {formData.province &&
                (registrationData.find((p) => String(p.id) === String(formData.province))?.districts || []).map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>

            {errors.district && (
              <span className="r-error-message">{errors.district}</span>
            )}
          </div>

          {/* Electoral Area Selection */}
          <div className="r-form-group">
            <label htmlFor="electoral_area">
              {t('electoralArea')} <span className="required">*</span>
            </label>

            <select
              id="electoral_area"
              name="electoral_area"
              value={formData.electoral_area}
              onChange={handleChange}
              className={`r-select-input ${errors.electoral_area ? 'error' : ''}`}
              disabled={!formData.province}
              required
            >
              <option value="">
                {formData.province ? t('selectElectoralArea') : t('selectProvinceFirst')}
              </option>

              {formData.province &&
                (registrationData.find((p) => String(p.id) === String(formData.province))?.electoral_areas || []).map((ea) => (
                  <option key={ea.id} value={ea.id}>
                    {ea.name}
                  </option>
                ))}
            </select>

            {errors.electoral_area && (
              <span className="r-error-message">{errors.electoral_area}</span>
            )}
          </div>


          {/* DOB + Voter ID Row */}
          <div className="r-flex-row">
            {/* Date of Birth - Nepali Date */}
            <div className="r-flex-child">
              <div className="r-form-group">
                <label htmlFor="dateOfBirth">
                  {t('dateOfBirth')} ({t('bsDate')}) <span className="required">*</span>
                </label>
                <NepaliCalendar
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  placeholder={t('selectBSDate')}
                  className={errors.dateOfBirth ? 'error' : ''}
                  error={errors.dateOfBirth}
                />
                {errors.dateOfBirth && <span className="r-error-message">{errors.dateOfBirth}</span>}
                {formData.dateOfBirth && !errors.dateOfBirth && (
                  <span className="r-date-helper">
                    {t('mustBe18Plus')}
                  </span>
                )}
              </div>
            </div>

            {/* Voter ID */}
            <div className="r-flex-child">
              <Input
                type="text"
                label={t('voterId')}
                name="voterId"
                value={formData.voterId}
                onChange={handleChange}
                placeholder={t('enterVoterId')}
                required
                error={errors.voterId}
              />
            </div>
          </div>

          {/* Citizenship Number */}
          <Input
            type="text"
            label={t('citizenshipNumber')}
            name="citizenshipNumber"
            value={formData.citizenshipNumber}
            onChange={handleChange}
            placeholder={t('enterCitizenshipNumber')}
            required
            error={errors.citizenshipNumber}
          />


          {/* Password */}
          <div className="r-form-group">
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              label={t('password')}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('enterPassword')}
              required
              error={errors.password}
              helperText={
            <span style={{ color: "black" }}>
              {t('passwordRequirements')}
            </span>
          }
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
                  {isPasswordVisible ? <FaEye /> :<FaEyeSlash />}
                </span>
              }
            />
            {/* Password Strength Indicator */}
            {formData.password && (
              <PasswordStrength password={formData.password} />
            )}
          </div>

          {/* Confirm Password */}
          <div className="r-form-group">
            <Input
              type={isConfirmVisible ? 'text' : 'password'}
              label={t('confirmPassword')}
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder={t('confirmYourPassword')}
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
                  {isConfirmVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
              }
            />
          </div>

          {/* Face Capture */}
          
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
            {isLoading ? t('registering') : t('register')}
          </Button>

          {/* Already have account */}
          <div className="Already-account">
            <p>
              {t('alreadyHaveAccount')}{' '}
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/login')}
              className="r-gradient-button"
            >
              {t('signIn')}
            </Button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Register;


//  <div className="r-cam">
//             <h3>Face Verification</h3>
//             <CameraCapture onCapture={setFaceImage} />
//             {faceImage && <p>Face captured successfully ✔</p>}
//           </div>

//           {/* Error and Success Messages */}
//           {error && <ErrorMessage message={error} />}
//           {success && <SuccessMessage message={success} />}