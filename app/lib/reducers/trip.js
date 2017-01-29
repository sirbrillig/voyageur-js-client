import { reorderArray, removeFromArray } from 'lib/helpers';

export default function trip( state = [], action ) {
  switch ( action.type ) {
    case 'TRIP_CLEAR':
      return [];
    case 'TRIP_GOT_TRIP_LOCATIONS':
      return action.trip;
    case 'TRIP_ADD_LOCATION':
      return [ ...state, action.location ];
    case 'TRIP_REMOVE_LOCATION':
      return removeFromArray( state, action.index );
    case 'TRIP_MOVE_LOCATION':
      return reorderArray( state, action.startIndex, action.destinationIndex ) || state;
  }
  return state;
}
