import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Library from 'components/library';
import Distance from 'components/distance';
import Trip from 'components/trip';
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
  moveTripLocation,
} from 'lib/actions/trip';

class Main extends React.Component {
  componentWillReceiveProps( nextProps ) {
    // Hide trip if empty
    if ( nextProps.isShowingTrip && nextProps.trip.length < 1 ) this.props.hideTrip();
  }

  render() {
    const props = this.props;
    const lastTripLocationId = ( props.trip.length > 0 ? props.trip[ props.trip.length - 1 ].id : null );
    return (
      <div className={ classNames( 'main', { 'main--trip': props.isShowingTrip } ) }>
        <div className="main__header">
          <Distance />
          <button className="btn btn-sm btn-primary main__clear-trip" onClick={ props.clearTrip }>Clear trip</button>
        </div>
        { ! props.isShowingTrip && <div className="main__library">
         <MainQuestion trip={ props.trip } />
         <LocationSearch onChange={ props.searchLocationsAndAddressFor } searchString={ props.searchString } />
          <Library
            locations={ props.library }
            searchString={ props.searchString }
            predictions={ props.predictions }
            onAddToTrip={ props.addToTrip }
            onEditLocation={ props.startEditLocation }
            onAddLocation={ props.showAddLocation }
            onDrop={ props.moveLibraryLocation }
            selectedLocation={ props.selectedLocation }
            lastTripLocationId={ lastTripLocationId }
            />
        </div> }
        { <Trip
          isVisible={ props.isShowingTrip }
          tripLocations={ props.trip }
          library={ props.library }
          onRemoveTripLocation={ props.removeTripLocation }
          clearTrip={ props.clearTrip }
          onDrop={ props.moveTripLocation }
          /> }
      </div>
    );
  }
}

function mapStateToProps( state ) {
  return {
    trip: state.trip,
    library: state.library.locations,
    predictions: state.library.predictions,
    selectedLocation: state.ui.selectedLocation,
    isShowingTrip: state.ui.isShowingTrip,
    searchString: state.ui.searchString,
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
  moveTripLocation,
};

export default connect( mapStateToProps, actions )( Main );
