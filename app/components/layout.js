import React from 'react';
import { connect } from 'react-redux';
import { clearNotices } from '../lib/actions/general';
import { logOut } from '../lib/actions/auth';
import Header from './header';

const Footer = () => <div className="footer">Made by <a href="http://foolord.com/">Payton</a>. Code on <a href="https://github.com/sirbrillig/voyageur-js-client">GitHub</a>. Logo by <a href="http://colemcdermott.co/">Cole</a>.</div>;

const LoggedIn = React.createClass( {
  propTypes: {
    isAdmin: React.PropTypes.bool,
    notices: React.PropTypes.object,
  },

  onClearNotices() {
    this.props.dispatch( clearNotices() );
  },

  onLogOut() {
    this.props.dispatch( logOut() );
  },

  renderMain() {
    return (
      <div className="layout">
        { this.props.children }
      </div>
    );
  },

  render() {
    return (
      <div className="logged-in">
        <Header errors={ this.props.notices.errors } onClearNotices={ this.onClearNotices } onLogOut={ this.onLogOut } isAdmin={ this.props.isAdmin } />
          { this.renderMain() }
        <Footer />
      </div>
    );
  }
} );

function mapStateToProps( state ) {
  const { auth, notices } = state;
  return {
    isAdmin: ( auth.user && auth.user.role === 'admin' ),
    notices,
  };
}

export default connect( mapStateToProps )( LoggedIn );

