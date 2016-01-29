import React from 'react';
import WideButton from './wide-button';

export default React.createClass( {
  propTypes: {
    onAddLocation: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      name: '',
      address: '',
    };
  },

  onChangeName( event ) {
    this.setState( { name: event.target.value } );
  },

  onChangeAddress( event ) {
    this.setState( { address: event.target.value } );
  },

  onAddLocation() {
    const { name, address } = this.state;
    this.props.onAddLocation( { name, address } );
  },

  focusInput( input ) {
    if ( input ) input.focus();
  },

  render() {
    return (
      <div className="add-location-form form-horizontal" >
        <div className="form-group">
          <label htmlFor="inputAddLocationName" className="col-sm-2 control-label">Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputAddLocationName" placeholder="Location Name" ref={ this.focusInput } onChange={ this.onChangeName } value={ this.state.name } />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputAddLocationAddress" className="col-sm-2 control-label">Address</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputAddLocationAddress" placeholder="Address" onChange={ this.onChangeAddress } value={ this.state.address } />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <WideButton text="Add" className="btn-primary" onClick={ this.onAddLocation } />
          </div>
        </div>
      </div>
    );
  }
} );

