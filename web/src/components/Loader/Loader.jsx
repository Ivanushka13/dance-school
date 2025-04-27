import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', text = 'Загрузка...' }) => {
  const sizeClass = `loader-size-${size}`;

  return (
    <div className="loader-container">
      <div className={`loader-spinner ${sizeClass}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle inner"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader; 