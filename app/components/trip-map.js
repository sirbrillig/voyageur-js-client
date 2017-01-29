import React from 'react';
import isEqual from 'lodash.isEqual';
import debugFactory from 'debug';
import { GoogleMapLoader, GoogleMap, DirectionsRenderer } from 'react-google-maps';

const debug = debugFactory( 'voyageur:trip-map' );

function getGoogleMaps() {
  if ( window && window.google && window.google.maps ) return window.google.maps;
  return {};
}

function LatLng( x, y ) {
  const gmaps = getGoogleMaps();
  if ( ! gmaps ) return null;
  return new gmaps.LatLng( x, y );
}

function generateRequestForAddresses( addresses ) {
  const gmaps = getGoogleMaps();
  if ( ! gmaps ) return;
  if ( addresses.length < 2 ) {
    console.warn( 'Not enough addresses to render trip map' );
    return null;
  }
  const origin = addresses.shift();
  const destination = addresses.pop();
  const waypoints = addresses.map( location => ( { location, stopover: true } ) );
  if ( waypoints.length > 8 ) {
    console.warn( 'Too many waypoints to render trip map' );
    return null;
  }
  return { origin, destination, waypoints, travelMode: gmaps.TravelMode.DRIVING };
}

function requestDirections( request ) {
  return new Promise( ( resolve, reject ) => {
    const gmaps = getGoogleMaps();
    if ( ! gmaps ) return reject( 'No google maps available' );
    debug( 'requesting updated directions...', JSON.stringify( request ) );
    const directionsService = new gmaps.DirectionsService();
    directionsService.route( request, ( directions, status ) => {
      if ( status === gmaps.DirectionsStatus.OK ) {
        resolve( directions );
      } else {
        reject( 'Error loading directions for map: ' + status );
      }
    } );
  } );
}

class TripMapCalculator extends React.PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      origin: LatLng( 41.8507300, -87.6512600 ),
      destination: LatLng( 41.8525800, -87.6514100 ),
      directions: null,
    };
    this.lastRequest = null;
  }

  render() {
    this.calculateRoute( this.props.addresses );
    debug( 'rendering map from TripMapCalculator' );
    const mapUrl = 'https://www.google.com/maps/dir/' + this.props.addresses.reduce( ( previous, address ) => {
      return previous + encodeURIComponent( address ) + '/';
    }, '' );
    return <TripMap directions={ this.state.directions } origin={ this.state.origin } mapUrl={ mapUrl } />;
  }

  calculateRoute = ( addresses ) => {
    const request = generateRequestForAddresses( addresses );
    if ( ! request || isEqual( request, this.lastRequest ) ) return;
    this.lastRequest = request;
    requestDirections( request )
      .then( directions => this.setState( { directions } ) )
      .catch( console.error );
  }

}

TripMapCalculator.propTypes = {
  addresses: React.PropTypes.array.isRequired,
};

class TripMap extends React.PureComponent {
  render() {
    if ( ! this.props.directions ) return <div className="trip-map" />;
    debug( 'rendering map in TripMap' );
    return (
      <GoogleMapLoader
        containerElement={ <div className="trip-map" /> }
        googleMapElement={ this.renderGoogleMap( this.props.origin, this.props.directions ) }
      />
    );
  }

  renderGoogleMap = ( origin, directions ) => {
    return (
    <GoogleMap
      defaultZoom={ 11 }
      defaultCenter={ origin }
      overviewMapControl={ false }
      scaleControl={ false }
      streetViewControl={ false }
      zoomControl={ false }
      mapTypeControl={ false }
      onClick={ this.handleMapClick }
    >{ directions ? <DirectionsRenderer directions={ directions } /> : null }</GoogleMap> );
  }

  handleMapClick = () => {
    if ( window ) window.location = this.props.mapUrl;
  }
}

TripMap.propTypes = {
  origin: React.PropTypes.object,
  directions: React.PropTypes.object,
  mapUrl: React.PropTypes.string,
};

export default TripMapCalculator;
