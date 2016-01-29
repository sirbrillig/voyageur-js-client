import React from 'react';
import Library from './library';
import WideButton from './wide-button';
import Trip from './trip';
import TripMap from './trip-map';
import AddLocationForm from './add-location-form';
import EditLocationForm from './edit-location-form';
import LocationSearch from './location-search';
import { connect } from 'react-redux';
import {
  saveLocation,
  deleteLocation,
  startEditLocation,
  hideEditLocation,
  selectPreviousLocation,
  selectNextLocation,
  searchLocationsFor,
  fetchLibrary,
  addLocation,
  hideAddLocation,
  showAddLocation,
  moveLibraryLocation,
} from '../lib/actions/library';
import { clearTrip, addToTrip, removeTripLocation, moveTripLocation, fetchTrip } from '../lib/actions/trip';
import flow from 'lodash.flow';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const Distance = ( props ) => <div className="distance well well-sm">{ ( props.meters * 0.000621371192 ).toFixed( 1 ) } miles</div>;

const LoggedIn = React.createClass( {
  propTypes: {
    isLoading: React.PropTypes.bool,
    library: React.PropTypes.array,
    visibleLocations: React.PropTypes.array,
    trip: React.PropTypes.array,
    isShowingAddLocation: React.PropTypes.bool,
    editingLocation: React.PropTypes.object,
    searchString: React.PropTypes.string,
    distance: React.PropTypes.number,
    selectedLocation: React.PropTypes.number,
  },

  componentWillMount() {
    this.props.dispatch( fetchLibrary() );
    this.props.dispatch( fetchTrip() );
  },

  componentDidMount() {
    this.listenForKeys();
  },

  listenForKeys() {
    if ( ! window ) return;
    window.document.body.addEventListener( 'keydown', ( evt ) => {
      switch ( evt.keyCode ) {
        case 40:
          // pressing up and down changes the selected location
          evt.preventDefault();
          return this.moveSelectDown();
        case 38:
          evt.preventDefault();
          return this.moveSelectUp();
        case 13:
          // pressing enter adds the selected location
          return this.addSelectedLocationToTrip();
      }
    } );
  },

  moveSelectDown() {
    this.props.dispatch( selectNextLocation( this.props.visibleLocations.length - 1 ) );
  },

  moveSelectUp() {
    this.props.dispatch( selectPreviousLocation() );
  },

  addSelectedLocationToTrip() {
    const location = this.props.visibleLocations[ this.props.selectedLocation ];
    this.props.dispatch( addToTrip( location ) );
  },

  getLocationById( id ) {
    return this.props.library.reduce( ( found, location ) => {
      if ( location._id === id ) return location;
      return found;
    }, null );
  },

  toggleAddLocationForm() {
    if ( this.props.isShowingAddLocation ) {
      return this.props.dispatch( hideAddLocation() );
    }
    this.props.dispatch( showAddLocation() );
  },

  onAddLocation( params ) {
    this.props.dispatch( addLocation( params ) );
  },

  onAddToTrip( location ) {
    this.props.dispatch( addToTrip( location ) );
  },

  onEditLocation( location ) {
    this.props.dispatch( startEditLocation( location ) )
  },

  onRemoveTripLocation( tripLocation ) {
    this.props.dispatch( removeTripLocation( tripLocation ) );
  },

  onClearTrip() {
    this.props.dispatch( clearTrip() );
  },

  onSearch( searchString ) {
    this.props.dispatch( searchLocationsFor( searchString ) );
  },

  onClearSearch() {
    this.props.dispatch( searchLocationsFor( '' ) );
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

  onLibraryDrop( location, targetLocation ) {
    this.props.dispatch( moveLibraryLocation( location, targetLocation ) );
  },

  onTripDrop( tripLocation, targetLocation ) {
    this.props.dispatch( moveTripLocation( tripLocation, targetLocation ) );
  },

  renderEditLocationForm() {
    if ( this.props.editingLocation ) {
      return (
        <EditLocationForm
          location={ this.props.editingLocation }
          onSaveLocation={ this.onSaveLocation }
          onCancelEditLocation={ this.onCancelEditLocation }
          onDeleteLocation={ this.onDeleteLocation }
        />
      );
    }
  },

  renderAddLocationForm() {
    if ( ! this.props.isShowingAddLocation ) return;
    return <AddLocationForm onAddLocation={ this.onAddLocation }/>;
  },

  renderAddLocationButton() {
    const text = this.props.isShowingAddLocation ? 'Cancel adding location' : 'Add a new location';
    return <WideButton className="add-location-button" text={ text } onClick={ this.toggleAddLocationForm } />
  },

  renderMap() {
    if ( this.props.trip.length < 2 ) return;
    return <TripMap tripLocations={ this.props.trip } getLocationById={ this.getLocationById } />;
  },

  renderLoading() {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  },

  renderMain() {
    return (
      <div className="row">
        <div className="col-xs-6">
          { this.renderAddLocationButton() }
          { this.renderAddLocationForm() }
          <LocationSearch onChange={ this.onSearch } onClearSearch={ this.onClearSearch } />
          <Library
          locations={ this.props.library }
          visibleLocations={ this.props.visibleLocations }
          onAddToTrip={ this.onAddToTrip }
          onEditLocation={ this.onEditLocation }
          onDrop={ this.onLibraryDrop }
          selectedLocation={ this.props.selectedLocation }
          />
        </div>
        <div className="col-xs-6">
          <WideButton className="clear-trip-button" text="Clear trip" onClick={ this.onClearTrip } />
          { this.renderMap() }
          <Distance meters={ this.props.distance } />
          <Trip
            tripLocations={ this.props.trip }
            getLocationById={ this.getLocationById }
            onRemoveTripLocation={ this.onRemoveTripLocation }
            onDrop={ this.onTripDrop }
          />
        </div>
        { this.renderEditLocationForm() }
      </div>
    );
  },

  render() {
    return this.props.isLoading ? this.renderLoading() : this.renderMain();
  }
} );

function mapStateToProps( state ) {
  const { library, trip, ui, distance } = state;
  return {
    isLoading: library.isLoading,
    library: library.locations,
    visibleLocations: library.visibleLocations,
    trip,
    distance: distance.distance,
    isShowingAddLocation: ui.isShowingAddLocation,
    searchString: ui.searchString,
    selectedLocation: ui.selectedLocation,
    editingLocation: ui.editingLocation,
  };
}

export default flow(
  DragDropContext( HTML5Backend ),
  connect( mapStateToProps )
)( LoggedIn );
