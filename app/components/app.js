import React from 'react';
import { connect } from 'react-redux';

import { doAuthWithPassword, parseAuthToken, getProfile } from 'lib/actions/auth';
import Layout from 'components/layout';
import LogInBox from 'components/log-in-box';

class App extends React.Component {
  componentWillMount() {
    if ( ! this.props.auth.token ) {
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
    if ( props.auth.token && ! props.auth.user ) {
      props.getProfile();
    }
  }

  render() {
    if ( this.props.auth.token ) {
      return ( <Layout children={ this.props.children } /> );
    }
    return ( <LogInBox showAuth={ this.props.doAuthWithPassword } /> );
  }
}

App.propTypes = {
  auth: React.PropTypes.object.isRequired,
};

function mapStateToProps( state ) {
  const { auth } = state;
  return { auth };
}

export default connect( mapStateToProps, { doAuthWithPassword, getProfile, parseAuthToken } )( App );
