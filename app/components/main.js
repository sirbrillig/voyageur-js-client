import React from 'react';
import { connect } from 'react-redux';
import Distance from 'components/distance';
import { searchLocationsAndAddressFor } from 'lib/actions/library';

function getQuestionText( trip ) {
  if ( trip.length < 1 ) {
    return 'Enter a location';
  }
  if ( trip.length === 1 ) {
    return 'Enter another location and I\'ll tell you the distance of the trip';
  }
  return 'Enter another location and I\'ll tell you the distance of the trip';
}

const Question = function( { trip } ) {
  const text = getQuestionText( trip );
  return <div className="question">{ text }</div>;
};

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
    return (
      <div className="form-group">
        <label htmlFor="inputAddLocationAddress" className="col-sm-2 control-label">Address</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" id="inputAddLocationAddress" ref={ this.attachAutocomplete } onChange={ this.handleInputChange } />
        </div>
      </div>
    );
  }
}

const Main = function( props ) {
  return (
    <div className="main">
      { props.trip.length > 1 && <Distance /> }
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

export default connect( mapStateToProps, { searchLocationsAndAddressFor } )( Main );
