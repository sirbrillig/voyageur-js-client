import request from 'superagent';
import { Promise } from 'es6-promise';
import authVars from '../../auth0-variables';

const baseUrl = `http://${authVars.VOYAGEUR_API_SERVER}`;

export function fetchEvents( token ) {
  return new Promise( ( resolve, reject ) => {
    const url = `${baseUrl}/admin/events`;
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
