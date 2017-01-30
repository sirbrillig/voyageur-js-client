import React from 'react';

const LoadingPanel = () => {
  return (
    <div key="loading-panel-panel" className="loading-panel">
      <div className="loading-panel__content">
        <img className="loading-panel__logo animated flipInX" src="/assets/logo-medium-smooth.png" />
        <div className="loading-panel__text-area animated fadeInUp">
          <h2 className="loading-panel__text animated pulse">Hang on just a moment, please!</h2>
        </div>
      </div>
    </div>
  );
};

export default LoadingPanel;
