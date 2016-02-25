export function reorderModels( ids, sourceId, targetId ) {
  const sourceIndex = ids.indexOf( sourceId );
  const targetIndex = ids.indexOf( targetId );
  if ( sourceIndex === -1 || targetIndex === -1 ) return null;

  let newIds = ids.slice( 0 ); // copy the array
  newIds.splice( sourceIndex, 1 ); // remove the id
  newIds.splice( targetIndex, 0, sourceId ); // add the id back

  return newIds;
}
