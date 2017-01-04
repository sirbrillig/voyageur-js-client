import React from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';
import { buildTripLocationFromLocation } from 'lib/helpers';

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
    isDisabled: React.PropTypes.bool,
  },

  componentDidUpdate() {
    if ( this.props.isSelected ) this.scrollIntoView();
  },

  scrollIntoView() {
    if ( window && this.domElement ) window.scrollTo( 0, this.domElement.offsetTop - ( window.innerHeight / 2 ) );
  },

  renderControls() {
    if ( this.props.location.isLoading ) {
      return <span className="library-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    const addToTrip = () => this.props.onAddToTrip( buildTripLocationFromLocation( this.props.location ) );
    // TODO: edit needs to change to 'save' for id-less locations
    const editLocation = () => this.props.onEditLocation( this.props.location );
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default" onClick={ editLocation }>Edit</button>
        <button disabled={ this.props.isDisabled } className="btn btn-primary" onClick={ addToTrip }>Add <span className="glyphicon glyphicon-arrow-right" /></button>
      </div>
    );
  },

  render() {
    const locationClassNames = classNames( 'library-location row well well-sm', {
      'library-location--selected': this.props.isSelected,
      'library-location--droppable': this.props.isOver,
    } );
    const saveRef = el => this.domElement = el;
    return this.props.connectDropTarget( this.props.connectDragSource(
      <li className={ locationClassNames } ref={ saveRef }>
        <div className="library-location__description col-xs-8" >
          <h3 className="library-location__description__name">{ this.props.location.name }</h3>
          <p className="library-location__description__address">{ this.props.location.address || this.props.location.description }</p>
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
    return { location: buildTripLocationFromLocation( props.location ) };
  },

  endDrag( props, monitor ) {
    const source = buildTripLocationFromLocation( props.location );
    const result = monitor.getDropResult();
    if ( ! result ) return;
    if ( ! source ) return console.warn( 'Could not find drag source information from', props );
    if ( result.trip ) return props.onAddToTrip( source );
    const target = result.location;
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
    return { location: buildTripLocationFromLocation( props.location ) };
  }
};

function collectDrop( connect, monitor ) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export default flow(
  DragSource( 'LOCATION', dragSpec, collectDrag ),
  DropTarget( 'LOCATION', dropSpec, collectDrop )
)( LibraryLocation );
