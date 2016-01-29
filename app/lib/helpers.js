import findWhere from 'lodash.findwhere';

export function reorderModels( elements, sourceId, targetId ) {
  const ids = elements.map( x => x._id );
  const targetIndex = ids.indexOf( targetId );
  const sourceIndex = ids.indexOf( sourceId );
  const sourceElement = findWhere( elements, { _id: sourceId } );
  if ( ! sourceElement || sourceIndex === -1 || targetIndex === -1 ) return null;

  let newElements = elements.slice( 0 ); // copy the array
  newElements.splice( sourceIndex, 1 ); // remove from the old element
  newElements.splice( targetIndex, 0, sourceElement ); // add the element back

  return newElements;
}
