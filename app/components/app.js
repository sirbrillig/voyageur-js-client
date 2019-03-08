import React from 'react';
import { connect } from 'react-redux';

import { clearNotices } from 'lib/actions/general';
import { doAuthWithPassword, parseAuthToken, getProfile } from 'lib/actions/auth';
import Layout from 'components/layout';
import LogInBox from 'components/log-in-box';

class App extends React.Component {
  componentWillMount() {
    if ( ! this.props.auth.token || this.props.auth.expiredToken ) {
      this.props.parseAuthToken();
    }
  }

  componentDidMount() {
    this.getUserInfo( this.props );
  }

  componentDidUpdate() {
    this.getUserInfo( this.props );
  }

  getUserInfo( props ) {
    if ( props.auth.token && ! props.auth.user && ! props.auth.expiredToken && ! props.errors.length ) {
      // FIXME: the token is always invalid for some reason
      // props.getProfile();
    }
  }

  render() {
    if ( this.props.auth.token ) {
      return ( <Layout children={ this.props.children } /> );
    }
    return ( <LogInBox showAuth={ this.props.doAuthWithPassword } errors={ this.props.errors } onClearNotices={ this.props.clearNotices } /> );
  }
}

App.propTypes = {
  auth: React.PropTypes.object.isRequired,
};

function mapStateToProps( state ) {
  const { auth, notices } = state;
  return { auth, errors: notices.errors };
}

export default connect( mapStateToProps, { doAuthWithPassword, getProfile, parseAuthToken, clearNotices } )( App );
