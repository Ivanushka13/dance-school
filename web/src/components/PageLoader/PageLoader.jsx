import React from 'react';
import Loader from '../Loader/Loader';
import './PageLoader.css';

const PageLoader = ({ text = 'Загрузка...', children, loading, minHeight = 'calc(100vh - 140px)' }) => {
  return (
    <>
      {loading ? (
        <div className="page-loader-container" style={{ minHeight }}>
          <Loader size="large" text={text} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default PageLoader; 