import React from 'react';
import noop from 'lodash.noop';
import classNames from 'classnames';

export default React.createClass( {
  propTypes: {
    meters: React.PropTypes.number.isRequired,
    useMiles: React.PropTypes.bool,
    onClickUnits: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      meters: 0,
      useMiles: true,
      onClickUnits: noop,
    };
  },

  getDistanceText() {
    if ( this.props.useMiles ) return 'Your trip is ' + ( this.props.meters * 0.000621371192 ).toFixed( 1 ) + ' miles';
    return 'Your trip is ' + ( this.props.meters / 1000 ).toFixed( 1 ) + ' km';
  },

  renderButtons() {
    const milesClassNames = classNames( 'btn btn-primary', { active: this.props.useMiles } );
    const kmClassNames = classNames( 'btn btn-primary', { active: ! this.props.useMiles } );
    return (
      <span className="btn-group btn-group-xs" data-toggle="buttons">
        <label className={ milesClassNames }>
          <input type="radio" name="scale" id="scale-miles" checked={ this.props.useMiles } onChange={ () => this.props.onClickUnits( 'miles' ) } />Miles
        </label>
        <label className={ kmClassNames }>
          <input type="radio" name="scale" id="scale-km" checked={ ! this.props.useMiles } onChange={ () => this.props.onClickUnits( 'km' ) } />Km
        </label>
      </span>
    );
  },

  render() {
    if ( this.props.meters === 0 ) return <div className="distance">0 { this.props.useMiles ? 'miles' : 'km' }</div>;
    return <div className="distance"><span className="glyphicon glyphicon-road" /> { this.getDistanceText() } { this.renderButtons() }</div>;
  }
} );

