import { createHistory } from 'history';
import Auth0Lock from 'auth0-lock';
import { gotError } from './general';
import authVars from '../../auth0-variables';
import debugFactory from 'debug';

const debug = debugFactory( 'voyageur:actions' );
const history = createHistory();

function removeTokenFromUrl() {
  if ( ! window ) return;
  const newUrl = window.location.pathname;
  debug( 'replacing history location with', newUrl );
  history.replace( newUrl );
}

export function doAuth() {
  return function() {
    const lock = new Auth0Lock( authVars.AUTH0_CLIENT_ID, authVars.AUTH0_DOMAIN );
    lock.show( { authParams: { scope: 'openid role name email nickname' } } );
  }
}

export function parseAuthToken() {
  return function( dispatch, getState ) {
    const lock = new Auth0Lock( authVars.AUTH0_CLIENT_ID, authVars.AUTH0_DOMAIN );
    const idToken = getState().auth.token;
    const hash = ( window ? window.location.hash : '' );
    const authHash = lock.parseHash( hash );
    if ( ! idToken && authHash ) {
      if ( authHash.id_token ) {
        debug( 'parsed auth token from URL' );
        dispatch( gotAuthToken( authHash.id_token ) );
      }
      if ( authHash.error ) {
        debug( 'error parsing auth token from URL' );
        console.error( 'Error signing in', authHash );
      }
    }
    if ( authHash ) removeTokenFromUrl();
  }
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
  }
}

export function gotProfile( allUserData ) {
  const { name, role } = allUserData;
  return { type: 'AUTH_GOT_USER', user: { name, role } };
}

export function logOut() {
  return { type: 'AUTH_LOG_OUT' };
}
