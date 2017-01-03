import { Promise } from 'es6-promise';

let autocompleteService;
let autocompleteOK;

function initAutocomplete() {
  if ( ! window || ! window.google || ! window.google.maps ) {
    autocompleteService = { getPlacePredictions: () => null };
    autocompleteOK = 'OK';
    return;
  }
  if ( ! autocompleteService ) autocompleteService = new window.google.maps.places.AutocompleteService();
  if ( ! autocompleteOK ) autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK;
}

export function searchAutocompleteFor( searchString ) {
  initAutocomplete();
  return new Promise( function( resolve, reject ) {
    if ( ! searchString ) {
      return resolve( [], autocompleteOK );
    }
    const options = {};
    autocompleteService.getPlacePredictions( { options, input: searchString }, ( predictions, status ) => {
      if ( status === autocompleteOK ) {
        resolve( predictions );
      }
      reject( status );
    } );
  } );
}
