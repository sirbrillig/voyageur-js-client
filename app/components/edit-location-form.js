import React from 'react';
import WideButton from 'components/wide-button';

class EditLocationForm extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      name: props.location.name,
    };
  }

  onChangeName = ( event ) => {
    this.setState( { name: event.target.value } );
  }

  onSaveLocation = () => {
    const { name } = this.state;
    const address = this.addressField.value;
    this.props.onSaveLocation( this.props.location, { name, address } );
  }

  focusInput = ( input ) => {
    if ( input ) input.focus();
  }

  attachAutocomplete = ( input ) => {
    if ( ! input || ! window ) return;
    this.addressField = input;
    this.autocomplete = new window.google.maps.places.Autocomplete( input );
  }

  render() {
    const onDeleteLocation = () => this.props.onDeleteLocation( this.props.location );
    return (
      <div className="edit-location-form form-horizontal well" >
        <div className="form-group">
          <label htmlFor="inputEditLocationName" className="col-sm-2 control-label">Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputEditLocationName" placeholder="Location Name" ref={ this.focusInput } onChange={ this.onChangeName } value={ this.state.name } />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputEditLocationAddress" className="col-sm-2 control-label">Address</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputEditLocationAddress" placeholder="Address" ref={ this.attachAutocomplete } defaultValue={ this.props.location.address } />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <WideButton text="Cancel" onClick={ this.props.onCancelEditLocation } />
            <WideButton text="Save" className="btn-primary" onClick={ this.onSaveLocation } />
            <WideButton text="Delete" className="btn-danger" onClick={ onDeleteLocation } />
          </div>
        </div>
      </div>
    );
  }
}

EditLocationForm.propTypes = {
  location: React.PropTypes.object.isRequired,
  onSaveLocation: React.PropTypes.func.isRequired,
  onCancelEditLocation: React.PropTypes.func.isRequired,
  onDeleteLocation: React.PropTypes.func.isRequired,
};

export default EditLocationForm;
