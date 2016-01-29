const initialState = { errors: [] };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'ERROR':
      const text = action.error.toString();
      const errors = [ ...state.errors, text ];
      return Object.assign( {}, state, { errors } );
    case 'NOTICES_CLEAR':
      return Object.assign( {}, initialState );
  }
  return state;
}
