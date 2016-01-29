import React from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

const LibraryLocation = React.createClass( {
  propTypes: {
    location: React.PropTypes.object.isRequired,
    onAddToTrip: React.PropTypes.func.isRequired,
    onEditLocation: React.PropTypes.func.isRequired,
    isSelected: React.PropTypes.bool,
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    onDrop: React.PropTypes.func.isRequired,
  },

  renderControls() {
    if ( this.props.location.isLoading ) {
      return <span className="library-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default" onClick={ () => this.props.onEditLocation( this.props.location ) }>Edit</button>
        <button className="btn btn-primary" onClick={ () => this.props.onAddToTrip( this.props.location ) }>Add</button>
      </div>
    );
  },

  render() {
    const locationClassNames = classNames( 'library-location row well well-sm', {
      'library-location--selected': this.props.isSelected,
      'library-location--droppable': this.props.isOver,
    } );
    return this.props.connectDropTarget( this.props.connectDragSource(
      <li className={ locationClassNames } >
        <div className="library-location__description col-xs-8" >
          <h3 className="library-location__description__name">{ this.props.location.name }</h3>
          <p className="library-location__description__address">{ this.props.location.address }</p>
        </div>
        <div className="col-xs-4" >
          <div className="library-location__controls" >
            { this.renderControls() }
          </div>
        </div>
      </li>
    ) );
  }
} );

const dragSpec = {
  beginDrag( props ) {
    return { location: props.location._id };
  },

  endDrag( props, monitor ) {
    const source = props.location._id;
    const result = monitor.getDropResult();
    if ( ! result ) return;
    const target = result.location;
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
    return { location: props.location._id };
  }
};

function collectDrop( connect, monitor ) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export default flow(
  DragSource( 'LOCATION', dragSpec, collectDrag ),
  DropTarget( 'LOCATION', dropSpec, collectDrop )
)( LibraryLocation );
