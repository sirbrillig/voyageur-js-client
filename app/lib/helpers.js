import findWhere from 'lodash.findwhere';
import crypto from 'crypto';

export function reorderArray( ids, sourceIndex, targetIndex ) {
  if ( sourceIndex === -1 || targetIndex === -1 ) return null;
  const sourceId = ids[ sourceIndex ];
  if ( ! sourceId ) return null;
  const newIds = ids.slice( 0 ); // copy the array
  newIds.splice( sourceIndex, 1 ); // remove the id
  newIds.splice( targetIndex, 0, sourceId ); // add the id back
  return newIds;
}

export function removeFromArray( ids, index ) {
  const ary = ids.slice( 0 ); // copy the array
  ary.splice( index, 1 ); // remove the id
  return ary;
}

export function reorderModels( elements, sourceId, targetId ) {
  const ids = elements.map( x => x._id );
  const targetIndex = ids.indexOf( targetId );
  const sourceIndex = ids.indexOf( sourceId );
  const sourceElement = findWhere( elements, { _id: sourceId } );
  if ( ! sourceElement || sourceIndex === -1 || targetIndex === -1 ) return null;

  const newElements = elements.slice( 0 ); // copy the array
  newElements.splice( sourceIndex, 1 ); // remove from the old element
  newElements.splice( targetIndex, 0, sourceElement ); // add the element back

  return newElements;
}

export function getHashFor( str ) {
  return crypto.createHash( 'md5' ).update( str ).digest( 'hex' );
}

export function getKeyForAddresses( start, dest ) {
  return getHashFor( start + dest );
}

export function getAddressPairs( addrs ) {
  return addrs.reduce( ( pairs, start, index ) => {
    const dest = addrs[ index + 1 ];
    if ( start === dest ) return pairs;
    return dest ? pairs.concat( { start, dest } ) : pairs;
  }, [] );
}

export function buildTripLocationFromLocation( location ) {
  if ( ! location._id && ! location.description ) return null;
  return location.description ? { address: location.description } : { id: location._id };
}

export function getAddressForTripLocation( tripLocation, locations ) {
  const getLocationById = id => findWhere( locations, { _id: id } );
  const getAddressByLocationId = id => ( getLocationById( id ) || {} ).address;
  return tripLocation.address || getAddressByLocationId( tripLocation.id );
}

export function getNameForTripLocation( tripLocation, locations ) {
  const getLocationById = id => findWhere( locations, { _id: id } );
  const getNameByLocationId = id => ( getLocationById( id ) || {} ).name;
  return getNameByLocationId( tripLocation.id );
}

export function sumUnlessNull( a, b ) {
  if ( a === null || b === null ) return null;
  return a + b;
}

export function isCacheExpired( cache ) {
  const maxDistanceAge = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return ( ( now - cache.lastUpdatedAt || 0 ) > maxDistanceAge );
}

export function getCachedDistanceForPair( pair, cachedDistances ) {
  const cached = cachedDistances[ getKeyForAddresses( pair.start, pair.dest ) ];
  if ( ! cached || isCacheExpired( cached ) ) return null;
  return cached.distance;
}

export function getVisibleLocations( locations, searchString ) {
  const matchesSearch = loc => {
    if ( searchString.length < 2 ) return true;
    return ( ~loc.name.toLowerCase().indexOf( searchString.toLowerCase() ) || ~loc.address.toLowerCase().indexOf( searchString.toLowerCase() ) );
  };
  return locations.filter( matchesSearch );
}

export function getAddressesForTrip( trip, locations ) {
  const getLocationById = id => findWhere( locations, { _id: id } );
  // Trips can contain `id` that maps to a library location or just an `address`
  return trip
    .map( location => location.id ? getLocationById( location.id ) : { address: location.address } )
    .filter( location => !! location )
    .map( location => location.address );
}
