import React from 'react';
import { connect } from 'react-redux';
import { importLocations } from 'lib/actions/library';

const ImportPanel = ( props ) => {
  const onImport = () => props.importLocations( this.textInput.value );
  const saveRef = input => this.textInput = input;
  return (
    <div className="import form-horizontal">
      <div className="form-group">
        <label htmlFor="import__text" className="import__text__label">Location Data (as JSON)</label>
        <textarea className="import__text form-control" id="import__text" rows="10" ref={ saveRef } />
      </div>
      <div className="form-group">
        <button className="btn btn-lg btn-primary" onClick={ onImport }>Import Locations</button>
      </div>
    </div>
  );
};

export default connect( null, { importLocations } )( ImportPanel );
