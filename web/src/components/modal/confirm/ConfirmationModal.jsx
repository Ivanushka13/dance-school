import React, { useEffect } from 'react';
import './ConfirmationModal.css';
import { MdClose, MdCheck } from 'react-icons/md';

const ConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText,
  cancelText
}) => {
  
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && visible) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [visible, onClose]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={stopPropagation}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <div className="modal-content">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel-button" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className="modal-button confirm-button" 
            onClick={onConfirm}
          >
            <MdCheck className="button-icon" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 