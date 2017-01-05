import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import Library from 'components/library';
import WideButton from 'components/wide-button';
//import Trip from 'components/trip';
//import Distance from 'components/distance';
import Main from 'components/main';
import AddLocationForm from 'components/add-location-form';
import EditLocationForm from 'components/edit-location-form';
import LocationSearch from 'components/location-search';
import LoadingPanel from 'components/loading-panel';
import { connect } from 'react-redux';
import {
  saveLocation,
  deleteLocation,
  startEditLocation,
  hideEditLocation,
  selectPreviousLocation,
  selectNextLocation,
  searchLocationsAndAddressFor,
  fetchLibrary,
  addLocation,
  hideAddLocation,
  showAddLocation,
  moveLibraryLocation,
} from 'lib/actions/library';
import { buildTripLocationFromLocation, getAddressForTripLocation } from 'lib/helpers';
import { clearTrip, addToTrip, removeTripLocation, moveTripLocation, changeUnits, fetchDistanceBetween } from 'lib/actions/trip';
import { getAddressesForTrip } from 'lib/selectors';
import flow from 'lodash.flow';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const LoggedIn = React.createClass( {
  propTypes: {
    isLoading: React.PropTypes.bool,
    library: React.PropTypes.array,
    visibleLocations: React.PropTypes.array,
    predictions: React.PropTypes.array,
    addresses: React.PropTypes.array,
    trip: React.PropTypes.array,
    prefs: React.PropTypes.object,
    isShowingAddLocation: React.PropTypes.bool,
    editingLocation: React.PropTypes.object,
    addingAddress: React.PropTypes.string,
    searchString: React.PropTypes.string,
    selectedLocation: React.PropTypes.number,
    isLoadingTrip: React.PropTypes.bool,
    fetchDistanceBetween: React.PropTypes.func.isRequired,
    fetchLibrary: React.PropTypes.func.isRequired,
    selectNextLocation: React.PropTypes.func.isRequired,
    selectPreviousLocation: React.PropTypes.func.isRequired,
    addToTrip: React.PropTypes.func.isRequired,
    showAddLocation: React.PropTypes.func.isRequired,
    hideAddLocation: React.PropTypes.func.isRequired,
    addLocation: React.PropTypes.func.isRequired,
    startEditLocation: React.PropTypes.func.isRequired,
    removeTripLocation: React.PropTypes.func.isRequired,
    clearTrip: React.PropTypes.func.isRequired,
    searchLocationsAndAddressFor: React.PropTypes.func.isRequired,
    hideEditLocation: React.PropTypes.func.isRequired,
    saveLocation: React.PropTypes.func.isRequired,
    deleteLocation: React.PropTypes.func.isRequired,
    changeUnits: React.PropTypes.func.isRequired,
    moveLibraryLocation: React.PropTypes.func.isRequired,
    moveTripLocation: React.PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.props.fetchLibrary();
  },

  componentDidMount() {
    if ( ! window ) return;
    window.document.body.addEventListener( 'keydown', this.mainKeyListener );
  },

  componentWillUnmount() {
    if ( ! window ) return;
    window.document.body.removeEventListener( 'keydown', this.mainKeyListener );
  },

  mainKeyListener( evt ) {
    if ( this.props.isShowingAddLocation || this.props.editingLocation ) return;
    switch ( evt.keyCode ) {
      case 40:
        // pressing up and down changes the selected location
        evt.preventDefault();
        return this.moveSelectDown();
      case 38:
        evt.preventDefault();
        return this.moveSelectUp();
      case 27:
        // pressing shift-esc clears the trip
        if ( evt.shiftKey ) {
          evt.preventDefault();
          return this.onClearTrip();
        }
        return;
      case 13:
        // pressing enter adds the selected location
        evt.preventDefault();
        return this.addSelectedLocationToTrip();
    }
  },

  getVisibleLocations() {
    return this.props.visibleLocations.concat( this.props.predictions );
  },

  moveSelectDown() {
    this.props.selectNextLocation( this.getVisibleLocations().length - 1 );
  },

  moveSelectUp() {
    this.props.selectPreviousLocation();
  },

  addSelectedLocationToTrip() {
    const location = this.getVisibleLocations()[ this.props.selectedLocation ];
    if ( ! location ) return;
    const lastTripLocation = ( this.props.trip.length > 0 ? this.props.trip[ this.props.trip.length - 1 ] : null );
    if ( lastTripLocation ) {
      const lastAddress = getAddressForTripLocation( lastTripLocation, this.props.library );
      const nextAddress = location.address;
      if ( nextAddress === lastAddress ) return; // Don't allow adding the same address twice
    }
    this.props.addToTrip( buildTripLocationFromLocation( location ) );
  },

  onCancelAddLocation() {
    this.props.hideAddLocation();
  },

  onAddLocation( params ) {
    this.props.addLocation( params );
  },

  onClearTrip() {
    this.props.clearTrip();
  },

  onSearch( searchString ) {
    this.props.searchLocationsAndAddressFor( searchString );
  },

  onCancelEditLocation() {
    this.props.hideEditLocation();
  },

  onSaveLocation( location, params ) {
    this.props.saveLocation( location, params );
  },

  onDeleteLocation( location ) {
    this.props.deleteLocation( location );
  },

  onClickUnits( unit ) {
    if ( unit === 'km' || unit === 'miles' ) this.props.changeUnits( unit );
  },

  onTripDrop( tripLocationIndex, targetLocationIndex ) {
    this.props.moveTripLocation( tripLocationIndex, targetLocationIndex );
  },

  renderClearTripButton() {
    if ( this.props.trip.length === 0 ) return (
      <span className="trip-distance-help label label-info animated bounce">
        This is where you will see the total distance of your trip
      </span>
    );
    return <WideButton className="clear-trip-button" text="Clear trip" onClick={ this.onClearTrip } />;
  },

  renderEditLocationForm() {
    if ( this.props.editingLocation ) {
      return (
        <EditLocationForm
          key="edit-location-form"
          location={ this.props.editingLocation }
          onSaveLocation={ this.onSaveLocation }
          onCancelEditLocation={ this.onCancelEditLocation }
          onDeleteLocation={ this.onDeleteLocation }
        />
      );
    }
  },

  renderAddLocationForm() {
    if ( this.props.isShowingAddLocation ) return <AddLocationForm key="add-location-form" onAddLocation={ this.onAddLocation } onCancelAddLocation={ this.onCancelAddLocation } initialAddress={ this.props.addingAddress } />;
  },

  renderAddLocationButton() {
    return <WideButton className="add-location-button" text="Add a new location" onClick={ this.props.showAddLocation() } />;
  },

  renderLoading() {
    return <LoadingPanel />;
  },

  renderSearchField() {
    if ( this.props.library.length > 1 && ! this.props.isShowingAddLocation && ! this.props.editingLocation ) return <LocationSearch onChange={ this.onSearch } />;
  },

  //renderMain() {
    //const lastTripLocationId = ( this.props.trip.length > 0 ? this.props.trip[ this.props.trip.length - 1 ].id : null );
    //return (
      //<div key="logged-in__main-row" className="row">
        //<div className="logged-in__main-column col-sm-6">
          //<a className="logged-in__trip-jump btn btn-info visible-xs-block" href="#trip-column">View Trip</a>
          //<div className="library-control-area">
            //{ this.renderAddLocationButton() }
            //{ this.renderSearchField() }
          //</div>
          //<Library
            //locations={ this.props.library }
            //visibleLocations={ this.props.visibleLocations }
            //onAddToTrip={ this.props.addToTrip }
            //onEditLocation={ this.props.startEditLocation }
            //onDrop={ this.moveLibraryLocation }
            //selectedLocation={ this.props.selectedLocation }
            //lastTripLocationId={ lastTripLocationId }
          ///>
        //</div>
        //<div id="trip-column" className="logged-in__main-column col-sm-6">
          //<div className="trip-control-area">
            //{ this.renderClearTripButton() }
            //<Distance
              //addresses={ this.props.addresses }
              //cachedDistances={ this.props.cachedDistances }
              //useMiles={ this.props.prefs.useMiles }
              //changeUnits={ this.onClickUnits }
              //fetchDistanceBetween={ this.props.fetchDistanceBetween }
            ///>
          //</div>
          //<Trip
            //library={ this.props.library }
            //tripLocations={ this.props.trip }
            //onRemoveTripLocation={ this.props.removeTripLocation }
            //onDrop={ this.onTripDrop }
          ///>
        //</div>
        //<ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          //{ this.renderAddLocationForm() }
        //</ReactCSSTransitionGroup>
        //<ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          //{ this.renderEditLocationForm() }
        //</ReactCSSTransitionGroup>
      //</div>
    //);
  //},

  render() {
    //const main = this.renderMain();
    //const library = null;
    const main = <Main />;
    return (
      <ReactCSSTransitionGroup transitionName="loading-panel" transitionEnterTimeout={ 0 } transitionLeaveTimeout={ 500 }>
        <div className="LoggedIn">
          { this.props.isLoading ? this.renderLoading() : main }
        </div>
        <ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          { this.renderAddLocationForm() }
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          { this.renderEditLocationForm() }
        </ReactCSSTransitionGroup>
      </ReactCSSTransitionGroup>
    );
  }
} );

function mapStateToProps( state ) {
  const { library, trip, ui, prefs } = state;
  return {
    isLoading: library.isLoading,
    library: library.locations,
    visibleLocations: library.visibleLocations,
    predictions: library.predictions,
    trip,
    addresses: getAddressesForTrip( state ),
    cachedDistances: state.distances,
    isShowingAddLocation: ui.isShowingAddLocation,
    searchString: ui.searchString,
    selectedLocation: ui.selectedLocation,
    editingLocation: ui.editingLocation,
    addingAddress: ui.addingAddress,
    prefs,
  };
}

export default flow(
  DragDropContext( HTML5Backend ),
  connect( mapStateToProps, {
    fetchDistanceBetween,
    fetchLibrary,
    selectNextLocation,
    selectPreviousLocation,
    addToTrip,
    showAddLocation,
    hideAddLocation,
    addLocation,
    startEditLocation,
    removeTripLocation,
    clearTrip,
    searchLocationsAndAddressFor,
    hideEditLocation,
    saveLocation,
    deleteLocation,
    changeUnits,
    moveLibraryLocation,
    moveTripLocation,
  } )
)( LoggedIn );
