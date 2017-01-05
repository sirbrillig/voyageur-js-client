import React from 'react';
import { connect } from 'react-redux';
import Distance from 'components/distance';
import TripList from 'components/trip-list';
import MainQuestion from 'components/main-question';
import LocationSearch from 'components/location-search';
import { searchLocationsAndAddressFor } from 'lib/actions/library';
import { clearTrip } from 'lib/actions/trip';

const Main = function( props ) {
  return (
    <div className="main">
      { props.trip.length > 1 && <Distance /> }
      { props.trip.length > 0 && <TripList trip={ props.trip } clearTrip={ props.clearTrip } /> }
      <MainQuestion trip={ props.trip } />
      <LocationSearch onChange={ props.searchLocationsAndAddressFor } />
    </div>
  );
};

function mapStateToProps( state ) {
  return {
    trip: state.trip,
  };
}

export default connect( mapStateToProps, { searchLocationsAndAddressFor, clearTrip } )( Main );
