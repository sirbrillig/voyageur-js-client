import get from 'lodash.get';

const initialState = { token: null, user: null };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'ERROR':
      const text = get( action, 'error.response.text', '' );
      if ( text.match( /expired/ ) ) {
        return Object.assign( {}, initialState );
      }
      break;
    case 'AUTH_GOT_TOKEN':
      return Object.assign( {}, state, { token: action.token } );
    case 'AUTH_GOT_USER':
      return Object.assign( {}, state, { user: action.user } );
    case 'AUTH_LOG_OUT':
      return initialState;
  }
  return state;
}
