import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import './EnumModal.css';

const EnumModal = ({ 
  visible, 
  onClose, 
  onSelect, 
  title,
  options = [],
  renderOption
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
        <div className="modal-content enum-options">
          {options.length > 0 ? (
            options.map((option, index) => (
              <div 
                key={option.id || index} 
                className="enum-option" 
                onClick={() => onSelect(option)}
              >
                {renderOption ? renderOption(option) : option.name || String(option)}
              </div>
            ))
          ) : (
            <p className="modal-message">Нет доступных вариантов для выбора</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnumModal; 