import React from 'react';
import { connect } from 'react-redux';
import Distance from 'components/distance';
import Library from 'components/library';
import Trip from 'components/trip';
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
  hideTrip,
  addToTrip,
  removeTripLocation,
} from 'lib/actions/trip';

const Main = function( props ) {
  const lastTripLocationId = ( props.trip.length > 0 ? props.trip[ props.trip.length - 1 ].id : null );
  const noop = () => null;
  return (
    <div className="main">
      { props.trip.length > 1 && <Distance /> }
      { ( props.trip.length > 0 || props.isShowingTrip ) && <TripList trip={ props.trip } clearTrip={ props.clearTrip } showTrip={ props.showTrip } hideTrip={ props.hideTrip } isShowingTrip={ props.isShowingTrip } /> }
      { ! props.isShowingTrip && <MainQuestion trip={ props.trip } /> }
      { ! props.isShowingTrip && <LocationSearch onChange={ props.searchLocationsAndAddressFor } /> }
      { props.isShowingTrip && <Trip
        tripLocations={ props.trip }
        library={ props.library }
        onRemoveTripLocation={ props.removeTripLocation }
        onDrop={ noop }
        /> }
      { ! props.isShowingTrip && <Library
        locations={ props.library }
        visibleLocations={ props.visibleLocations }
        predictions={ props.predictions }
        onAddToTrip={ props.addToTrip }
        onEditLocation={ props.startEditLocation }
        onAddLocation={ props.showAddLocation }
        onDrop={ props.moveLibraryLocation }
        selectedLocation={ props.selectedLocation }
        lastTripLocationId={ lastTripLocationId }
        /> }
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
    isShowingTrip: state.ui.isShowingTrip,
  };
}

const actions = {
  searchLocationsAndAddressFor,
  clearTrip,
  showTrip,
  hideTrip,
  addToTrip,
  startEditLocation,
  showAddLocation,
  moveLibraryLocation,
  removeTripLocation,
};

export default connect( mapStateToProps, actions )( Main );
