import React from 'react';

export default React.createClass( {
  propTypes: {
    meters: React.PropTypes.number.isRequired,
  },

  getDistanceText() {
    return 'Your trip is ' + ( this.props.meters * 0.000621371192 ).toFixed( 1 ) + ' miles';
  },

  renderButtons() {
    return (
      <span className="btn-group btn-group-xs" data-toggle="buttons">
        <label className="btn btn-primary active">
          <input type="radio" name="scale" id="scale-miles" defaultChecked={ true } />Miles
        </label>
        <label className="btn btn-primary">
          <input type="radio" name="scale" id="scale-km" />Km
        </label>
      </span>
    );
  },

  render() {
    if ( this.props.meters === 0 ) return <div className="distance well well-sm">0 miles</div>;
    return <div className="distance well well-sm"><span className="glyphicon glyphicon-road" /> { this.getDistanceText() } { this.renderButtons() }</div>;
  }
} );

