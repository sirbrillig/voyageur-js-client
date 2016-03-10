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

  onClickReload() {
    if ( window ) window.location.reload();
  },

  renderNotices() {
    if ( this.props.errors.length === 0 ) return;
    return (
      <div className="notices well">
        <h1 className="notices__title">Sorry! Something went wrong!</h1>
        <div className="notices__help">
          <p>If the problem was temporary, you can try to keep working. Otherwise you can try to reload and see if that helps.</p>
          <p>If you keep seeing errors, send an email to <a className="label label-primary" href="mailto:payton+voyageurhelp@foolord.com">payton+voyageurhelp@foolord.com</a> and I'll see what I can do.</p>
        </div>
        { this.renderButtons() }
        <div className="notices__errors">
          <div className="notices__help">
            <h3 className="notices__help__title">Here's the raw error I saw:</h3>
            <p>Don't worry if you don't understand it; if it keeps happening just send it to me in an email.</p>
          </div>
          { this.props.errors.map( this.renderError ) }
        </div>
      </div>
    );
  },

  renderError( error, key ) {
    return <div key={ 'notices__error__' + error + key } className="notices__notice alert alert-warning" role="alert">{ error }</div>;
  },

  renderButtons() {
    return (
      <div className="notices__buttons">
        <button className="notices__clear btn btn-block btn-primary" onClick={ this.props.onClearNotices }>keep going</button>
        <button className="notices__reload btn btn-block btn-warning" onClick={ this.onClickReload }>try reloading</button>
      </div>
    );
  },

  renderAdminButton() {
    if ( this.props.isAdmin ) return <Link to="/admin" className="btn btn-default admin-button"><span className="glyphicon glyphicon-dashboard" aria-hidden="true"></span></Link>;
  },

  render() {
    return (
      <div className="header">
        <h1 className="header__title">Voyageur</h1>
        <Link to="/"><img className="header__logo" src="/assets/logo-small.png" /></Link>
        <div className="header__buttons">
          { this.renderAdminButton() }
          <button className="btn btn-default log-out-button" onClick={ this.props.onLogOut }>Log out</button>
        </div>
        { this.renderNotices() }
      </div>
    );
  }
} );
