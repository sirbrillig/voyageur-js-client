import React from 'react';
import { connect } from 'react-redux';
import Distance from 'components/distance';
import Library from 'components/library';
import Trip from 'components/trip';
import TripSummary from 'components/trip-summary';
import MainQuestion from 'components/main-question';
import LocationSearch from 'components/location-search';
import {
  startEditLocation,
  showAddLocation,
  moveLibraryLocation,
  searchLocationsAndAddressFor,
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
      <div className="main__header">
      { props.trip.length > 1 && <Distance /> }
      { ( props.trip.length > 0 || props.isShowingTrip ) && <TripSummary trip={ props.trip } clearTrip={ props.clearTrip } showTrip={ props.showTrip } hideTrip={ props.hideTrip } isShowingTrip={ props.isShowingTrip } /> }
      </div>
      <div className="main__library">
      { ! props.isShowingTrip && <MainQuestion trip={ props.trip } /> }
      { ! props.isShowingTrip && <LocationSearch onChange={ props.searchLocationsAndAddressFor } /> }
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
      { <Trip
        isVisible={ props.isShowingTrip }
        tripLocations={ props.trip }
        library={ props.library }
        onRemoveTripLocation={ props.removeTripLocation }
        onDrop={ noop }
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
