import React, { useEffect } from 'react';
import './InformationModal.css';
import { useNavigate } from 'react-router-dom';

const InformationModal = ({
  visible = false,
  onClose,
  title,
  message,
  actionText = 'Oк'
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (visible) document.body.style.overflow = 'auto';
    };
  }, [visible]);

  if (!visible) return null;

  const handleClose = () => {
    if (message && message === "Ошибка 401: Невалидные учетные данные") {
      navigate('/login');
    } else if (onClose) {
      onClose();
    }
  };

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
            onClick={handleClose}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformationModal; 