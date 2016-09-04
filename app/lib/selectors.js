import { getKeyForAddresses } from './helpers';

export function getLocations( state ) {
  return state.library.locations;
}

export function getLocationById( state, id ) {
  return getLocations( state ).reduce( ( found, location ) => {
    if ( location._id === id ) return location;
    return found;
  }, null );
}

export function getLocationsForTrip( state ) {
  return state.trip.map( id => getLocationById( state, id ) );
}

export function getAddressesForTrip( state ) {
  return getLocationsForTrip( state )
  .map( location => location.address );
}

export function getAddressPairs( state ) {
  const addrs = getAddressesForTrip( state );
  return addrs.reduce( ( pairs, start, index ) => {
    const dest = addrs[ index + 1 ];
    return dest ? pairs.concat( { start, dest } ) : pairs;
  }, [] );
}

export function getTripDistances( state ) {
  const pairs = getAddressPairs( state );
  return pairs.map( pair => getDistanceForKey( state, getKeyForAddresses( pair.start, pair.dest ) ) );
}

export function getTotalTripDistance( state ) {
  return getTripDistances( state ).reduce( ( prev, num ) => prev + num, 0 );
}

export function getDistanceForKey( state, key ) {
  return state.distances[ key ];
}
