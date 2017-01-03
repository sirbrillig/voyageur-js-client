import { gotError } from 'lib/actions/general';
import * as api from 'lib/api/trip';
import { reorderArray, getKeyForAddresses } from 'lib/helpers';
import { getAddressPairs, getDistanceForKey, isDistanceExpired } from 'lib/selectors';

export function removeTripLocation( index ) {
  return function( dispatch, getState ) {
    const ids = getState().trip.slice( 0 ); // copy the array
    ids.splice( index, 1 ); // remove the id
    dispatch( gotTrip( ids ) );
    dispatch( updateDistance() );
  };
}

export function addToTrip( location ) {
  return function( dispatch, getState ) {
    const locationId = location._id || location;
    if ( ! locationId ) return dispatch( gotError( 'Error adding location to trip; I could not find the location!' ) );
    dispatch( fetchingDistance() );
    const ids = [ ...getState().trip, locationId ];
    dispatch( gotTrip( ids ) );
    dispatch( updateDistance() );
  };
}

export function updateDistance() {
  return function( dispatch, getState ) {
    // split trip into pairs
    const addrPairs = getAddressPairs( getState() );
    // find cached pairs
    const cached = addrPairs.filter( pair => getDistanceForKey( getState(), getKeyForAddresses( pair.start, pair.dest ) ) );
    // find expired cached pairs
    const expired = cached.filter( pair => isDistanceExpired( getState(), getKeyForAddresses( pair.start, pair.dest ) ) );
    // find uncached pairs
    const uncached = addrPairs.filter( pair => ! getDistanceForKey( getState(), getKeyForAddresses( pair.start, pair.dest ) ) );
    // fetch distance for each uncached pair
    uncached.concat( expired ).map( pair => dispatch( fetchDistanceBetween( pair.start, pair.dest ) ) );
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

export function fetchingDistance() {
  return { type: 'TRIP_FETCHING_DISTANCE' };
}

export function gotTrip( trip ) {
  return { type: 'TRIP_GOT_TRIP_LOCATIONS', trip };
}

export function clearTrip() {
  return function( dispatch ) {
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
    dispatch( gotTrip( newTrip ) );
    dispatch( updateDistance() );
  };
}

export function changeUnits( unit ) {
  return { type: 'UNITS_CHANGE', unit };
}
