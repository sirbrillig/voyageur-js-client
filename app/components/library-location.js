import React from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';
import { buildTripLocationFromLocation } from 'lib/helpers';

const LibraryLocationControls = ( props ) => {
  if ( props.location.isLoading ) {
    return <span className="library-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
  }
  const editLocation = () => props.onEditLocation( props.location );
  const saveLocation = () => props.onAddLocation( props.location.description );
  if ( ! props.location.name && ! props.location._id ) {
    return <button className="library-location-controls btn btn-default btn-sm" onClick={ saveLocation }>Save</button>;
  }
  return <button className="library-location-controls btn btn-default btn-sm" onClick={ editLocation }>Edit</button>;
};

LibraryLocationControls.propTypes = {
  location: React.PropTypes.object.isRequired,
  onAddLocation: React.PropTypes.func.isRequired,
  onEditLocation: React.PropTypes.func.isRequired,
};

class LibraryLocation extends React.Component {
  componentDidUpdate() {
    if ( this.props.isSelected ) this.scrollIntoView( this.domElement );
  }

  scrollIntoView( domElement ) {
    if ( window && domElement ) window.scrollTo( 0, domElement.offsetTop - ( window.innerHeight / 2 ) );
  }

  render() {
    const addToTrip = () => this.props.onAddToTrip( buildTripLocationFromLocation( this.props.location ) );
    const locationClassNames = classNames( 'library-location', {
      'library-location--selected': this.props.isSelected,
      'library-location--droppable': this.props.isOver,
    } );
    const saveRef = el => this.domElement = el;
    return this.props.connectDropTarget( this.props.connectDragSource(
      <li className={ locationClassNames } ref={ saveRef }>
        <div className="library-location__description" >
          <h3 className="library-location__description__name">{ this.props.location.name }</h3>
          <p className="library-location__description__address">{ this.props.location.address || this.props.location.description }</p>
        </div>
        <div className="library-location__controls" >
          <LibraryLocationControls location={ this.props.location } onEditLocation={ this.props.onEditLocation } onAddLocation={ this.props.onAddLocation } />
        </div>
        <button disabled={ this.props.isDisabled } className="btn btn-primary btn-block library-location__add" onClick={ addToTrip }>Add to trip <span className="glyphicon glyphicon-arrow-right" /></button>
      </li>
    ) );
  }
}

LibraryLocation.propTypes = {
  location: React.PropTypes.object.isRequired,
  onAddToTrip: React.PropTypes.func.isRequired,
  onEditLocation: React.PropTypes.func.isRequired,
  onAddLocation: React.PropTypes.func.isRequired,
  isSelected: React.PropTypes.bool,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  onDrop: React.PropTypes.func.isRequired,
  isDisabled: React.PropTypes.bool,
};

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
    if ( ! source.id || ! target.id ) return console.warn( 'Cannot drag that item' );
    props.onDrop( source.id, target.id );
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
