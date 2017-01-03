import { expect } from 'chai';
import trip from 'lib/reducers/trip';

describe( 'trip reducer', function() {
  describe( 'TRIP_GOT_TRIP_LOCATIONS', function() {
    it( 'replaces the current trip array with a new array', function() {
      const action = { type: 'TRIP_GOT_TRIP_LOCATIONS', trip: [ 4, 5, 6 ] };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 4, 5, 6 ] );
    } );
  } );

  describe( 'TRIP_CLEAR', function() {
    it( 'replaces the current trip array with an empty array', function() {
      const action = { type: 'TRIP_CLEAR' };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [] );
    } );
  } );
} );
