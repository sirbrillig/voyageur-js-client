import React from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

const TripLocation = React.createClass( {
  propTypes: {
    tripLocation: React.PropTypes.object.isRequired,
    onRemoveTripLocation: React.PropTypes.func.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    onDrop: React.PropTypes.func.isRequired,
  },

  renderControls() {
    if ( this.props.tripLocation.isLoading ) {
      return <span className="trip-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default" onClick={ () => this.props.onRemoveTripLocation( this.props.tripLocation._id ) }>Remove</button>
      </div>
    );
  },

  render() {
    const locationClassNames = classNames( 'trip-location row well well-sm', {
      'trip-location--droppable': this.props.isOver,
    } );
    return this.props.connectDropTarget( this.props.connectDragSource(
      <li className={ locationClassNames } >
        <div className="trip-location__description col-xs-8" >
          <h3 className="trip-location__description__name">{ this.props.tripLocation.location.name }</h3>
          <p className="trip-location__description__address">{ this.props.tripLocation.location.address }</p>
        </div>
        <div className="col-xs-4" >
          <div className="trip-location__controls" >
          { this.renderControls() }
          </div>
        </div>
      </li>
    ) );
  }
} );

const dragSpec = {
  beginDrag( props ) {
    return { tripLocation: props.tripLocation._id };
  },

  endDrag( props, monitor ) {
    const source = props.tripLocation._id;
    const result = monitor.getDropResult();
    if ( ! result ) return;
    const target = result.tripLocation;
    if ( source === target ) return;
    props.onDrop( source, target );
  }
};

function collectDrag( connect, monitor ) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const dropSpec = {
  drop( props ) {
    return { tripLocation: props.tripLocation._id };
  }
};

function collectDrop( connect, monitor ) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export default flow(
  DragSource( 'TRIPLOCATION', dragSpec, collectDrag ),
  DropTarget( 'TRIPLOCATION', dropSpec, collectDrop )
)( TripLocation );
