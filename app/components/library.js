import React from 'react';
import LibraryLocation from './library-location';

const Library = React.createClass( {
  propTypes: {
    locations: React.PropTypes.array,
    visibleLocations: React.PropTypes.array,
    onAddToTrip: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    onEditLocation: React.PropTypes.func.isRequired,
    selectedLocation: React.PropTypes.number,
    lastTripLocationId: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      locations: [],
      visibleLocations: [],
      selectedLocation: 0,
      lastTripLocationId: null,
    };
  },

  renderHelpBox() {
    if ( this.props.locations.length === 0 ) return <div className="alert alert-info">No locations added yet! Add one with the link above. <span className="glyphicon glyphicon-hand-up" /></div>;
    if ( this.props.locations.length === 1 ) return <div className="alert alert-info">Add another location to start getting distances! <span className="glyphicon glyphicon-hand-up" /></div>;
  },

  renderLocations() {
    if ( this.props.locations.length < 1 ) return;
    if ( this.props.visibleLocations.length > 0 ) return <ul>{ this.props.visibleLocations.map( this.renderLocation ) }</ul>;
    return <div className="alert alert-info">No matches for that search.</div>;
  },

  renderLocation( location, index ) {
    return (
      <LibraryLocation
        key={ location._id }
        location={ location }
        onEditLocation={ this.props.onEditLocation }
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
        { this.renderHelpBox() }
      </div>
    );
  }
} );

export default Library;
