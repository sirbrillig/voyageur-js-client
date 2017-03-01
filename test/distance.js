import React from 'react';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { Distance } from 'components/distance';
import { getKeyForAddresses, now, getMaxDistanceAge } from 'lib/helpers';
import DistanceNumber from 'components/distance-number';

chai.use( sinonChai );
chai.use( chaiEnzyme() );
const expect = chai.expect;

const defaultProps = {
  trip: [],
  library: [],
  cachedDistances: {},
  useMiles: false,
  fetchDistanceBetween: () => null,
  changeUnits: () => null,
};

function makeTripLoc( address ) {
  return { address };
}

function makeTrip( addrs ) {
  return addrs.map( makeTripLoc );
}

describe( '<Distance />', function() {
  it( 'renders a 0 distance with no addresses', function() {
    const component = React.createElement( Distance, defaultProps );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 0 } useMiles={ false } /> );
  } );

  it( 'renders a 0 distance with one address', function() {
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( [ '123 Home Drive, Chicago, IL, USA' ] ) } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 0 } useMiles={ false } /> );
  } );

  it( 'renders a 0 distance with two duplicate addresses', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '123 Home Drive, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], 'foo' ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 0 } useMiles={ false } /> );
  } );

  it( 'renders a total distance with two addresses and cached distances', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], 'foo' ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 5000 } useMiles={ false } /> );
  } );

  it( 'renders a total distance with three addresses and cached distances', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 2 ] ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 8000 } useMiles={ false } /> );
  } );

  it( 'renders a total distance ignoring duplicate adjacent addresses', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '123 Home Drive, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 0 ], 'foo' ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 3000 } useMiles={ false } /> );
  } );

  it( 'renders a total distance with four addresses and cached distances', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA', '10 Short Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 2 ], addresses[ 3 ] ) ]: { distance: 1000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 9000 } useMiles={ false } /> );
  } );

  it( 'renders a total distance with four addresses including one repeated address', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA', '123 Home Drive, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 2 ], addresses[ 3 ] ) ]: { distance: 1000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ 9000 } useMiles={ false } /> );
  } );

  it( 'renders no distance if there is an uncached distance needed', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ null } useMiles={ false } /> );
  } );

  it( 'renders no distance if there is an expired cached distance needed', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const maxDistanceAge = getMaxDistanceAge();
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: lastUpdatedAt - maxDistanceAge - 10 },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt },
    };
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper ).to.contain( <DistanceNumber meters={ null } useMiles={ false } /> );
  } );

  it( 'does not fetch distance if all needed distances are cached', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 2000, lastUpdatedAt },
    };
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.not.have.been.called;
  } );

  it( 'does not fetch distance with duplicate addresses', function() {
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '123 Home Drive, Chicago, IL, USA' ];
    const cachedDistances = {};
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.not.have.been.called;
  } );

  it( 'fetches each uncached distance if there is an uncached distance needed', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], 'foo' ) ]: { distance: 2000, lastUpdatedAt },
    };
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.have.been.calledWith( addresses[ 0 ], addresses[ 1 ] );
  } );

  it( 'fetches each expired distance if there is an expired cached distance needed', function() {
    const lastUpdatedAt = now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const maxDistanceAge = getMaxDistanceAge();
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: lastUpdatedAt - maxDistanceAge - 10 },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt },
      [ getKeyForAddresses( addresses[ 1 ], 'foo' ) ]: { distance: 2000, lastUpdatedAt },
    };
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, trip: makeTrip( addresses ), cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.have.been.calledWith( addresses[ 0 ], addresses[ 1 ] );
  } );
} );

