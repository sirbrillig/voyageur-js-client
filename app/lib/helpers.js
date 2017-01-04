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
    return dest ? pairs.concat( { start, dest } ) : pairs;
  }, [] );
}

export function buildTripLocationFromLocation( location ) {
  if ( ! location._id && ! location.description ) return null;
  return location.description ? { address: location.description } : { id: location._id };
}
