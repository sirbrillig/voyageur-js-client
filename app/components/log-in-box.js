import React from 'react';

export default React.createClass( {
  propTypes: {
    showAuth: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="log-in-box">
        <div className="log-in-box__content">
          <img className="log-in-box__logo animated flipInX" src="/assets/logo-medium-smooth.png" />
          <h1 className="log-in-box__title">Voyageur</h1>
          <p className="log-in-box__subtitle">How far do you go?</p>
          <a onClick={ this.props.showAuth } className="log-in-box__button btn btn-primary btn-lg">Let's find out!</a>
        </div>
      </div>
    );
  }
} );
