import { browserHistory } from 'react-router';
import { gotError } from 'lib/actions/general';
import debugFactory from 'debug';
import Auth from 'lib/auth';

const debug = debugFactory( 'voyageur:actions' );

function removeTokenFromUrl() {
  if ( ! window ) return;
  const newUrl = window.location.pathname;
  debug( 'replacing history location with', newUrl );
  browserHistory.replace( newUrl );
}

export function doAuthWithPassword() {
  return function() {
    const auth = new Auth();
    auth.login();
  };
}

export function parseAuthToken() {
  return function( dispatch ) {
    const auth = new Auth();
    auth.handleAuthentication()
      .then( authResult => {
        debug( 'parsed auth token from URL' );
        dispatch( gotAuthToken( authResult.idToken ) );
        removeTokenFromUrl();
      } )
      .catch( err => dispatch( gotError( err ) ) );
  };
}

export function gotAuthToken( token ) {
  return { type: 'AUTH_GOT_TOKEN', token };
}

export function getProfile() {
  return function( dispatch, getState ) {
    const auth = new Auth();
    const token = getState().auth.token;
    debug( 'fetching profile from service' );
    auth.getProfile( token )
      .then( profile => {
        debug( 'got profile from service' );
        dispatch( gotProfile( profile ) );
      } )
      .catch( err => dispatch( gotError( err ) ) );
  };
}

export function gotProfile( allUserData ) {
  const { name, role } = allUserData;
  return { type: 'AUTH_GOT_USER', user: { name, role } };
}

export function logOut() {
  return { type: 'AUTH_LOG_OUT' };
}

export function ignoreExpiredToken() {
  return { type: 'AUTH_IGNORE_EXPIRED_TOKEN' };
}
