import { gotError } from './general';
import * as api from '../api/trip';
import { reorderModels } from '../helpers';

export function removeTripLocation( tripLocationId ) {
  return function( dispatch, getState ) {
    api.deleteTripLocation( getState().auth.token, tripLocationId )
    .then( () => dispatch( fetchTrip() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    dispatch( gotRemovedTripLocation( tripLocationId ) );
  }
}

export function addToTrip( location ) {
  return function( dispatch, getState ) {
    api.createNewTripLocation( getState().auth.token, { location } )
    .then( () => dispatch( fetchTrip() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    const tripLocation = Object.assign( { _id: 'new-trip-location_' + Date.now(), isLoading: true, location } );
    dispatch( gotNewTripLocation( tripLocation ) );
  }
}

export function gotNewTripLocation( tripLocation ) {
  return { type: 'TRIP_GOT_NEW_TRIP_LOCATION', tripLocation };
}

export function fetchTrip() {
  return function( dispatch, getState ) {
    api.listTripLocations( getState().auth.token )
    .then( tripLocations => dispatch( gotTrip( tripLocations ) ) )
    .then( () => dispatch( fetchDistance() ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function fetchDistance() {
  return function( dispatch, getState ) {
    api.getTripDistance( getState().auth.token )
    .then( data => dispatch( gotDistance( data.distance ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function gotDistance( distance ) {
  return { type: 'TRIP_GOT_DISTANCE', distance };
}

export function gotTrip( trip ) {
  return { type: 'TRIP_GOT_TRIP_LOCATIONS', trip };
}

export function gotRemovedTripLocation( tripLocationId ) {
  return { type: 'TRIP_GOT_REMOVE_TRIP_LOCATION', tripLocationId };
}

export function clearTrip() {
  return function( dispatch, getState ) {
    api.removeAllTripLocations( getState().auth.token )
    .then( data => dispatch( gotTrip( data ) ) )
    .catch( err => dispatch( gotError( err ) ) );
    dispatch( gotClearedTrip() );
  }
}

export function gotClearedTrip() {
  return { type: 'TRIP_CLEAR' };
}

export function moveTripLocation( tripLocationId, targetLocationId ) {
  return function( dispatch, getState ) {
    const newTrip = reorderModels( getState().trip, tripLocationId, targetLocationId );
    if ( ! newTrip ) return dispatch( gotError( 'Could not find tripLocation data to move it' ) );

    api.reorderTrip( getState().auth.token, newTrip.map( x => x._id ) )
    .then( updatedTrip => dispatch( gotTrip( updatedTrip ) ) )
    .catch( err => dispatch( gotError( err ) ) );

    // Optimistically update and mark all tripLocations isLoading
    dispatch( gotTrip( newTrip.map( x => {
      x.isLoading = true;
      return x;
    } ) ) );
  }
}
