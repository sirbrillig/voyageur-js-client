import React from 'react';

const TripList = function( { trip, clearTrip } ) {
  const editTrip = () => null; // TODO: add edit trip action
  const locationWord = trip.length === 1 ? 'location' : 'locations';
  return (
    <div className="TripList">
      <button className="btn btn-sm btn-default" onClick={ editTrip }>{ trip.length } { locationWord } in trip</button>
      <button className="btn btn-sm btn-primary" onClick={ clearTrip }>Clear trip</button>
    </div>
  );
};
export default TripList;
