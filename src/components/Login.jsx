import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { FaEye, FaEyeSlash } from "react-icons/fa"


function Login() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        voterId: '',
        password:''
    })
    const [errors, setErrors] = useState({})


    const handleChange = (e) => {
        const { name, value } = e.target

        let newValue = value

    // Only allow numbers + "-" for these fields
    if (name === "voterId") {
        newValue = value.replace(/[^0-9-]/g, "")
    }

        setFormData(prev => ({
        ...prev,
        [name]: newValue
        }))
        // Clear error when user starts typing
        if (errors[name]) {
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }))
        }
    }


    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
        }
        if (!formData.voterId.trim()) {
        newErrors.voterId = 'Voter ID is required'
        }
        if (!formData.password.trim()) {
        newErrors.password = 'Password is required'
        }else{
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/
    if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 6 characters, contain 1 uppercase, 1 lowercase, and 1 symbol'
    }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
        return
        }

        
        try {
        navigate('/dashboard')
        } catch (error) {
        console.error('Login error:', error)
        // Handle error (show error message, etc.)
        }
    }


    return (
        <div className="login-container">
        <div className="login-card">
            <div className="login-header">
            <h1>Nepal Election Voting System</h1>
            <p>Please enter your details to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
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
                /><span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="icon" style={{ cursor: 'pointer' }}>
                {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="forgot-password">
                <a href='#'>Forgot Password?</a>
            </div>

            <button type="submit" className="submit-button-login">
                Log In
            </button>
            </form>
        </div>
        </div>
    )
}

export default Login