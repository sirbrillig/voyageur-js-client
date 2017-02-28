import React from 'react';
import { connect } from 'react-redux';
import { clearNotices } from 'lib/actions/general';
import Notices from 'components/notices';

const Footer = () => <div className="footer">Made&nbsp;by&nbsp;<a href="http://foolord.com/">Payton</a>. Code&nbsp;on&nbsp;<a href="https://github.com/sirbrillig/voyageur-js-client">GitHub</a>. Logo&nbsp;by&nbsp;<a href="http://colemcdermott.co/">Cole</a>.</div>;

const Layout = ( props ) => (
  <div className="layout">
    <Notices errors={ props.notices.errors } onClearNotices={ props.clearNotices } />
    { props.children }
    <Footer />
  </div>
);

Layout.propTypes = {
  isAdmin: React.PropTypes.bool,
  notices: React.PropTypes.object,
  clearNotices: React.PropTypes.func.isRequired,
};

function mapStateToProps( state ) {
  const { auth, notices } = state;
  return {
    isAdmin: ( auth.user && auth.user.role === 'admin' ),
    notices,
  };
}

export default connect( mapStateToProps, { clearNotices } )( Layout );

