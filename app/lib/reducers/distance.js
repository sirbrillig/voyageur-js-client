const initialState = { distance: 0, isLoading: false };
export default function distance( state = initialState, action ) {
  switch ( action.type ) {
    case 'TRIP_CLEAR':
      return initialState;
    case 'TRIP_FETCHING_DISTANCE':
      return Object.assign( {}, state, { isLoading: true } );
    case 'TRIP_GOT_DISTANCE':
      return Object.assign( {}, state, { distance: action.distance, isLoading: false } );
  }
  return state;
}
