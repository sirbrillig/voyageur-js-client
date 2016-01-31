const initialState = { useMiles: true };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'UNITS_CHANGE':
      return Object.assign( {}, state, { useMiles: action.unit === 'miles' } );
  }
  return state;
}
