import React from 'react';

const MainQuestion = function( props ) {
  const getQuestionText = function( trip ) {
    if ( trip.length < 1 ) {
      return 'Enter a location';
    }
    if ( trip.length === 1 ) {
      return 'Enter another location and I\'ll tell you the distance of the trip';
    }
    return 'Enter another location';
  };
  return <div className="question">{ getQuestionText( props.trip ) }</div>;
};

export default MainQuestion;
