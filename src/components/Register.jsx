import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CameraCapture from "../components/CameraCapture";

function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [faceImage, setFaceImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email:'',
    address: '',
    date:'',               // Date of Birth
    citizenshipNumber: '',
    voterId: '',
    password:'',
    confirm:''
  });

  const [errors, setErrors] = useState({});

  // --- Age verification ---
  const isAbove18 = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  // --- Handle input change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "citizenshipNumber" || name === "voterId") {
      newValue = value.replace(/[^0-9-]/g, "");
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // --- Validate all fields ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.date.trim()) newErrors.date = 'Date of Birth is required';
    if (!formData.citizenshipNumber.trim()) newErrors.citizenshipNumber = 'Citizenship Number is required';
    if (!formData.voterId.trim()) newErrors.voterId = 'Voter ID is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 6 characters, contain 1 uppercase, 1 lowercase, and 1 symbol';
      }
    }
    if (!formData.confirm.trim()) newErrors.confirm = 'Confirm Password is required';
    else if (formData.password !== formData.confirm) newErrors.confirm = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // reset global error

    if (!validateForm()) return;

    if (!isAbove18(formData.date)) {
      setError("You must be above 18 years old to continue");
      return;
    }

    if (!faceImage) {
      setError("Please capture your face before submitting");
      return;
    }

    // All checks passed
    console.log("Form data:", formData, "Face image:", faceImage);
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Nepal Election Voting System</h1>
          <p>Please enter your details to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="Enter your address"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label htmlFor="date">Date of Birth *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          {/* Citizenship Number */}
          <div className="form-group">
            <label htmlFor="citizenshipNumber">Citizenship Number *</label>
            <input
              type="text"
              id="citizenshipNumber"
              name="citizenshipNumber"
              value={formData.citizenshipNumber}
              onChange={handleChange}
              inputMode='numeric'
              className={errors.citizenshipNumber ? 'error' : ''}
              placeholder="Enter your citizenship number"
            />
            {errors.citizenshipNumber && <span className="error-message">{errors.citizenshipNumber}</span>}
          </div>

          {/* Voter ID */}
          <div className="form-group">
            <label htmlFor="voterId">Voter ID *</label>
            <input
              type="text"
              id="voterId"
              name="voterId"
              value={formData.voterId}
              onChange={handleChange}
              inputMode='numeric'
              className={errors.voterId ? 'error' : ''}
              placeholder="Enter your voter ID"
            />
            {errors.voterId && <span className="error-message">{errors.voterId}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your Password"
            />
            <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="icon">
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirm">Confirm Password *</label>
            <input
              type={isConfirmVisible ? "text" : "password"}
              id="confirm"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              className={errors.confirm ? 'error' : ''}
              placeholder="Enter your Password"
            />
            <span onClick={() => setIsConfirmVisible(!isConfirmVisible)} className="icon">
              {isConfirmVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.confirm && <span className="error-message">{errors.confirm}</span>}
          </div>

          {/* Camera */}
          <div>
            <h3>Face Verification</h3>
            <CameraCapture onCapture={setFaceImage} />
            {faceImage && <p>Face captured successfully ✔</p>}
          </div>

          {/* Global error (age or face) */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
