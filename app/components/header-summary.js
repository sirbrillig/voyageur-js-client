import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { hideTrip, showTrip } from 'lib/actions/trip';
import { logOut } from 'lib/actions/auth';

const HeaderLogo = () => <Link to="/"><img className="header-logo" src="/assets/logo-small.png" /></Link>;

const TripCount = ( props ) => {
  const toggleTrip = () => props.isShowingTrip ? props.hideTrip() : props.showTrip();
  return <button className="trip-count btn" onClick={ toggleTrip }>{ props.trip.length }</button>;
};

const HeaderSummary = ( props ) => {
  return (
    <div className="header-summary">
      <button className="btn log-out-button" onClick={ props.logOut }>Log out</button>
      <HeaderLogo />
      <TripCount isShowingTrip={ props.isShowingTrip } hideTrip={ props.hideTrip } showTrip={ props.showTrip } trip={ props.trip } />
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
