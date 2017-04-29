import { browserHistory } from 'react-router';
import { gotError } from 'lib/actions/general';
import authVars from 'auth0-variables';
import debugFactory from 'debug';

const debug = debugFactory( 'voyageur:actions' );

const Auth0Lock = window.Auth0Lock;

function removeTokenFromUrl() {
  if ( ! window ) return;
  const newUrl = window.location.pathname;
  debug( 'replacing history location with', newUrl );
  browserHistory.replace( newUrl );
}

export function doAuthWithPassword() {
  return function() {
    const lock = new Auth0Lock( authVars.AUTH0_CLIENT_ID, authVars.AUTH0_DOMAIN );
    lock.show( {
      icon: 'https://cldup.com/iu86nhnHUS.png',
      authParams: { scope: 'openid role name email nickname' },
      socialButtonStyle: 'big',
      connections: [ 'facebook' ],
    } );
  };
}

export function parseAuthToken() {
  return function( dispatch ) {
    const lock = new Auth0Lock( authVars.AUTH0_CLIENT_ID, authVars.AUTH0_DOMAIN );
    lock.on( 'authenticated', function( authResult ) {
      debug( 'parsed auth token from URL' );
      dispatch( gotAuthToken( authResult.idToken ) );
      removeTokenFromUrl();
    } );
  };
}

export function gotAuthToken( token ) {
  return { type: 'AUTH_GOT_TOKEN', token };
}

export function getProfile() {
  return function( dispatch, getState ) {
    const lock = new Auth0Lock( authVars.AUTH0_CLIENT_ID, authVars.AUTH0_DOMAIN );
    lock.getProfile( getState().auth.token, ( err, profile ) => {
      if ( err ) return dispatch( gotError( err ) );
      dispatch( gotProfile( profile ) );
    } );
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
