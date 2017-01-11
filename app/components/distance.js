import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAddressesForTrip } from 'lib/selectors';
import { getAddressPairs, getKeyForAddresses } from 'lib/helpers';
import { fetchDistanceBetween, changeUnits } from 'lib/actions/trip';

const Distance = React.createClass( {
  propTypes: {
    addresses: React.PropTypes.array.isRequired,
    cachedDistances: React.PropTypes.object,
    fetchDistanceBetween: React.PropTypes.func.isRequired,
    useMiles: React.PropTypes.bool,
    changeUnits: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      useMiles: true,
      cachedDistances: {},
    };
  },

  render() {
    return <div className="distance">{ this.getDistanceText() } { this.renderButtons() }</div>;
  },

  shouldComponentUpdate( nextProps ) {
    // If the cache has not changed, and we re-render, we will repeat fetching data
    return ( nextProps !== this.props );
  },

  getDistanceText() {
    const meters = this.getDistanceFor( this.props.addresses, this.props.cachedDistances );
    if ( meters === null ) return 'Loading...';
    if ( this.props.useMiles ) return 'Your trip is ' + ( meters * 0.000621371192 ).toFixed( 1 ) + ' miles';
    return 'Your trip is ' + ( meters / 1000 ).toFixed( 1 ) + ' km';
  },

  renderButtons() {
    const milesClassNames = classNames( 'btn btn-primary', { active: this.props.useMiles } );
    const kmClassNames = classNames( 'btn btn-primary', { active: ! this.props.useMiles } );
    const clickMiles = () => this.props.changeUnits( 'miles' );
    const clickKm = () => this.props.changeUnits( 'km' );
    return (
      <span className="distance__buttons btn-group btn-group-xs" data-toggle="buttons">
        <label className={ milesClassNames }>
          <input type="radio" name="scale" id="scale-miles" checked={ this.props.useMiles } onChange={ clickMiles } />Miles
        </label>
        <label className={ kmClassNames }>
          <input type="radio" name="scale" id="scale-km" checked={ ! this.props.useMiles } onChange={ clickKm } />Km
        </label>
      </span>
    );
  },

  getDistanceFor( addresses, cachedDistances ) {
    if ( ! addresses.length ) return 0;
    const getCachedDistanceForPair = ( pair ) => cachedDistances[ getKeyForAddresses( pair.start, pair.dest ) ];
    // split the trip into pairs
    const addrPairs = getAddressPairs( addresses );
    // find cached pairs
    const cached = addrPairs.filter( getCachedDistanceForPair );
    // find uncached pairs
    const uncached = addrPairs.filter( pair => ! getCachedDistanceForPair( pair ) );
    // find expired pairs
    const maxDistanceAge = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const expired = cached.filter( pair => ( now - getCachedDistanceForPair( pair ).lastUpdatedAt || 0 ) > maxDistanceAge );
    // if there are any expired or uncached pairs, fetch distance for each one and return null
    if ( uncached.length || expired.length ) {
      uncached.concat( expired ).map( pair => this.props.fetchDistanceBetween( pair.start, pair.dest ) );
      return null;
    }
    // return sum of all cached distances
    return cached.reduce( ( prev, pair ) => prev + getCachedDistanceForPair( pair ).distance, 0 );
  },
} );

function mapStateToProps( state ) {
  return {
    addresses: getAddressesForTrip( state ),
    cachedDistances: state.distances,
    useMiles: state.prefs.useMiles,
  };
}

export default connect( mapStateToProps, { fetchDistanceBetween, changeUnits } )( Distance );
