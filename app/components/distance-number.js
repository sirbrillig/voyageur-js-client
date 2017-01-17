import React from 'react';
import AnimateOnChange from 'react-animate-on-change';

const DistanceNumber = ( props ) => {
  const meters = props.meters;
  if ( meters === null ) return 'Loading...';
  const miles = ( meters * 0.000621371192 ).toFixed( 1 );
  const km = ( meters / 1000 ).toFixed( 1 );
  const number = props.useMiles ? miles : km;
  const units = props.useMiles ? 'miles' : 'km';
  return <AnimateOnChange baseClassName="distance__number" animationClassName="animated slideInDown" animate={ true }>{ number } { units }</AnimateOnChange>;
};

export default DistanceNumber;
