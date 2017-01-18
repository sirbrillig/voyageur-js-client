const initialState = { isShowingAddLocation: false, searchString: '', selectedLocation: 0, editingLocation: null, addingAddress: null, isShowingTrip: false };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'TRIP_SHOW':
      return Object.assign( {}, state, { isShowingTrip: true } );
    case 'TRIP_HIDE':
      return Object.assign( {}, state, { isShowingTrip: false } );
    case 'TRIP_CLEAR':
      return Object.assign( {}, state, { searchString: '' } );
    case 'TRIP_ADD_LOCATION':
      return Object.assign( {}, state, { searchString: '' } );
    case 'LIBRARY_GOT_NEW_LOCATION':
      return Object.assign( {}, state, { isShowingAddLocation: false, addingAddress: null } );
    case 'LIBRARY_HIDE_ADD_LOCATION':
      return Object.assign( {}, state, { isShowingAddLocation: false, addingAddress: null } );
    case 'LIBRARY_SHOW_ADD_LOCATION':
      return Object.assign( {}, state, { isShowingAddLocation: true, addingAddress: action.addingAddress } );
    case 'LIBRARY_SEARCH_FOR':
      return Object.assign( {}, state, { searchString: action.searchString, selectedLocation: 0 } );
    case 'LIBRARY_SELECT_NEXT':
      if ( state.selectedLocation === action.max ) return state;
      return Object.assign( {}, state, { selectedLocation: state.selectedLocation + 1 } );
    case 'LIBRARY_SELECT_PREVIOUS':
      if ( state.selectedLocation === 0 ) return state;
      return Object.assign( {}, state, { selectedLocation: state.selectedLocation - 1 } );
    case 'LIBRARY_EDIT_LOCATION':
      return Object.assign( {}, state, { editingLocation: action.location } );
    case 'LIBRARY_HIDE_EDIT_LOCATION':
      return Object.assign( {}, state, { editingLocation: null } );
  }
  return state;
}

