import React from 'react';
import { connect } from 'react-redux';

import { doAuth, doAuthWithPassword, parseAuthToken, getProfile } from '../lib/actions/auth';
import Layout from './layout';
import LogInBox from './log-in-box';

const App = React.createClass( {
  propTypes: {
    auth: React.PropTypes.object.isRequired,
  },

  componentWillMount() {
    if ( ! this.props.auth.token ) {
      this.props.parseAuthToken();
    }
  },

  componentDidMount() {
    this.getUserInfo();
  },

  componentDidUpdate() {
    this.getUserInfo();
  },

  getUserInfo() {
    if ( this.props.auth.token && ! this.props.auth.user ) {
      this.props.getProfile();
    }
  },

  showAuth() {
    this.props.doAuth();
  },

  showAuthWithPassword() {
    this.props.doAuthWithPassword();
  },

  render() {
    if ( this.props.auth.token ) {
      return ( <Layout children={ this.props.children } /> );
    }
    if ( window && window.location.search === '?user-login' ) {
      return ( <LogInBox showAuth={ this.showAuthWithPassword } /> );
    }
    return ( <LogInBox showAuth={ this.showAuth } /> );
  }
} );

function mapStateToProps( state ) {
  const { auth } = state;
  return { auth };
}

export default connect( mapStateToProps, { doAuth, doAuthWithPassword, getProfile, parseAuthToken } )( App );
