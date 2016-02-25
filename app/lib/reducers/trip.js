export default function trip( state = [], action ) {
  switch ( action.type ) {
    case 'TRIP_CLEAR':
      return [];
    case 'TRIP_GOT_TRIP_LOCATIONS':
      return action.trip;
  }
  return state;
}
