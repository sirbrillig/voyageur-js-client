import React from 'react';
import { connect } from 'react-redux';
import Notices from 'components/notices';
import { clearNotices } from 'lib/actions/general';
import { doAuthWithPassword, ignoreExpiredToken } from 'lib/actions/auth';

const RelogInBox = ( props ) => {
  return (
    <div className="relog-in-box">
      <Notices errors={ props.errors } onClearNotices={ props.clearNotices } />
      <div className="relog-in-box__content">
        <img className="relog-in-box__logo" alt="Voyageur logo" src="/assets/logo-small.png" />
        <p className="relog-in-box__subtitle">Sorry, but to complete that last calculation, I need you to log in again.</p>
        <a onClick={ props.doAuthWithPassword } className="relog-in-box__button btn btn-primary btn-lg">Log In</a>
        <a onClick={ props.ignoreExpiredToken } className="relog-in-box__button btn btn-warning btn-lg">Cancel</a>
      </div>
    </div>
  );
};

RelogInBox.propTypes = {
  doAuthWithPassword: React.PropTypes.func.isRequired,
  ignoreExpiredToken: React.PropTypes.func.isRequired,
  clearNotices: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array,
};

function mapStateToProps( state ) {
  return { errors: state.notices.errors };
}

export default connect( mapStateToProps, { doAuthWithPassword, clearNotices, ignoreExpiredToken } )( RelogInBox );

