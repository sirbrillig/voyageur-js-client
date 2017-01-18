import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAddressPairs, sumUnlessNull, getCachedDistanceForPair, getAddressesForTrip } from 'lib/helpers';
import { fetchDistanceBetween, changeUnits } from 'lib/actions/trip';
import DistanceNumber from 'components/distance-number';

class Distance extends React.PureComponent {
  render() {
    const meters = this.getDistanceFor( getAddressesForTrip( this.props.trip, this.props.library ), this.props.cachedDistances );
    return <div className="distance">Distance: <DistanceNumber meters={ meters } useMiles={ this.props.useMiles } /> { this.renderButtons() }</div>;
  }

  renderButtons = () => {
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
  }

  getDistanceFor = ( addresses, cachedDistances ) => {
    if ( ! addresses.length ) return 0;
    const pairsWithDistance = getAddressPairs( addresses )
      .map( pair => ( { ...pair, distance: getCachedDistanceForPair( pair, cachedDistances ) } ) );

    // Fetch uncached or expired distances
    pairsWithDistance
      .filter( pair => ! pair.distance )
      .map( pair => this.props.fetchDistanceBetween( pair.start, pair.dest ) );

    return pairsWithDistance
      .map( pair => pair.distance )
      .reduce( sumUnlessNull, 0 );
  }
}

Distance.propTypes = {
  trip: React.PropTypes.array.isRequired,
  library: React.PropTypes.array.isRequired,
  cachedDistances: React.PropTypes.object,
  fetchDistanceBetween: React.PropTypes.func.isRequired,
  useMiles: React.PropTypes.bool,
  changeUnits: React.PropTypes.func.isRequired,
};

Distance.defaultProps = {
  useMiles: true,
  cachedDistances: {},
};

function mapStateToProps( state ) {
  return {
    trip: state.trip,
    library: state.library.locations,
    cachedDistances: state.distances,
    useMiles: state.prefs.useMiles,
  };
}

export { Distance };
export default connect( mapStateToProps, { fetchDistanceBetween, changeUnits } )( Distance );
