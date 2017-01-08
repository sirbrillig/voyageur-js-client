import React from 'react';

const TripSummary = function( { trip, clearTrip, showTrip, hideTrip, isShowingTrip } ) {
  const locationWord = trip.length === 1 ? 'location' : 'locations';
  const toggleTrip = () => isShowingTrip ? hideTrip() : showTrip();
  return (
    <div className="TripSummary">
      <span>{ trip.length } { locationWord } in trip</span>
      <button className="btn btn-sm btn-default TripSummary__toggle" onClick={ toggleTrip }>{ isShowingTrip ? 'Hide' : 'Show' } trip</button>
      <button className="btn btn-sm btn-primary" onClick={ clearTrip }>Clear trip</button>
    </div>
  );
};
export default TripSummary;
