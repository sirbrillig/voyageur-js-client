import React from 'react';

export default React.createClass( {
  propTypes: {
    meters: React.PropTypes.number.isRequired,
  },

  getDistanceText() {
    return 'Your trip is ' + ( this.props.meters * 0.000621371192 ).toFixed( 1 ) + ' miles';
  },

  render() {
    if ( this.props.meters === 0 ) return <div className="distance well well-sm">0 miles</div>;
    return <div className="distance well well-sm"><span className="glyphicon glyphicon-road" /> { this.getDistanceText() }</div>;
  }
} );

