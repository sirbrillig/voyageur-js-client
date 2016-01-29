function matchesSearch( searchString, location ) {
  if ( searchString.length < 2 ) return true;
  return ( ~ location.name.toLowerCase().indexOf( searchString ) || ~ location.address.toLowerCase().indexOf( searchString ) );
}

// Find the element in state.locations that matches the ID in action.location,
// then update it with the data in action.location
function updateLocationInList( locations, location ) {
  return locations.map( l => {
    if ( l._id === location._id ) return location;
    return l;
  } );
}

const initialState = { locations: [], visibleLocations: [], isLoading: true };
export default function library( state = initialState, action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_LOCATIONS':
      return Object.assign( {}, { locations: action.library, visibleLocations: action.library, isLoading: false } );
    case 'LIBRARY_SEARCH_FOR':
      const visibleLocations = state.locations.filter( l => matchesSearch( action.searchString, l ) );
      return Object.assign( {}, state, { visibleLocations } );
    case 'LIBRARY_GOT_NEW_LOCATION':
      const locations = [ ...state.locations, action.location ];
      return Object.assign( {}, { locations, visibleLocations: locations } );
    case 'LIBRARY_GOT_UPDATED_LOCATION':
      const newLocations = updateLocationInList( state.locations, action.location );
      return Object.assign( {}, { locations: newLocations, visibleLocations: newLocations } );
  }
  return state;
}
