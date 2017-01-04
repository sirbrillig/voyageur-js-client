import React from 'react';
import { connect } from 'react-redux';

import { doAuthWithPassword, parseAuthToken, getProfile } from 'lib/actions/auth';
import Layout from 'components/layout';
import LogInBox from 'components/log-in-box';

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

  showAuthWithPassword() {
    this.props.doAuthWithPassword();
  },

  render() {
    if ( this.props.auth.token ) {
      return ( <Layout children={ this.props.children } /> );
    }
    return ( <LogInBox showAuth={ this.showAuthWithPassword } /> );
  }
} );

function mapStateToProps( state ) {
  const { auth } = state;
  return { auth };
}

export default connect( mapStateToProps, { doAuthWithPassword, getProfile, parseAuthToken } )( App );
