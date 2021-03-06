import React from 'react';
import { connect } from 'react-redux';
import timeago from 'lib/timeago';
import { fetchEvents } from 'lib/actions/admin.js';
import classNames from 'classnames';
import debugFactory from 'debug';

const debug = debugFactory( 'voyageur:admin-dashboard' );

class AdminDashboard extends React.Component {
  componentDidMount() {
    this.props.fetchEvents();
  }

  onChangePage = () => {
    const page = parseInt( this.pageField.value, 10 ) - 1;
    if ( page < 0 ) return;
    this.props.fetchEvents( { page } );
  }

  renderEvent = ( event ) => {
    const method = event.event.toLowerCase();
    const classes = classNames( {
      info: ( method === 'get' ),
      success: ( method === 'create' || method === 'post' ),
      warning: ( method === 'update' || method === 'put' || method === 'delete' ),
      danger: ( event.level > 30 ),
    } );
    const eventDate = new Date( event.time );
    debug( 'showing log event', event );
    return (
      <tr key={ event._id } className={ classes }>
        <td>{ timeago( eventDate ) }</td>
        <td>{ event.userId }</td>
        <td>{ event.userName }</td>
        <td>{ event.ip }</td>
        <td>{ event.path || event.name }</td>
        <td>{ method }</td>
        <td>{ JSON.stringify( event.data || event.body ) }</td>
        <td>{ event.msg }</td>
      </tr>
    );
  }

  renderEventLog = () => {
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Name</th>
            <th>Source</th>
            <th>Scope</th>
            <th>Event</th>
            <th>Data</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          { this.props.events.map( this.renderEvent ) }
        </tbody>
      </table>
    );
  }

  renderEventControls = () => {
    const addRef = i => this.pageField = i;
    return (
      <div className="form-inline">
        <div className="form-group">
          <label htmlFor="eventPage" className="control-label admin-controls__label">Page</label>
          <input type="number" min={ 1 } className="form-control" id="eventPage" ref={ addRef } onChange={ this.onChangePage } defaultValue={ 1 } />
        </div>
      </div>
    );
  }

  render() {
    if ( ! this.props.isAdmin ) return <h1>Unauthorized</h1>;
    return (
      <div className="admin">
        <h1>Admin Dashboard</h1>
        <div className="admin-main">
          { this.renderEventControls() }
          { this.renderEventLog() }
        </div>
      </div>
    );
  }
}

AdminDashboard.propTypes = {
  events: React.PropTypes.array.isRequired,
  isAdmin: React.PropTypes.bool,
  fetchEvents: React.PropTypes.func.isRequired,
};

function mapStateToProps( state ) {
  return { isAdmin: ( state.auth.user && state.auth.user.role === 'admin' ), events: state.admin.events };
}

export default connect( mapStateToProps, { fetchEvents } )( AdminDashboard );
