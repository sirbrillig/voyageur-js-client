// Find the element in state.locations that matches the ID in action.location,
// then update it with the data in action.location
function updateLocationInList( locations, location ) {
  return locations.map( l => {
    if ( l._id === location._id ) return location;
    return l;
  } );
}

const initialState = { locations: [], predictions: [], isLoading: true };
export default function library( state = initialState, action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_PREDICTIONS':
      return Object.assign( {}, state, { predictions: action.predictions } );
    case 'LIBRARY_GOT_LOCATIONS':
      return Object.assign( {}, { locations: action.library, isLoading: false } );
    case 'LIBRARY_GOT_NEW_LOCATION': {
      const locations = [ ...state.locations, action.location ];
      return Object.assign( {}, { locations } );
    }
    case 'LIBRARY_GOT_UPDATED_LOCATION': {
      const locations = updateLocationInList( state.locations, action.location );
      return Object.assign( {}, { locations } );
    }
  }
  return state;
}
