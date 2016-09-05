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
  return state.trip.map( id => getLocationById( state, id ) )
  .filter( location => !! location );
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

export function getDistanceDataForKey( state, key ) {
  return state.distances[ key ] || {};
}

export function getDistanceForKey( state, key ) {
  return getDistanceDataForKey( state, key ).distance;
}

export function isDistanceComplete( state ) {
  const tripLocations = getLocationsForTrip( state );
  const tripDistances = getTripDistances( state );
  return ( tripLocations.length - 1 ) <= tripDistances.length;
}

export function isDistanceExpired( state, key ) {
  const maxDistanceAge = 7 * 24 * 60 * 60 * 1000;
  const lastUpdatedAt = getDistanceDataForKey( state, key ).lastUpdatedAt || 0;
  const age = Date.now() - lastUpdatedAt;
  return age > maxDistanceAge;
}
