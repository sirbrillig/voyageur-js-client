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
import { buildTripLocationFromLocation, getAddressForTripLocation, getVisibleLocations } from 'lib/helpers';
import { clearTrip, addToTrip } from 'lib/actions/trip';
import flow from 'lodash.flow';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class LoggedIn extends React.Component {
  componentDidMount() {
    this.props.fetchLibrary();
    if ( window ) window.document.body.addEventListener( 'keydown', this.mainKeyListener );
  }

  componentWillUnmount() {
    if ( window ) window.document.body.removeEventListener( 'keydown', this.mainKeyListener );
  }

  mainKeyListener = ( evt ) => {
    if ( this.props.isShowingAddLocation || this.props.editingLocation || this.props.auth.expiredToken ) return;
    switch ( evt.keyCode ) {
      case 40:
        // pressing up and down changes the selected location
        evt.preventDefault();
        return this.props.selectNextLocation( this.getVisibleLocations().length - 1 );
      case 38:
        evt.preventDefault();
        return this.props.selectPreviousLocation();
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
  }

  getVisibleLocations = () => {
    return getVisibleLocations( this.props.library, this.props.searchString ).concat( this.props.predictions );
  }

  addSelectedLocationToTrip = () => {
    const location = this.getVisibleLocations()[ this.props.selectedLocation ];
    if ( ! location ) return;
    const lastTripLocation = ( this.props.trip.length > 0 ? this.props.trip[ this.props.trip.length - 1 ] : null );
    if ( lastTripLocation ) {
      const lastAddress = getAddressForTripLocation( lastTripLocation, this.props.library );
      const nextAddress = location.address;
      if ( nextAddress === lastAddress ) return; // Don't allow adding the same address twice
    }
    this.props.addToTrip( buildTripLocationFromLocation( location ) );
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="loading-panel" transitionEnterTimeout={ 0 } transitionLeaveTimeout={ 500 }>
        <div className="logged-in">
          { this.props.isLoading ? <LoadingPanel /> : <Main /> }
        </div>
        <ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          { this.props.isShowingAddLocation && <AddLocationForm key="add-location-form" onAddLocation={ this.props.addLocation } onCancelAddLocation={ this.props.hideAddLocation } initialAddress={ this.props.addingAddress } /> }
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup transitionName="add-location-form-container" transitionEnterTimeout={ 300 } transitionLeaveTimeout={ 300 }>
          { this.props.editingLocation && <EditLocationForm key="edit-location-form" location={ this.props.editingLocation } onSaveLocation={ this.props.saveLocation } onCancelEditLocation={ this.props.hideEditLocation } onDeleteLocation={ this.props.deleteLocation } /> }
        </ReactCSSTransitionGroup>
      </ReactCSSTransitionGroup>
    );
  }
}

LoggedIn.propTypes = {
  isLoading: React.PropTypes.bool,
  library: React.PropTypes.array,
  predictions: React.PropTypes.array,
  trip: React.PropTypes.array,
  auth: React.PropTypes.object,
  searchString: React.PropTypes.string,
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
};

function mapStateToProps( state ) {
  return {
    isLoading: state.library.isLoading,
    library: state.library.locations,
    predictions: state.library.predictions,
    trip: state.trip,
    isShowingAddLocation: state.ui.isShowingAddLocation,
    selectedLocation: state.ui.selectedLocation,
    editingLocation: state.ui.editingLocation,
    addingAddress: state.ui.addingAddress,
    searchString: state.ui.searchString,
    auth: state.auth,
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
