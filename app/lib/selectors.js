export function getLocations( state ) {
  return state.library.locations;
}

export function getLocationById( state, id ) {
  return getLocations( state ).reduce( ( found, location ) => {
    if ( location._id === id ) return location;
    return found;
  }, null );
}

export function getAddressesForTrip( state ) {
  // Trips can contain `id` that maps to a library location or just an `address`
  return state.trip.map( location => location.id ? getLocationById( state, location.id ) : { address: location.address } )
  .filter( location => !! location )
  .map( location => location.address );
}
