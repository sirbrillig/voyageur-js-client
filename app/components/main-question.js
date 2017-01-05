import React from 'react';

const MainQuestion = function( props ) {
  const getQuestionText = function( trip ) {
    if ( trip.length < 1 ) {
      return 'Search for a location';
    }
    if ( trip.length === 1 ) {
      return 'Search for another location and I\'ll tell you the distance of the trip';
    }
    return 'Search for another location';
  };
  return <div className="question">{ getQuestionText( props.trip ) }</div>;
};

export default MainQuestion;
