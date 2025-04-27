import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        
        <h1 className="not-found-title">Страница не найдена</h1>
        
        <p className="not-found-message">
          Cтраницы, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="not-found-actions">
          <button className="not-found-button back" onClick={handleGoBack}>
            <MdArrowBack />
            <span>Вернуться назад</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 