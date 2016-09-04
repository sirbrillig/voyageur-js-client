import { gotError } from './general';
import * as api from '../api/trip';
import { reorderArray, getHashFor } from '../helpers';
import { getAddressPairs, getDistanceForKey } from '../selectors';

export function removeTripLocation( index ) {
  return function( dispatch, getState ) {
    const ids = getState().trip.slice( 0 ); // copy the array
    ids.splice( index, 1 ); // remove the id
    api.reorderTrip( getState().auth.token, ids )
    .then( () => dispatch( fetchTrip() ) )
    .catch( err => dispatch( gotError( err ) ) );
    dispatch( gotTrip( ids ) );
  };
}

export function addToTrip( location ) {
  return function( dispatch, getState ) {
    const locationId = location._id || location;
    if ( ! locationId ) return dispatch( gotError( 'Error adding location to trip; I could not find the location!' ) );
    dispatch( fetchingDistance() );
    const ids = [ ...getState().trip, locationId ];
    //api.reorderTrip( getState().auth.token, ids )
    //.then( () => dispatch( fetchTrip() ) )
    //.catch( err => dispatch( gotError( err ) ) );
    dispatch( gotTrip( ids ) );
    dispatch( updateDistance() );
  };
}

export function updateDistance() {
  return function( dispatch, getState ) {
    // split trip into pairs
    const addrPairs = getAddressPairs( getState() );
    // find cached pairs
    const uncached = addrPairs.filter( pair => ! getDistanceForKey( getState(), getHashFor( pair.start + pair.dest ) ) );
    // fetch distance for each uncached pair
    uncached.map( pair => dispatch( fetchDistanceBetween( pair.start, pair.dest ) ) );
  };
}

export function fetchDistanceBetween( start, dest ) {
  return function( dispatch, getState ) {
    api.getDistanceBetween( getState().auth.token, start, dest )
    .then( data => dispatch( gotDistanceBetween( start, dest, data ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  };
}

export function gotDistanceBetween( start, dest, distance ) {
  return {
    type: 'TRIP_GOT_DISTANCE_BETWEEN',
    start,
    dest,
    distance,
  };
}

export function fetchTrip() {
  return function( dispatch, getState ) {
    api.listTripLocations( getState().auth.token )
    .then( tripLocations => dispatch( gotTrip( tripLocations ) ) )
    .then( () => dispatch( fetchDistance() ) )
    .catch( err => dispatch( gotError( err ) ) );
  };
}

export function fetchDistance() {
  return function( dispatch, getState ) {
    dispatch( fetchingDistance() );
    api.getTripDistance( getState().auth.token )
    .then( data => dispatch( gotDistance( data.distance ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  };
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
  };
}

export function gotClearedTrip() {
  return { type: 'TRIP_CLEAR' };
}

export function moveTripLocation( tripLocationIndex, targetLocationIndex ) {
  return function( dispatch, getState ) {
    const newTrip = reorderArray( getState().trip, tripLocationIndex, targetLocationIndex );
    if ( ! newTrip ) return dispatch( gotError( 'Could not find tripLocation data to move it' ) );
    dispatch( fetchingDistance() );

    api.reorderTrip( getState().auth.token, newTrip )
    .then( () => dispatch( fetchTrip() ) )
    .catch( err => dispatch( gotError( err ) ) );

    dispatch( gotTrip( newTrip ) );
  };
}

export function changeUnits( unit ) {
  return { type: 'UNITS_CHANGE', unit };
}
