import { gotError } from './general';
import * as api from '../api/trip';
import { reorderModels } from '../helpers';

export function removeTripLocation( tripLocationId ) {
  return function( dispatch, getState ) {
    const ids = getState().trip.filter( id => id !== tripLocationId );
    api.reorderTrip( getState().auth.token, ids )
    .then( () => dispatch( fetchTrip() ) )
    .catch( err => dispatch( gotError( err ) ) );
    dispatch( gotTrip( ids ) );
  }
}

export function addToTrip( location ) {
  return function( dispatch, getState ) {
    const locationId = location._id || location;
    if ( ! locationId ) return dispatch( gotError( 'Error adding location to trip; I could not find the location!' ) );
    const ids = [ ...getState().trip, locationId ];
    api.reorderTrip( getState().auth.token, ids )
    .then( () => dispatch( fetchTrip() ) )
    .catch( err => dispatch( gotError( err ) ) );
    dispatch( gotTrip( ids ) );
  }
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
    dispatch( fetchingDistance() );
    api.getTripDistance( getState().auth.token )
    .then( data => dispatch( gotDistance( data.distance ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function fetchingDistance() {
  return { type: 'TRIP_FETCHING_DISTANCE' };
}

export function gotDistance( distance ) {
  return { type: 'TRIP_GOT_DISTANCE', distance };
}

export function gotTrip( trip ) {
  return { type: 'TRIP_GOT_TRIP_LOCATIONS', trip };
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

    api.reorderTrip( getState().auth.token, newTrip )
    .then( updatedTrip => dispatch( gotTrip( updatedTrip ) ) )
    .catch( err => dispatch( gotError( err ) ) );

    dispatch( gotTrip( newTrip ) );
    // Optimistically update and mark all tripLocations isLoading
    // TODO: how do we do this now since tripLocations are just IDs?
    //dispatch( gotTrip( newTrip.map( x => {
      //x.isLoading = true;
      //return x;
    //} ) ) );
  }
}

export function changeUnits( unit ) {
  return { type: 'UNITS_CHANGE', unit };
}
