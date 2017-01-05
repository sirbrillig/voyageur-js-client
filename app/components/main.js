import React from 'react';
import { connect } from 'react-redux';
import Distance from 'components/distance';
import Library from 'components/library';
import TripList from 'components/trip-list';
import MainQuestion from 'components/main-question';
import LocationSearch from 'components/location-search';
import { searchLocationsAndAddressFor } from 'lib/actions/library';
import {
  startEditLocation,
  showAddLocation,
  moveLibraryLocation,
} from 'lib/actions/library';
import {
  clearTrip,
  showTrip,
  addToTrip,
} from 'lib/actions/trip';

const Main = function( props ) {
  const lastTripLocationId = ( props.trip.length > 0 ? props.trip[ props.trip.length - 1 ].id : null );
  return (
    <div className="main">
      { props.trip.length > 1 && <Distance /> }
      { props.trip.length > 0 && <TripList trip={ props.trip } clearTrip={ props.clearTrip } showTrip={ props.showTrip } /> }
      <MainQuestion trip={ props.trip } />
      <LocationSearch onChange={ props.searchLocationsAndAddressFor } />
      <Library
        locations={ props.library }
        visibleLocations={ props.visibleLocations }
        predictions={ props.predictions }
        onAddToTrip={ props.addToTrip }
        onEditLocation={ props.startEditLocation }
        onAddLocation={ props.showAddLocation }
        onDrop={ props.moveLibraryLocation }
        selectedLocation={ props.selectedLocation }
        lastTripLocationId={ lastTripLocationId }
      />;
    </div>
  );
};

function mapStateToProps( state ) {
  return {
    trip: state.trip,
    library: state.library.locations,
    visibleLocations: state.library.visibleLocations,
    predictions: state.library.predictions,
    selectedLocation: state.ui.selectedLocation,
  };
}

const actions = {
  searchLocationsAndAddressFor,
  clearTrip,
  showTrip,
  addToTrip,
  startEditLocation,
  showAddLocation,
  moveLibraryLocation,
};

export default connect( mapStateToProps, actions )( Main );
