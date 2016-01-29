import React from 'react';
import { Link } from 'react-router';
import noop from 'lodash.noop';

export default React.createClass( {
  propTypes: {
    errors: React.PropTypes.array,
    onClearNotices: React.PropTypes.func,
    onLogOut: React.PropTypes.func,
    isAdmin: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      errors: [],
      onClearNotices: noop,
      onLogOut: noop,
      isAdmin: false,
    }
  },

  renderNotices() {
    if ( this.props.errors.length === 0 ) return;
    return (
      <div className="notices well">
      { this.renderClearNotices() }
      { this.props.errors.map( this.renderError ) }
      </div>
    );
  },

  renderError( error, key ) {
    return <div key={ 'notices__error__' + error + key } className="notices__notice alert alert-warning" role="alert">{ error }</div>;
  },

  renderClearNotices() {
    return <button className="notices__clear btn btn-block btn-default" onClick={ this.props.onClearNotices }>clear notices</button>;
  },

  renderAdminButton() {
    if ( this.props.isAdmin ) return <Link to="/admin" className="btn btn-default admin-button"><span className="glyphicon glyphicon-dashboard" aria-hidden="true"></span></Link>;
  },

  render() {
    return (
      <div className="header">
        <h1 className="header__title">Voyageur</h1>
        <img className="header__logo" src="/assets/logo.png" />
        <div className="header__buttons">
          { this.renderAdminButton() }
          <button className="btn btn-default log-out-button" onClick={ this.props.onLogOut }>Log out</button>
        </div>
        { this.renderNotices() }
      </div>
    );
  }
} );
