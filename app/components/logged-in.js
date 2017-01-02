import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Library from 'components/library';
import WideButton from 'components/wide-button';
import Trip from 'components/trip';
import Main from 'components/main';
import Distance from 'components/distance';
import AddLocationForm from 'components/add-location-form';
import EditLocationForm from 'components/edit-location-form';
import LocationSearch from 'components/location-search';
import LoadingPanel from 'components/loading-panel';
import { connect } from 'react-redux';
import { getTotalTripDistance, isDistanceComplete } from 'lib/selectors';
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
import { clearTrip, addToTrip, removeTripLocation, moveTripLocation, changeUnits } from 'lib/actions/trip';
import flow from 'lodash.flow';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const LoggedIn = React.createClass( {
  propTypes: {
    isLoading: React.PropTypes.bool,
    library: React.PropTypes.array,
    visibleLocations: React.PropTypes.array,
    predictions: React.PropTypes.array,
    trip: React.PropTypes.array,
    prefs: React.PropTypes.object,
    isShowingAddLocation: React.PropTypes.bool,
    editingLocation: React.PropTypes.object,
    searchString: React.PropTypes.string,
    distance: React.PropTypes.number,
    selectedLocation: React.PropTypes.number,
    isLoadingTrip: React.PropTypes.bool,
  },

  componentWillMount() {
    this.props.dispatch( fetchLibrary() );
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

  moveSelectDown() {
    this.props.dispatch( selectNextLocation( this.props.visibleLocations.length - 1 ) );
  },

  moveSelectUp() {
    this.props.dispatch( selectPreviousLocation() );
  },

  addSelectedLocationToTrip() {
    const location = this.props.visibleLocations[ this.props.selectedLocation ];
    if ( ! location ) return;
    const lastTripLocation = ( this.props.trip.length > 0 ? this.props.trip[ this.props.trip.length - 1 ] : null );
    const lastTripLocationId = ( lastTripLocation ? lastTripLocation._id || lastTripLocation : null );
    if ( lastTripLocationId === location._id ) return;
    this.props.dispatch( addToTrip( location ) );
  },

  getLocationById( id ) {
    return this.props.library.reduce( ( found, location ) => {
      if ( location._id === id ) return location;
      return found;
    }, null );
  },

  onShowAddLocation() {
    this.props.dispatch( showAddLocation() );
  },

  onCancelAddLocation() {
    this.props.dispatch( hideAddLocation() );
  },

  onAddLocation( params ) {
    this.props.dispatch( addLocation( params ) );
  },

  onAddToTrip( location ) {
    this.props.dispatch( addToTrip( location ) );
  },

  onEditLocation( location ) {
    this.props.dispatch( startEditLocation( location ) );
  },

  onRemoveTripLocation( index ) {
    this.props.dispatch( removeTripLocation( index ) );
  },

  onClearTrip() {
    this.props.dispatch( clearTrip() );
  },

  onSearch( searchString ) {
    this.props.dispatch( searchLocationsAndAddressFor( searchString ) );
  },

  onClearSearch() {
    this.props.dispatch( searchLocationsAndAddressFor( '' ) );
  },

  onCancelEditLocation() {
    this.props.dispatch( hideEditLocation() );
  },

  onSaveLocation( location, params ) {
    this.props.dispatch( saveLocation( location, params ) );
  },

  onDeleteLocation( location ) {
    this.props.dispatch( deleteLocation( location ) );
  },

  onClickUnits( unit ) {
    if ( unit === 'km' || unit === 'miles' ) this.props.dispatch( changeUnits( unit ) );
  },

  onLibraryDrop( location, targetLocation ) {
    this.props.dispatch( moveLibraryLocation( location, targetLocation ) );
  },

  onTripDrop( tripLocationIndex, targetLocationIndex ) {
    this.props.dispatch( moveTripLocation( tripLocationIndex, targetLocationIndex ) );
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
    if ( this.props.isShowingAddLocation ) return <AddLocationForm key="add-location-form" onAddLocation={ this.onAddLocation } onCancelAddLocation={ this.onCancelAddLocation } />;
  },

  renderAddLocationButton() {
    return <WideButton className="add-location-button" text="Add a new location" onClick={ this.onShowAddLocation } />;
  },

  renderLoading() {
    return <LoadingPanel />;
  },

  renderSearchField() {
    if ( this.props.library.length > 1 && ! this.props.isShowingAddLocation && ! this.props.editingLocation ) return <LocationSearch onChange={ this.onSearch } onClearSearch={ this.onClearSearch } />;
  },

  renderMain() {
    const lastTripLocationId = ( this.props.trip.length > 0 ? this.props.trip[ this.props.trip.length - 1 ] : null );
    return (
      <div key="logged-in__main-row" className="row">
        <div className="logged-in__main-column col-sm-6">
          <a className="logged-in__trip-jump btn btn-info visible-xs-block" href="#trip-column">View Trip</a>
          <div className="library-control-area">
            { this.renderAddLocationButton() }
            { this.renderSearchField() }
          </div>
          <Library
            locations={ this.props.library }
            visibleLocations={ this.props.visibleLocations }
            onAddToTrip={ this.onAddToTrip }
            onEditLocation={ this.onEditLocation }
            onDrop={ this.onLibraryDrop }
            selectedLocation={ this.props.selectedLocation }
            lastTripLocationId={ lastTripLocationId ? lastTripLocationId._id || lastTripLocationId : null }
          />
        </div>
        <div id="trip-column" className="logged-in__main-column col-sm-6">
          <div className="trip-control-area">
            { this.renderClearTripButton() }
            <Distance
              meters={ this.props.distance }
              useMiles={ this.props.prefs.useMiles }
              onClickUnits={ this.onClickUnits }
              isLoading={ this.props.isLoadingTrip }
            />
          </div>
          <Trip
            areThereLocations={ ( this.props.library.length > 1 ) }
            tripLocations={ this.props.trip }
            getLocationById={ this.getLocationById }
            onRemoveTripLocation={ this.onRemoveTripLocation }
            onDrop={ this.onTripDrop }
          />
        </div>
        <ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          { this.renderAddLocationForm() }
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          { this.renderEditLocationForm() }
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  render() {
    const main = <Main onSearch={ this.onSearch } />;
    const lastTripLocationId = ( this.props.trip.length > 0 ? this.props.trip[ this.props.trip.length - 1 ] : null );
    return (
      <ReactCSSTransitionGroup transitionName="loading-panel" transitionEnterTimeout={ 0 } transitionLeaveTimeout={ 500 }>
        { this.props.isLoading ? this.renderLoading() : main }
          <Library
            locations={ this.props.library }
            visibleLocations={ this.props.visibleLocations }
            predictions={ this.props.predictions }
            onAddToTrip={ this.onAddToTrip }
            onEditLocation={ this.onEditLocation }
            onDrop={ this.onLibraryDrop }
            selectedLocation={ this.props.selectedLocation }
            lastTripLocationId={ lastTripLocationId ? lastTripLocationId._id || lastTripLocationId : null }
          />
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
    distance: getTotalTripDistance( state ),
    isShowingAddLocation: ui.isShowingAddLocation,
    searchString: ui.searchString,
    selectedLocation: ui.selectedLocation,
    editingLocation: ui.editingLocation,
    prefs,
    isLoadingTrip: ! isDistanceComplete( state ),
  };
}

export default flow(
  DragDropContext( HTML5Backend ),
  connect( mapStateToProps )
)( LoggedIn );
