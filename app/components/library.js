import React from 'react';
import LibraryLocation from 'components/library-location';

const Library = React.createClass( {
  propTypes: {
    locations: React.PropTypes.array,
    visibleLocations: React.PropTypes.array,
    predictions: React.PropTypes.array,
    onAddToTrip: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    onEditLocation: React.PropTypes.func.isRequired,
    selectedLocation: React.PropTypes.number,
    lastTripLocationId: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      locations: [],
      visibleLocations: [],
      predictions: [],
      selectedLocation: 0,
      lastTripLocationId: null,
    };
  },

  renderLocations() {
    if ( this.props.locations.length < 1 ) return;
    if ( ! this.props.visibleLocations.length && ! this.props.predictions.length ) {
      return <div className="alert alert-info">No matches for that search.</div>;
    }
    const allLocations = this.props.visibleLocations.concat( this.props.predictions );
    return <ul>{ allLocations.map( this.renderLocation ) }</ul>;
  },

  renderLocation( location, index ) {
    return (
      <LibraryLocation
        key={ location._id || location.id }
        location={ location }
        onEditLocation={ this.props.onEditLocation }
        onAddLocation={ this.props.onAddLocation }
        onAddToTrip={ this.props.onAddToTrip }
        onDrop={ this.props.onDrop }
        isSelected={ this.props.selectedLocation === index }
        isDisabled={ this.props.lastTripLocationId === location._id }
      />
    );
  },

  render() {
    return (
      <div className="library">
        { this.renderLocations() }
      </div>
    );
  }
} );

export default Library;
