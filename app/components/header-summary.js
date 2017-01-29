import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { hideTrip, showTrip } from 'lib/actions/trip';
import { logOut } from 'lib/actions/auth';

const HeaderLogo = () => <Link to="/"><img className="header-logo" src="/assets/logo-small.png" /></Link>;

const HeaderSummary = ( props ) => {
  return (
    <div className="header-summary">
      <div className="header-summary__main">
        <HeaderLogo />
        <button className="btn log-out-button" onClick={ props.logOut } aria-label="log out"><span className="glyphicon glyphicon-log-out" /></button>
      </div>
      <HeaderSummaryToggle hideTrip={ props.hideTrip } showTrip={ props.showTrip } isShowingTrip={ props.isShowingTrip } trip={ props.trip } />
    </div>
  );
};

const HeaderSummaryToggle = ( props ) => {
  const count = props.trip.length || '';
  return (
    <div className="header-summary-toggle btn-group">
      <button className="btn btn-default btn-xs" disabled={ ! props.isShowingTrip } onClick={ props.hideTrip }>Search</button>
      <button className="btn btn-default btn-xs" disabled={ props.isShowingTrip } onClick={ props.showTrip }>Trip <span className="badge">{ count }</span></button>
    </div>
  );
};

HeaderSummary.propTypes = {
  isShowingTrip: React.PropTypes.bool,
  trip: React.PropTypes.array,
  hideTrip: React.PropTypes.func.isRequired,
  showTrip: React.PropTypes.func.isRequired,
  logOut: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ( { isShowingTrip: state.ui.isShowingTrip, trip: state.trip } );

export default connect( mapStateToProps, { hideTrip, showTrip, logOut } )( HeaderSummary );
