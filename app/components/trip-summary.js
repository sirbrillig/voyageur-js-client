import React from 'react';

const TripSummary = function( { trip, clearTrip, showTrip, hideTrip, isShowingTrip } ) {
  const locationWord = trip.length === 1 ? 'location' : 'locations';
  const toggleTrip = () => isShowingTrip ? hideTrip() : showTrip();
  // TODO: make show/hide button more explicit
  // TODO: hide toggle button at wide widths
  return (
    <div className="TripSummary">
      <button className="btn btn-sm btn-default" onClick={ toggleTrip }>{ trip.length } { locationWord } in trip</button>
      <button className="btn btn-sm btn-primary" onClick={ clearTrip }>Clear trip</button>
    </div>
  );
};
export default TripSummary;
