import React from 'react';
import Loader from './Loader';
import './Loader.css';

const FullscreenLoader = ({ text = 'Загрузка...' }) => {
  return (
    <div className="fullscreen-loader">
      <Loader size="large" text={text} />
    </div>
  );
};

export default FullscreenLoader; 