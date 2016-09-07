import React from 'react';
import { connect } from 'react-redux';
import { importLocations } from '../lib/actions/library';

const ImportPanel = React.createClass( {
  onImport() {
    this.props.importLocations( this.textInput.value );
  },

  render() {
    return (
      <div className="import form-horizontal">
        <div className="form-group">
          <label htmlFor="import__text" className="import__text__label">Location Data (as JSON)</label>
          <textarea className="import__text form-control" id="import__text" rows="10" ref={ input => this.textInput = input } />
        </div>
        <div className="form-group">
          <button className="btn btn-lg btn-primary" onClick={ this.onImport }>Import Locations</button>
        </div>
      </div>
    );
  }
} );

export default connect( null, { importLocations } )( ImportPanel );
