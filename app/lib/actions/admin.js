import { gotError } from './general';
import * as api from '../api/admin';

export function fetchEvents() {
  return function( dispatch, getState ) {
    api.fetchEvents( getState().auth.token )
    .then( events => dispatch( gotEvents( events ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function gotEvents( events ) {
  return { type: 'ADMIN_GOT_EVENTS', events };
}
