import auth0 from 'auth0-js';
import authVars from 'auth0-variables';

// From: https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0
export default class Auth {
  auth0 = new auth0.WebAuth( {
    domain: authVars.AUTH0_DOMAIN,
    clientID: authVars.AUTH0_CLIENT_ID,
    redirectUri: 'http://localhost:3000/',
    responseType: 'token id_token',
    scope: 'openid role name email nickname',
    icon: 'https://cldup.com/iu86nhnHUS.png',
    socialButtonStyle: 'big',
    connections: [ 'facebook' ],
  } );

  login() {
    this.auth0.authorize();
  }

  constructor() {
    this.login = this.login.bind( this );
    this.logout = this.logout.bind( this );
    this.handleAuthentication = this.handleAuthentication.bind( this );
    this.isAuthenticated = this.isAuthenticated.bind( this );
    this.getAccessToken = this.getAccessToken.bind( this );
    this.getIdToken = this.getIdToken.bind( this );
    this.renewSession = this.renewSession.bind( this );
  }

  handleAuthentication() {
    return new Promise( ( resolve, reject ) => {
      this.auth0.parseHash( ( err, authResult ) => {
        if ( authResult && authResult.accessToken && authResult.idToken ) {
          console.log( 'login successful' );
          this.setSession( authResult );
          resolve( authResult );
        } else if ( err ) {
          console.log( err );
          reject( err );
        }
      } );
    } );
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession( authResult ) {
    // Set the time that the access token will expire at
    const expiresAt = ( authResult.expiresIn * 1000 ) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
  }

  renewSession() {
    this.auth0.checkSession( {}, ( err, authResult ) => {
      if ( authResult && authResult.accessToken && authResult.idToken ) {
        this.setSession( authResult );
      } else if ( err ) {
        this.logout();
        console.log( err );
        alert( `Could not get a new token (${ err.error }: ${ err.error_description }).` );
      }
    } );
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}
