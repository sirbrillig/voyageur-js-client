import { expect } from 'chai';
import { reorderModels } from 'lib/helpers';

describe( 'reorderModels()', function() {
  it( 'changes the order of the models moving the end to the start', function() {
    const models = [ { _id: 'a' }, { _id: 'b' }, { _id: 'c' } ];
    const result = reorderModels( models, 'c', 'a' );
    expect( result ).to.eql( [ models[ 2 ], models[ 0 ], models[ 1 ] ] );
  } );

  it( 'changes the order of the models moving the start to the end', function() {
    const models = [ { _id: 'a' }, { _id: 'b' }, { _id: 'c' } ];
    const result = reorderModels( models, 'a', 'c' );
    expect( result ).to.eql( [ models[ 1 ], models[ 2 ], models[ 0 ] ] );
  } );

  it( 'changes the order of the models moving the middle to the start', function() {
    const models = [ { _id: 'a' }, { _id: 'b' }, { _id: 'c' } ];
    const result = reorderModels( models, 'b', 'a' );
    expect( result ).to.eql( [ models[ 1 ], models[ 0 ], models[ 2 ] ] );
  } );

  it( 'changes the order of the models moving the middle to the end', function() {
    const models = [ { _id: 'a' }, { _id: 'b' }, { _id: 'c' } ];
    const result = reorderModels( models, 'b', 'c' );
    expect( result ).to.eql( [ models[ 0 ], models[ 2 ], models[ 1 ] ] );
  } );

  it( 'returns null if the source id is not found', function() {
    const models = [ { _id: 'a' }, { _id: 'b' }, { _id: 'c' } ];
    const result = reorderModels( models, 'd', 'c' );
    expect( result ).to.be.not.ok;
  } );

  it( 'returns null if the target id is not found', function() {
    const models = [ { _id: 'a' }, { _id: 'b' }, { _id: 'c' } ];
    const result = reorderModels( models, 'a', 'd' );
    expect( result ).to.be.not.ok;
  } );
} );
