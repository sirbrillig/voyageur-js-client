import React from 'react';
import { connect } from 'react-redux';
import Distance from 'components/distance';
import TripList from 'components/trip-list';
import { searchLocationsAndAddressFor } from 'lib/actions/library';
import { clearTrip } from 'lib/actions/trip';

// TODO: move to its own file
const Question = function( props ) {
  const getQuestionText = function( trip ) {
    if ( trip.length < 1 ) {
      return 'Enter a location';
    }
    if ( trip.length === 1 ) {
      return 'Enter another location and I\'ll tell you the distance of the trip';
    }
    return 'Enter another location';
  };
  return <div className="question">{ getQuestionText( props.trip ) }</div>;
};

// TODO: move it its own file
class Search extends React.Component {
  constructor( props ) {
    super( props );
    this.attachAutocomplete = this.attachAutocomplete.bind( this );
    this.handleInputChange = this.handleInputChange.bind( this );
  }

  attachAutocomplete( input ) {
    if ( ! input || ! window || ! window.google || ! window.google.maps ) return;
    this.addressField = input;
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK;
  }

  handleInputChange( event ) {
    const value = event.target.value || '';
    this.props.onChange( value );
  }

  render() {
    return <input type="text" className="form-control" id="inputAddLocationAddress" ref={ this.attachAutocomplete } onChange={ this.handleInputChange } />;
  }
}

const Main = function( props ) {
  return (
    <div className="main">
      { props.trip.length > 1 && <Distance /> }
      { props.trip.length > 1 && <TripList trip={ props.trip } clearTrip={ props.clearTrip } /> }
      <Question trip={ props.trip } />
      <Search onChange={ props.searchLocationsAndAddressFor } />
    </div>
  );
};

function mapStateToProps( state ) {
  return {
    trip: state.trip,
  };
}

export default connect( mapStateToProps, { searchLocationsAndAddressFor, clearTrip } )( Main );
