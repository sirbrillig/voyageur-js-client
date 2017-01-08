import React from 'react';
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

export default React.createClass( {
  propTypes: {
    addresses: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    return {
      origin: LatLng( 41.8507300, -87.6512600 ),
      destination: LatLng( 41.8525800, -87.6514100 ),
      directions: null,
    };
  },

  componentDidMount() {
    this.calculateRoute( this.props.addresses );
  },

  componentWillReceiveProps( nextProps ) {
    if ( this.hasMapDataChanged( nextProps.addresses ) ) this.calculateRoute( nextProps.addresses );
  },

  hasMapDataChanged( addresses ) {
    const next = JSON.stringify( addresses );
    const prev = JSON.stringify( this.props.addresses );
    return ( next !== prev );
  },

  shouldComponentUpdate( nextProps, nextState ) {
    if ( nextState !== this.state ) return true;
    const hasChanged = this.hasMapDataChanged( nextProps.addresses );
    if ( ! hasChanged ) return false;
    debug( 'map locations have changed' );
    return true;
  },

  calculateRoute( addresses ) {
    const gmaps = getGoogleMaps();
    if ( ! gmaps ) return;
    if ( addresses.length < 2 ) return console.warn( 'Not enough addresses to render trip map' );
    const origin = addresses.shift();
    const destination = addresses.pop();
    const waypoints = addresses.map( location => ( { location, stopover: true } ) );
    if ( waypoints.length > 8 ) return console.warn( 'Too many waypoints to render trip map' );
    const request = { origin, destination, waypoints, travelMode: gmaps.TravelMode.DRIVING };
    this.requestDirections( request );
  },

  requestDirections( request ) {
    const gmaps = getGoogleMaps();
    if ( ! gmaps ) return;
    debug( 'requesting updated directions...', JSON.stringify( request ) );
    this.setState( { directions: null } );
    const directionsService = new gmaps.DirectionsService();
    directionsService.route( request, this.updateDirectionsOnMap );
  },

  updateDirectionsOnMap( result, status ) {
    const gmaps = getGoogleMaps();
    if ( ! gmaps ) return;
    if ( status === gmaps.DirectionsStatus.OK ) {
      this.setState( { directions: result } );
    } else {
      console.error( 'Error loading directions for map. Addresses:', this.props.addresses, status, result );
    }
  },

  handleMapClick() {
    const mapUrl = 'https://www.google.com/maps/dir/' + this.props.addresses.reduce( ( previous, address ) => {
      return previous + encodeURIComponent( address ) + '/';
    }, '' );
    if ( window ) window.location = mapUrl;
  },

  renderDirections() {
    if ( ! this.state.directions ) return;
    return <DirectionsRenderer directions={ this.state.directions } />;
  },

  renderGoogleMap() {
    const addRef = map => this.googleMap = map;
    return (
    <GoogleMap
      ref={ addRef }
      defaultZoom={ 11 }
      defaultCenter={ this.state.origin }
      overviewMapControl={ false }
      scaleControl={ false }
      streetViewControl={ false }
      zoomControl={ false }
      mapTypeControl={ false }
      onClick={ this.handleMapClick }
    >
    { this.renderDirections() }
    </GoogleMap>
    );
  },

  render() {
    if ( ! this.state.directions ) return <div className="trip-map" />;
    debug( 'rendering map' );
    return (
      <GoogleMapLoader
        containerElement={ <div className="trip-map" /> }
        googleMapElement={ this.renderGoogleMap() }
      />
    );
  }
} );
