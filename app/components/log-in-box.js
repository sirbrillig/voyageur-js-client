import React from 'react';

const LogInBox = ( props ) => {
  return (
    <div className="log-in-box">
      <div className="log-in-box__content">
        <img className="log-in-box__logo" alt="Voyageur logo" src="/assets/logo-medium-smooth.png" />
        <h1 className="log-in-box__title">Voyageur</h1>
        <p className="log-in-box__subtitle">How far do you go?</p>
        <a onClick={ props.showAuth } className="log-in-box__button btn btn-primary btn-lg">Let's find out!</a>
      </div>
    </div>
  );
};

LogInBox.propTypes = {
  showAuth: React.PropTypes.func.isRequired
};

export default LogInBox;
