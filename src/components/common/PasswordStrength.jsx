import { useMemo } from 'react';
import { validatePassword } from '../../utils/validation';
import './PasswordStrength.css';

/**
 * Password Strength Indicator Component
 * Displays visual feedback for password strength
 * 
 * @param {string} password - Password to evaluate
 * @param {boolean} showLabel - Whether to show strength label
 */
function PasswordStrength({ password, showLabel = true }) {
  const strength = useMemo(() => {
    if (!password) return null;
    const validation = validatePassword(password);
    return validation.strength || 'weak';
  }, [password]);

  if (!password) return null;

  const strengthConfig = {
    weak: {
      label: 'Weak',
      color: '#DC143C', // Red
      width: '33%',
      className: 'strength-weak',
    },
    medium: {
      label: 'Medium',
      color: '#FFC107', // Yellow/Orange
      width: '66%',
      className: 'strength-medium',
    },
    strong: {
      label: 'Strong',
      color: '#28A745', // Green
      width: '100%',
      className: 'strength-strong',
    },
  };

  const config = strengthConfig[strength] || strengthConfig.weak;

  return (
    <div className="password-strength">
      {showLabel && (
        <div className="password-strength-label">
          <span className={`strength-text ${config.className}`}>
            Password Strength: <strong>{config.label}</strong>
          </span>
        </div>
      )}
      <div className="password-strength-bar">
        <div
          className={`password-strength-fill ${config.className}`}
          style={{
            width: config.width,
            backgroundColor: config.color,
          }}
        />
      </div>
    </div>
  );
}

export default PasswordStrength;
