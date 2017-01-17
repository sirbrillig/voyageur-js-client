import React from 'react';
import AnimateOnChange from 'react-animate-on-change';

const TripCount = ( props ) => {
  const toggleTrip = () => props.isShowingTrip ? props.hideTrip() : props.showTrip();
  return <AnimateOnChange baseClassName="" animationClassName="animated rubberBand" animate={ true }><button className="trip-count btn" onClick={ toggleTrip }>{ props.trip.length }</button></AnimateOnChange>;
};

export default TripCount;
