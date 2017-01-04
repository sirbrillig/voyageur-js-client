import React from 'react';

const TripList = function( { trip, clearTrip } ) {
  const editTrip = () => null; // TODO: add edit trip action
  return (
    <div className="TripList">
      <button className="btn btn-sm btn-default" onClick={ editTrip }>{ trip.length } locations in trip</button>
      <button className="btn btn-sm btn-primary" onClick={ clearTrip }>Clear trip</button>
    </div>
  );
};
export default TripList;
