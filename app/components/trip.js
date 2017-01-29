import React from 'react';
import { DropTarget } from 'react-dnd';
import TripMap from 'components/trip-map';
import TripLocation from 'components/trip-location';
import classNames from 'classnames';
import { getAddressForTripLocation, getNameForTripLocation } from 'lib/helpers';

const Trip = React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array,
    onRemoveTripLocation: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    library: React.PropTypes.array,
    connectDropTarget: React.PropTypes.func.isRequired,
    clearTrip: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      tripLocations: [],
      library: [],
      isOver: false,
    };
  },

  renderTripLocations() {
    if ( this.props.tripLocations.length > 0 ) return <ul>{ this.props.tripLocations.map( this.renderTripLocation ) }</ul>;
    return <span className="trip__empty-notice">No locations in trip</span>;
  },

  renderTripLocation( tripLocation, index ) {
    const address = getAddressForTripLocation( tripLocation, this.props.library );
    if ( ! address ) return; // Don't render tripLocations without an address
    return <TripLocation key={ 'tripLocation-' + index } index={ index } address={ address } name={ getNameForTripLocation( tripLocation, this.props.library ) } onRemoveTripLocation={ this.props.onRemoveTripLocation } onDrop={ this.props.onDrop } />;
  },

  renderMap() {
    if ( this.props.tripLocations.length < 2 ) return;
    const addresses = this.props.tripLocations.map( tripLocation => getAddressForTripLocation( tripLocation, this.props.library ) );
    return <TripMap addresses={ addresses } />;
  },

  render() {
    const tripClassNames = classNames( 'trip', { 'trip--droppable': this.props.isOver } );
    return this.props.connectDropTarget(
      <div className={ tripClassNames }>
        <button className="btn btn-sm btn-primary trip__clear-trip" onClick={ this.props.clearTrip }>Clear trip</button>
        { this.renderMap() }
        { this.renderTripLocations() }
      </div>
    );
  }
} );

const dropSpec = {
  drop() {
    return { trip: true };
  }
};

function collectDrop( connect, monitor ) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export default DropTarget( 'LOCATION', dropSpec, collectDrop )( Trip );
