import request from 'superagent';
import { Promise } from 'es6-promise';
import authVars from 'auth0-variables';

const baseUrl = `${authVars.VOYAGEUR_API_SERVER}`;

export function getDistanceBetween( token, start, dest ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/secured/distances`;
    request.post( url )
    .send( { start, dest } )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      if ( err ) return reject( err );
      const data = res.body;
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}
