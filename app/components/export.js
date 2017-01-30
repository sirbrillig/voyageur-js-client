import React from 'react';
import { connect } from 'react-redux';
import { getLocations } from 'lib/selectors';

const ExportPanel = ( props ) => {
  const output = JSON.stringify( props.locations.map( location => {
    return {
      name: location.name,
      address: location.address,
    };
  } ) );
  return (
    <div className="import form-horizontal">
      <div className="form-group">
        <label htmlFor="import__text" className="import__text__label">Location Data (as JSON)</label>
        <textarea className="import__text form-control" id="import__text" rows="10" value={ output } />
      </div>
    </div>
  );
};

function mapStateToProps( state ) {
  return {
    locations: getLocations( state ),
  };
}

export default connect( mapStateToProps )( ExportPanel );

