import { gotError } from 'lib/actions/general';
import * as api from 'lib/api/locations';
import { reorderModels, getHashFor } from 'lib/helpers';
import { searchAutocompleteFor } from 'lib/google';
import { Promise } from 'es6-promise';
import debugFactory from 'debug';

const debug = debugFactory( 'voyageur:library-actions' );

export function importLocations( data ) {
  return function( dispatch, getState ) {
    const locations = JSON.parse( data );
    if ( ! locations.map ) return dispatch( gotError( 'Only an array of Location objects can be submitted' ) );
    Promise.all( locations.map( params => api.createNewLocation( getState().auth.token, params ) ) )
    .then( () => dispatch( fetchLibrary() ) )
    .then( () => gotError( 'Import complete!' ) )
    .catch( err => dispatch( gotError( err ) ) );
  };
}

export function addLocation( params ) {
  return function( dispatch, getState ) {
    if ( ! params.name || ! params.address ) return dispatch( gotError( 'Locations must have a name and an address' ) );
    api.createNewLocation( getState().auth.token, params )
    .then( () => dispatch( fetchLibrary() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    const location = Object.assign( { _id: 'new-location_' + getHashFor( params.name + params.address ), isLoading: true }, params );
    dispatch( gotNewLocation( location ) );
  };
}

export function gotNewLocation( location ) {
  return { type: 'LIBRARY_GOT_NEW_LOCATION', location };
}

export function hideAddLocation() {
  return { type: 'LIBRARY_HIDE_ADD_LOCATION' };
}

export function showAddLocation( addingAddress = null ) {
  return { type: 'LIBRARY_SHOW_ADD_LOCATION', addingAddress };
}

export function fetchLibrary() {
  return function( dispatch, getState ) {
    api.listLocations( getState().auth.token )
    .then( ( locations ) => {
      dispatch( gotLibrary( locations ) );
    } )
    .catch( ( err ) => {
      dispatch( gotError( err ) );
    } );
  };
}

export function gotLibrary( library ) {
  return { type: 'LIBRARY_GOT_LOCATIONS', library };
}

export function searchLocationsFor( searchString ) {
  return { type: 'LIBRARY_SEARCH_FOR', searchString };
}

export function gotPredictions( predictions ) {
  return { type: 'LIBRARY_GOT_PREDICTIONS', predictions };
}

export function searchLocationsAndAddressFor( searchString ) {
  return function( dispatch ) {
    dispatch( searchLocationsFor( searchString ) );
    searchAutocompleteFor( searchString )
    .then( ( predictions ) => dispatch( gotPredictions( predictions ) ) )
    // Mostly silent errors because sometimes we just have no results
    .catch( ( err ) => console.error( `No autocomplete results for "${ searchString }"; error: `, err ) );
  };
}

export function selectNextLocation( max ) {
  return { type: 'LIBRARY_SELECT_NEXT', max };
}

export function selectPreviousLocation() {
  return { type: 'LIBRARY_SELECT_PREVIOUS' };
}

export function startEditLocation( location ) {
  return { type: 'LIBRARY_EDIT_LOCATION', location };
}

export function hideEditLocation() {
  return { type: 'LIBRARY_HIDE_EDIT_LOCATION' };
}

export function saveLocation( location, params ) {
  return function( dispatch, getState ) {
    if ( ! params.name || ! params.address ) return dispatch( gotError( 'Locations must have a name and an address' ) );
    api.updateLocationParams( getState().auth.token, location, params )
    .then( () => dispatch( fetchLibrary() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    const updated = Object.assign( {}, location, { isLoading: true }, params );
    dispatch( gotUpdatedLocation( updated ) );
    dispatch( hideEditLocation() );
  };
}

export function gotUpdatedLocation( location ) {
  return { type: 'LIBRARY_GOT_UPDATED_LOCATION', location };
}

export function deleteLocation( location ) {
  return function( dispatch, getState ) {
    api.deleteLocationFromLibrary( getState().auth.token, location )
    .then( () => {
      dispatch( fetchLibrary() );
    } )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    dispatch( gotDeletedLocation( location ) );
    dispatch( hideEditLocation() );
  };
}

export function gotDeletedLocation( location ) {
  return { type: 'LIBRARY_DELETE_LOCATION', location };
}

export function moveLibraryLocation( locationId, targetLocationId ) {
  return function( dispatch, getState ) {
    debug( 'moveLibraryLocation', locationId, targetLocationId );
    const newLibrary = reorderModels( getState().library.locations, locationId, targetLocationId );
    if ( ! newLibrary ) return dispatch( gotError( 'Could not find location data to move it' ) );

    api.reorderLibrary( getState().auth.token, newLibrary.map( x => x._id ) )
    .then( updatedLocations => dispatch( gotLibrary( updatedLocations ) ) )
    .catch( err => dispatch( gotError( err ) ) );

    // Optimistically update and mark all locations isLoading
    dispatch( gotLibrary( newLibrary.map( x => {
      x.isLoading = true;
      return x;
    } ) ) );
  };
}
