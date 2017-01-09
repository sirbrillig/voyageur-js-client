import React from 'react';

const TripButtons = function( { trip, hideTrip, showTrip, clearTrip, isShowingTrip } ) {
  if ( trip.length < 1 ) return null;
  const toggleTrip = () => isShowingTrip ? hideTrip() : showTrip();
  return (
    <span className="trip-buttons">
      <button className="btn btn-sm btn-default trip-buttons__toggle" onClick={ toggleTrip }>{ isShowingTrip ? 'Hide' : 'Show' } trip</button>
      <button className="btn btn-sm btn-primary" onClick={ clearTrip }>Clear trip</button>
    </span>
  );
};

const TripSummary = function( { trip, clearTrip, showTrip, hideTrip, isShowingTrip } ) {
  const locationWord = trip.length === 1 ? 'location' : 'locations';
  return (
    <div className="trip-summary">
      <span>{ trip.length } { locationWord } in trip</span>
      <TripButtons trip={ trip } clearTrip={ clearTrip } showTrip={ showTrip } hideTrip={ hideTrip } isShowingTrip={ isShowingTrip } />
    </div>
  );
};
export default TripSummary;
