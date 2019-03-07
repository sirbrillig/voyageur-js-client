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
    // const lock = new Auth0Lock( authVars.AUTH0_CLIENT_ID, authVars.AUTH0_DOMAIN );
    // lock.getProfile( getState().auth.token, ( err, profile ) => {
    //   if ( err ) return dispatch( gotError( err ) );
    //   dispatch( gotProfile( profile ) );
    // } );
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
