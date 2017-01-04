import React from 'react';

export default class MainSearch extends React.Component {
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
