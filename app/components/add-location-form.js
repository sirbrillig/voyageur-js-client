import React from 'react';
import WideButton from 'components/wide-button';

export default React.createClass( {
  propTypes: {
    onAddLocation: React.PropTypes.func.isRequired,
    onCancelAddLocation: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      name: '',
    };
  },

  onChangeName( event ) {
    this.setState( { name: event.target.value } );
  },

  onAddLocation() {
    const { name } = this.state;
    const address = this.addressField.value;
    this.props.onAddLocation( { name, address } );
  },

  focusInput( input ) {
    if ( ! input ) return;
    input.focus();
  },

  attachAutocomplete( input ) {
    if ( ! input || ! window ) return;
    this.addressField = input;
    this.autocomplete = new window.google.maps.places.Autocomplete( input );
  },

  render() {
    return (
      <div className="add-location-form form-horizontal well" >
        <div className="form-group">
          <label htmlFor="inputAddLocationName" className="col-sm-2 control-label">Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputAddLocationName" placeholder="Location Name" ref={ this.focusInput } onChange={ this.onChangeName } value={ this.state.name } />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputAddLocationAddress" className="col-sm-2 control-label">Address</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputAddLocationAddress" placeholder="Address" ref={ this.attachAutocomplete } />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <WideButton text="Cancel" onClick={ this.props.onCancelAddLocation } />
            <WideButton text="Add" className="btn-primary" onClick={ this.onAddLocation } />
          </div>
        </div>
      </div>
    );
  }
} );

