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

  describe( 'TRIP_ADD_LOCATION', function() {
    it( 'adds the location to the end of the current trip', function() {
      const action = { type: 'TRIP_ADD_LOCATION', location: 5 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 1, 2, 3, 5 ] );
    } );
  } );

  describe( 'TRIP_REMOVE_LOCATION', function() {
    it( 'removes the location at the specified index from the current trip', function() {
      const action = { type: 'TRIP_REMOVE_LOCATION', index: 1 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 1, 3 ] );
    } );

    it( 'does not alter the trip if the target index is out of bounds', function() {
      const action = { type: 'TRIP_REMOVE_LOCATION', index: 5 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 1, 2, 3 ] );
    } );
  } );

  describe( 'TRIP_MOVE_LOCATION', function() {
    it( 'moves the location from its index to the target index if moving to the middle', function() {
      const action = { type: 'TRIP_MOVE_LOCATION', startIndex: 0, destinationIndex: 1 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 2, 1, 3 ] );
    } );

    it( 'moves the location from its index to the target index if moving to the end', function() {
      const action = { type: 'TRIP_MOVE_LOCATION', startIndex: 0, destinationIndex: 2 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 2, 3, 1 ] );
    } );

    it( 'moves the location from its index to the target index if moving to the start', function() {
      const action = { type: 'TRIP_MOVE_LOCATION', startIndex: 1, destinationIndex: 0 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 2, 1, 3 ] );
    } );

    it( 'does not alter the trip if the start index is out of bounds', function() {
      const action = { type: 'TRIP_MOVE_LOCATION', startIndex: 5, destinationIndex: 1 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 1, 2, 3 ] );
    } );

    it( 'moves the location to the end of the trip if the destination index is out of bounds', function() {
      const action = { type: 'TRIP_MOVE_LOCATION', startIndex: 0, destinationIndex: 5 };
      const result = trip( [ 1, 2, 3 ], action );
      expect( result ).to.eql( [ 2, 3, 1 ] );
    } );
  } );
} );
