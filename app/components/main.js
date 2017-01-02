import React from 'react';

const Question = function() {
  const text = 'Enter a location';
  return <div className="question">{ text }</div>;
};

class Search extends React.Component {
  constructor( props ) {
    super( props );
    this.attachAutocomplete = this.attachAutocomplete.bind( this );
    this.handleInputChange = this.handleInputChange.bind( this );
    this.autocompleteCallback = this.autocompleteCallback.bind( this );
  }

  attachAutocomplete( input ) {
    if ( ! input || ! window || ! window.google || ! window.google.maps ) return;
    this.addressField = input;
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK;
  }

  handleInputChange( event ) {
    const options = {};
    this.autocompleteService.getPlacePredictions( { options, input: event.target.value }, this.autocompleteCallback );
  }

  autocompleteCallback( predictions, status ) {
    if ( status !== this.autocompleteOK ) {
      console.error( 'Autocomplete failed' ); // eslint-disable-line no-console
      return;
    }
    console.log( 'results', predictions ); // eslint-disable-line no-console
    // TODO: get search results for library
    // TODO: display list of library results and predictions
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

export default function Main() {
  return (
    <div className="main">
      <Question />
      <Search />
    </div>
  );
}
