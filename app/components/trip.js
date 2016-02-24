import React from 'react';
import { DropTarget } from 'react-dnd';
import TripMap from './trip-map';
import TripLocation from './trip-location';
import classNames from 'classnames';

const Trip = React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array,
    getLocationById: React.PropTypes.func.isRequired,
    onRemoveTripLocation: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    areThereLocations: React.PropTypes.bool,
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      tripLocations: [],
      areThereLocations: false,
      isOver: false,
    };
  },

  renderTripHelp() {
    if ( ! this.props.areThereLocations || this.props.tripLocations.length > 1 ) return;
    if ( this.props.tripLocations.length === 1 ) return <div className="help-box alert alert-info animated pulse"><span className="glyphicon glyphicon-hand-left" /> Add another location from your library!</div>;
    return <div className="help-box alert alert-info animated bounceIn"><span className="glyphicon glyphicon-hand-left" /> Click "Add" next to a location in your list to add it to this trip!</div>;
  },

  renderTripLocations() {
    if ( this.props.tripLocations.length > 0 ) return <ul>{ this.props.tripLocations.map( this.renderTripLocation ) }</ul>;
  },

  renderTripLocation( tripLocation ) {
    const location = this.props.getLocationById( tripLocation );
    if ( ! location ) return; // Don't render tripLocations without a corresponding location
    return <TripLocation key={ 'tripLocation-' + location._id } tripLocation={ location } onRemoveTripLocation={ this.props.onRemoveTripLocation } onDrop={ this.props.onDrop } />;
  },

  renderMap() {
    if ( this.props.tripLocations.length < 2 ) return;
    return <TripMap tripLocations={ this.props.tripLocations } getLocationById={ this.props.getLocationById } />;
  },

  render() {
    const tripClassNames = classNames( 'trip', { 'trip--droppable': this.props.isOver } );
    return this.props.connectDropTarget(
      <div className={ tripClassNames }>
        { this.renderMap() }
        { this.renderTripLocations() }
        { this.renderTripHelp() }
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
  }
}

export default DropTarget( 'LOCATION', dropSpec, collectDrop )( Trip );
