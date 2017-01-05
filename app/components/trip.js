import React from 'react';
import { DropTarget } from 'react-dnd';
import TripMap from 'components/trip-map';
import TripLocation from 'components/trip-location';
import classNames from 'classnames';

const Trip = React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array,
    onRemoveTripLocation: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    library: React.PropTypes.array,
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      tripLocations: [],
      library: [],
      isOver: false,
    };
  },

  getLocationById( id ) {
    return this.props.library.reduce( ( found, location ) => {
      // TODO: this needs to work with id-less locations
      if ( location._id === id ) return location;
      return found;
    }, null );
  },

  renderTripLocations() {
    if ( this.props.tripLocations.length > 0 ) return <ul>{ this.props.tripLocations.map( this.renderTripLocation ) }</ul>;
  },

  renderTripLocation( tripLocation, index ) {
    const location = this.getLocationById( tripLocation.id );
    // TODO: allow tripLocations with only an address
    if ( ! location ) return; // Don't render tripLocations without a corresponding location
    return <TripLocation key={ 'tripLocation-' + tripLocation.id + '-' + index } index={ index } tripLocation={ location } onRemoveTripLocation={ this.props.onRemoveTripLocation } onDrop={ this.props.onDrop } />;
  },

  renderMap() {
    if ( this.props.tripLocations.length < 2 ) return;
    return <TripMap tripLocations={ this.props.tripLocations } getLocationById={ this.getLocationById } />;
  },

  render() {
    const tripClassNames = classNames( 'trip', { 'trip--droppable': this.props.isOver } );
    return this.props.connectDropTarget(
      <div className={ tripClassNames }>
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
