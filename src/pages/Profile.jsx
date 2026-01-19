import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/dateValidation';
import { validateField } from '../utils/validation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Profile.css';

/**
 * Profile Component
 * Displays and allows editing of user profile information
 * Supports photo upload and field editing
 */
function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    citizenshipNumber: '',
    voterId: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  /**
   * Initialize profile data
   */
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          dateOfBirth: user.dateOfBirth || '',
          citizenshipNumber: user.citizenshipNumber || '',
          voterId: user.voterId || '',
        });
        setProfileImage(user.faceImage || null);
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');

    // Real-time validation
    if (errors[name]) {
      const validation = validateField(name, value);
      if (validation.valid) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  /**
   * Handle profile photo upload
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  /**
   * Validate form before saving
   */
  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateField('name', formData.name);
    if (!nameValidation.valid) newErrors.name = nameValidation.error;

    const emailValidation = validateField('email', formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.error;

    if (formData.phone) {
      const phoneValidation = validateField('phone', formData.phone);
      if (!phoneValidation.valid) newErrors.phone = phoneValidation.error;
    }

    const addressValidation = validateField('address', formData.address);
    if (!addressValidation.valid) newErrors.address = addressValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle save profile changes
   */
  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    if (!validateForm()) {
      setError('Please fix the errors in the form');
      setSaving(false);
      return;
    }

    try {
      const updatedUserData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        faceImage: profileImage,
      };

      await updateUser(updatedUserData);

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancel editing and revert changes
   */
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        citizenshipNumber: user.citizenshipNumber || '',
        voterId: user.voterId || '',
      });
      setProfileImage(user.faceImage || null);
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
    setErrors({});
  };

  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-loading">
            <LoadingSpinner size="lg" />
            <p>Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-error">
            <ErrorMessage message="User not found. Please log in again." />
            <Button onClick={() => navigate('/login')} variant="primary" style={{ marginTop: '20px' }}>
              Go to Login
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <Card className="profile-card" variant="elevated">
          <div className="profile-header">
            <h1>User Profile</h1>
            <p>{isEditing ? 'Edit your account information' : 'Your account information'}</p>
          </div>

          <div className="profile-content">
            {/* Profile Photo Section */}
            <div className="profile-section">
              <div className="profile-avatar-container">
                <div className="profile-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">No Photo</div>
                  )}
                </div>
                {isEditing && (
                  <div className="profile-avatar-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profileImage ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            {/* Profile Details */}
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                {isEditing ? (
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    className="profile-input"
                  />
                ) : (
                  <span className="detail-value">{user.name || 'N/A'}</span>
                )}
              </div>

              <div className="detail-row">
                <span className="detail-label">Email:</span>
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    className="profile-input"
                  />
                ) : (
                  <span className="detail-value">{user.email || 'N/A'}</span>
                )}
              </div>

              {isEditing && (
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977-98-1234567"
                    error={errors.phone}
                    className="profile-input"
                  />
                </div>
              )}

              <div className="detail-row">
                <span className="detail-label">Address:</span>
                {isEditing ? (
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    className="profile-input"
                  />
                ) : (
                  <span className="detail-value">{user.address || 'N/A'}</span>
                )}
              </div>

              <div className="detail-row">
                <span className="detail-label">Date of Birth:</span>
                {isEditing ? (
                  <Input
                    type="date"
                    name="DOB"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                    className="profile-input"
                  />
                ) : (
                  <span className="detail-value">{user.address || 'N/A'}</span>
                )}
              </div>

              <div className="detail-row">
                <span className="detail-label">Citizenship Number:</span>
                <span className="detail-value">{user.citizenshipNumber || 'N/A'}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Voter ID:</span>
                <span className="detail-value">{user.voterId || 'N/A'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                    loading={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/')}
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Profile;
