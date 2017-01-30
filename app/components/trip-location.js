import React from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

const TripLocationControls = ( props ) => {
  if ( props.isLoading ) {
    return <span className="trip-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
  }
  const onRemove = () => props.onRemoveTripLocation( props.index );
  return (
    <div className="btn-group btn-group-sm" role="group">
    <button className="btn btn-default" onClick={ onRemove }>Remove</button>
    </div>
  );
};

TripLocationControls.propTypes = {
  isLoading: React.PropTypes.bool,
  index: React.PropTypes.number.isRequired,
  onRemoveTripLocation: React.PropTypes.func.isRequired,
};

const TripLocation = ( props ) => {
  const locationClassNames = classNames( 'trip-location row well well-sm', {
    'trip-location--droppable': props.isOver,
  } );
  return props.connectDropTarget( props.connectDragSource(
    <li className={ locationClassNames } >
      <div className="trip-location__description col-xs-8" >
        <h3 className="trip-location__description__name">{ props.name || props.address }</h3>
      </div>
      <div className="col-xs-4" >
        <div className="trip-location__controls" >
          <TripLocationControls isLoading={ props.isLoading } index={ props.index } onRemoveTripLocation={ props.onRemoveTripLocation } />
        </div>
      </div>
    </li>
  ) );
};

TripLocation.propTypes = {
  address: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  isLoading: React.PropTypes.bool,
  index: React.PropTypes.number.isRequired,
  onRemoveTripLocation: React.PropTypes.func.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  onDrop: React.PropTypes.func.isRequired,
};

const dragSpec = {
  beginDrag( props ) {
    return { tripLocation: props.index };
  },

  endDrag( props, monitor ) {
    const source = props.index;
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
  };
}

const dropSpec = {
  drop( props ) {
    return { tripLocation: props.index };
  }
};

function collectDrop( connect, monitor ) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export default flow(
  DragSource( 'TRIPLOCATION', dragSpec, collectDrag ),
  DropTarget( 'TRIPLOCATION', dropSpec, collectDrop )
)( TripLocation );
