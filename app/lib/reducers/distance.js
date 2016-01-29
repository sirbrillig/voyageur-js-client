const initialState = { distance: 0 };
export default function distance( state = initialState, action ) {
  switch ( action.type ) {
    case 'TRIP_CLEAR':
      return initialState;
    case 'TRIP_GOT_DISTANCE':
      return Object.assign( {}, state, { distance: action.distance } );
  }
  return state;
}
