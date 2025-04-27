import React, { useEffect } from 'react';
import './InformationModal.css';

const InformationModal = ({
  visible = false,
  onClose,
  title,
  message,
  actionText = 'Oк'
}) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (visible) document.body.style.overflow = 'auto';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="info-modal-backdrop">
      <div className="info-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal-header">
          <h3 className="info-modal-title">{title}</h3>
        </div>
        {message && (
          <div className="info-modal-content">
            <p className="info-modal-message">
              {message}
            </p>
          </div>
        )}
        <div className="info-modal-actions">
          <button
            className="info-modal-button"
            onClick={onClose}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformationModal; 