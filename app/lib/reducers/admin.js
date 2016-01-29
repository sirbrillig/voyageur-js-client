const initialState = { events: [] };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'ADMIN_GOT_EVENTS':
      return Object.assign( {}, state, { events: action.events } );
  }
  return state;
}
