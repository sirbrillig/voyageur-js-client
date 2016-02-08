import { gotError } from './general';
import * as api from '../api/admin';

export function fetchEvents( opts ) {
  return function( dispatch, getState ) {
    api.fetchEvents( getState().auth.token, opts )
    .then( events => dispatch( gotEvents( events ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function gotEvents( events ) {
  return { type: 'ADMIN_GOT_EVENTS', events };
}
