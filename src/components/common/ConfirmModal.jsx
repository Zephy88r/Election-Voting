import React from 'react';
import Button from './Button';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isSubmitting = false,
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="confirm-modal-overlay"
      onClick={onClose}
    >
      <div
        className="confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal-header">
          <div>
            <div className="confirm-modal-title">{title}</div>
            <div className="confirm-modal-message">{message}</div>
          </div>
          <div className="confirm-modal-icon">🗳️</div>
        </div>

        {children && (
          <div className="confirm-modal-body">
            {children}
          </div>
        )}

        <div className="confirm-modal-actions">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isSubmitting} loading={isSubmitting}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;