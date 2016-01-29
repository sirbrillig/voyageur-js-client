import request from 'superagent';
import { Promise } from 'es6-promise';
import authVars from '../../auth0-variables';

const baseUrl = `http://${authVars.VOYAGEUR_API_SERVER}`;

export function listLocations( token ) {
  return new Promise( ( resolve, reject ) => {
    const listLocationsUrl = `${baseUrl}/secured/locations`;
    request.get( listLocationsUrl )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}

export function createNewLocation( token, params ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/locations`;
    request.post( url )
    .send( params )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}

export function deleteLocationFromLibrary( token, location ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/locations/${location._id || location}`;
    request.delete( url )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}

export function updateLocationParams( token, location, params ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/locations/${location._id || location}`;
    request.put( url )
    .send( params )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}

export function reorderLibrary( token, ids ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/locations`;
    request.put( url )
    .send( { locations: ids } )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}
