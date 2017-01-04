import { gotError } from 'lib/actions/general';
import { getDistanceBetween as getApiDistanceBetween } from 'lib/api/trip';

export function removeTripLocation( index ) {
  return { type: 'TRIP_REMOVE_LOCATION', index };
}

export function addToTrip( location ) {
  return { type: 'TRIP_ADD_LOCATION', location };
}

export function fetchDistanceBetween( start, dest ) {
  return function( dispatch, getState ) {
    getApiDistanceBetween( getState().auth.token, start, dest )
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

export function gotTrip( trip ) {
  return { type: 'TRIP_GOT_TRIP_LOCATIONS', trip };
}

export function clearTrip() {
  return { type: 'TRIP_CLEAR' };
}

export function moveTripLocation( startIndex, destinationIndex ) {
  return { type: 'TRIP_MOVE_LOCATION', startIndex, destinationIndex };
}

export function changeUnits( unit ) {
  return { type: 'UNITS_CHANGE', unit };
}
