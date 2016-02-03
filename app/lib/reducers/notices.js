const initialState = { errors: [] };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'ERROR':
      let text = action.error.response ? action.error.response.text : action.error.toString();
      if ( text.match( /ZERO/i ) ) {
        text += '; Maybe check that your addresses are valid?';
      }
      const errors = [ ...state.errors, text ];
      return Object.assign( {}, state, { errors } );
    case 'NOTICES_CLEAR':
      return Object.assign( {}, initialState );
  }
  return state;
}
