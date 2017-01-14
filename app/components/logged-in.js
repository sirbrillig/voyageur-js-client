import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Main from 'components/main';
import AddLocationForm from 'components/add-location-form';
import EditLocationForm from 'components/edit-location-form';
import LoadingPanel from 'components/loading-panel';
import { connect } from 'react-redux';
import {
  saveLocation,
  deleteLocation,
  hideEditLocation,
  selectPreviousLocation,
  selectNextLocation,
  searchLocationsAndAddressFor,
  fetchLibrary,
  addLocation,
  hideAddLocation,
} from 'lib/actions/library';
import { buildTripLocationFromLocation, getAddressForTripLocation } from 'lib/helpers';
import { clearTrip, addToTrip } from 'lib/actions/trip';
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
    isShowingAddLocation: React.PropTypes.bool,
    editingLocation: React.PropTypes.object,
    addingAddress: React.PropTypes.string,
    selectedLocation: React.PropTypes.number,
    isLoadingTrip: React.PropTypes.bool,
    fetchLibrary: React.PropTypes.func.isRequired,
    selectNextLocation: React.PropTypes.func.isRequired,
    selectPreviousLocation: React.PropTypes.func.isRequired,
    addToTrip: React.PropTypes.func.isRequired,
    hideAddLocation: React.PropTypes.func.isRequired,
    addLocation: React.PropTypes.func.isRequired,
    clearTrip: React.PropTypes.func.isRequired,
    searchLocationsAndAddressFor: React.PropTypes.func.isRequired,
    hideEditLocation: React.PropTypes.func.isRequired,
    saveLocation: React.PropTypes.func.isRequired,
    deleteLocation: React.PropTypes.func.isRequired,
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
          return this.props.clearTrip();
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

  renderEditLocationForm() {
    if ( this.props.editingLocation ) return <EditLocationForm key="edit-location-form" location={ this.props.editingLocation } onSaveLocation={ this.props.saveLocation } onCancelEditLocation={ this.props.hideEditLocation } onDeleteLocation={ this.props.deleteLocation } />;
  },

  renderAddLocationForm() {
    if ( this.props.isShowingAddLocation ) return <AddLocationForm key="add-location-form" onAddLocation={ this.props.addLocation } onCancelAddLocation={ this.props.hideAddLocation } initialAddress={ this.props.addingAddress } />;
  },

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="loading-panel" transitionEnterTimeout={ 0 } transitionLeaveTimeout={ 500 }>
        <div className="logged-in">
          { this.props.isLoading ? <LoadingPanel /> : <Main /> }
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
  return {
    isLoading: state.library.isLoading,
    library: state.library.locations,
    visibleLocations: state.library.visibleLocations,
    predictions: state.library.predictions,
    trip: state.trip,
    addresses: getAddressesForTrip( state ),
    isShowingAddLocation: state.ui.isShowingAddLocation,
    selectedLocation: state.ui.selectedLocation,
    editingLocation: state.ui.editingLocation,
    addingAddress: state.ui.addingAddress,
  };
}

const actions = {
  fetchLibrary,
  selectNextLocation,
  selectPreviousLocation,
  addToTrip,
  hideAddLocation,
  addLocation,
  clearTrip,
  searchLocationsAndAddressFor,
  hideEditLocation,
  saveLocation,
  deleteLocation,
};

export default flow(
  DragDropContext( HTML5Backend ),
  connect( mapStateToProps, actions )
)( LoggedIn );
