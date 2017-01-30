import React from 'react';
import LibraryLocation from 'components/library-location';
import { getVisibleLocations } from 'lib/helpers';

class Library extends React.Component {
  renderLocations = () => {
    if ( this.props.locations.length < 1 ) return;
    const visibleLocations = getVisibleLocations( this.props.locations, this.props.searchString );
    if ( ! visibleLocations.length && ! this.props.predictions.length ) {
      return <div className="alert alert-info">No matches for that search.</div>;
    }
    const allLocations = visibleLocations.concat( this.props.predictions );
    return <ul>{ allLocations.map( this.renderLocation ) }</ul>;
  }

  renderLocation = ( location, index ) => {
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
  }

  render() {
    return (
      <div className="library">
        { this.renderLocations() }
      </div>
    );
  }
}

Library.propTypes = {
  locations: React.PropTypes.array,
  predictions: React.PropTypes.array,
  searchString: React.PropTypes.string,
  onAddToTrip: React.PropTypes.func.isRequired,
  onDrop: React.PropTypes.func.isRequired,
  onEditLocation: React.PropTypes.func.isRequired,
  selectedLocation: React.PropTypes.number,
  lastTripLocationId: React.PropTypes.string,
};

Library.defaultProps = {
  locations: [],
  searchString: '',
  predictions: [],
  selectedLocation: 0,
  lastTripLocationId: null,
};

export default Library;
