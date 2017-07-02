import get from 'lodash.get';

const initialState = { token: null, user: null, expiredToken: false };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'AUTH_SET_EXPIRED_TOKEN':
      return Object.assign( {}, state, { expiredToken: true } );
    case 'ERROR':
      // TODO: support Flux Standard Action errors
      const text = get( action, 'error.response.text', '' );
      if ( text.match( /Expired token/i ) ) {
        return Object.assign( {}, state, { expiredToken: true } );
      } else if ( text.match( /unauthorized/i ) ) {
        return initialState;
      }
      break;
    case 'AUTH_IGNORE_EXPIRED_TOKEN':
      return Object.assign( {}, state, { expiredToken: false } );
    case 'AUTH_GOT_TOKEN':
      return Object.assign( {}, state, { token: action.token, expiredToken: false } );
    case 'AUTH_GOT_USER':
      return Object.assign( {}, state, { user: action.user } );
    case 'AUTH_LOG_OUT':
      return initialState;
  }
  return state;
}
