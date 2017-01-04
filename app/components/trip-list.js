import React from 'react';

const TripList = function( { trip, clearTrip } ) {
  const editTrip = () => null; // TODO: add edit trip action
  return (
    <div className="TripList">
      { `${ trip.length } locations in trip` }
      <button className="btn btn-xs btn-default" onClick={ editTrip }>Edit trip</button>
      <button className="btn btn-xs btn-primary" onClick={ clearTrip }>Clear trip</button>
    </div>
  );
};
export default TripList;
