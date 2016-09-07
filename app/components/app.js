import React from 'react';
import { connect } from 'react-redux';

import { doAuthPasswordless, doAuthWithPassword, parseAuthToken, getProfile } from '../lib/actions/auth';
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

  showAuthPasswordless() {
    this.props.doAuthPasswordless();
  },

  showAuthWithPassword() {
    this.props.doAuthWithPassword();
  },

  render() {
    if ( this.props.auth.token ) {
      return ( <Layout children={ this.props.children } /> );
    }
    return ( <LogInBox showAuth={ this.showAuthWithPassword } /> );
    //return ( <LogInBox showAuth={ this.showAuthPasswordless } /> );
  }
} );

function mapStateToProps( state ) {
  const { auth } = state;
  return { auth };
}

export default connect( mapStateToProps, { doAuthPasswordless, doAuthWithPassword, getProfile, parseAuthToken } )( App );
