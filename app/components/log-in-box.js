import React from 'react';

export default React.createClass( {
  propTypes: {
    showAuth: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="log-in-box auth0-box before">
        <img className="log-in-box__logo" src="/assets/logo.png" />
        <h1 className="log-in-box__title">Voyageur</h1>
        <p className="log-in-box__subtitle">How far do you go?</p>
        <a onClick={ this.props.showAuth } className="log-in-box__button btn btn-primary btn-lg btn-block">Let's Go!</a>
      </div>
    );
  }
} );
