import React from 'react';
import TripLocation from './trip-location';

export default React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array,
    getLocationById: React.PropTypes.func.isRequired,
    getLocationById: React.PropTypes.func.isRequired,
    onRemoveTripLocation: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    areThereLocations: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      tripLocations: [],
      areThereLocations: false,
    };
  },

  renderTripHelp() {
    if ( ! this.props.areThereLocations || this.props.tripLocations.length > 1 ) return;
    if ( this.props.tripLocations.length === 1 ) return <div className="alert alert-info"><span className="glyphicon glyphicon-hand-left" /> Add another location from your library!</div>;
    return <div className="alert alert-info"><span className="glyphicon glyphicon-hand-left" /> Click "Add" next to a location in your list to add it to this trip!</div>;
  },

  renderTripLocations() {
    if ( this.props.tripLocations.length > 0 ) return <ul>{ this.props.tripLocations.map( this.renderTripLocation ) }</ul>;
  },

  renderTripLocation( tripLocation ) {
    if ( ! tripLocation.location.name ) {
      const location = this.props.getLocationById( tripLocation.location );
      if ( ! location ) return; // Don't render tripLocations without a corresponding location
      tripLocation.location = location;
    }
    return <TripLocation key={ tripLocation._id } tripLocation={ tripLocation } onRemoveTripLocation={ this.props.onRemoveTripLocation } onDrop={ this.props.onDrop } />;
  },

  render() {
    return (
      <div className="trip">
        { this.renderTripLocations() }
        { this.renderTripHelp() }
      </div>
    );
  }
} );

