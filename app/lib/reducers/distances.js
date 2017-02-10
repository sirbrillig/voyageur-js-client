import { getKeyForAddresses } from 'lib/helpers';

export default function distances( state = {}, action ) {
  switch ( action.type ) {
    case 'TRIP_GOT_DISTANCE_BETWEEN':
      return Object.assign( {}, state, {
        [ getKeyForAddresses( action.start, action.dest ) ]:
        { lastUpdatedAt: performance.now(), distance: action.distance }
      } );
  }
  return state;
}
