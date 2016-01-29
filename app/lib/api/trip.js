import request from 'superagent';
import { Promise } from 'es6-promise';
import authVars from '../../auth0-variables';

const baseUrl = `http://${authVars.VOYAGEUR_API_SERVER}`;

export function listTripLocations( token ) {
  return new Promise( ( resolve, reject ) => {
    const listLocationsUrl = `${baseUrl}/secured/trip-locations`;
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

export function createNewTripLocation( token, params ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/trip-locations`;
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

export function deleteTripLocation( token, tripLocationId ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/trip-locations/${tripLocationId}`;
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

export function getTripDistance( token ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/distance`;
    request.get( url )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}

export function removeAllTripLocations( token ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/trip-locations`;
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

export function reorderTrip( token, ids ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/trip-locations`;
    request.put( url )
    .send( { tripLocationIds: ids } )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}
