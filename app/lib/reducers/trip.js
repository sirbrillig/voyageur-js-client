export default function trip( state = [], action ) {
  switch ( action.type ) {
    case 'TRIP_CLEAR':
      return [];
    case 'TRIP_GOT_TRIP_LOCATIONS':
      return action.trip;
    case 'TRIP_GOT_NEW_TRIP_LOCATION':
      return [ ...state, action.tripLocation ];
    case 'TRIP_GOT_REMOVE_TRIP_LOCATION':
      return state.reduce( ( remaining, tripLocation ) => {
        if ( tripLocation._id === action.tripLocationId ) return remaining;
        return [ ...remaining, tripLocation ];
      }, [] );
  }
  return state;
}
