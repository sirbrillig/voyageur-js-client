import React from 'react';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow } from 'enzyme';
import { Distance } from 'components/distance';
import { getKeyForAddresses } from 'lib/helpers';

chai.use( sinonChai );
const expect = chai.expect;

const defaultProps = {
  addresses: [],
  cachedDistances: {},
  fetchDistanceBetween: () => null,
  useMiles: false,
  changeUnits: () => null,
};

describe( '<Distance />', function() {
  it( 'renders a 0 distance with no addresses', function() {
    const component = React.createElement( Distance, defaultProps );
    const wrapper = shallow( component );
    expect( wrapper.text() ).to.contain( ' 0.0 km' );
  } );

  it( 'renders a 0 distance with one address', function() {
    const component = React.createElement( Distance, { ...defaultProps, addresses: [ '123 Home Drive, Chicago, IL, USA' ] } );
    const wrapper = shallow( component );
    expect( wrapper.text() ).to.contain( ' 0.0 km' );
  } );

  it( 'renders a total distance with two addresses and cached distances', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper.text() ).to.contain( ' 5.0 km' );
  } );

  it( 'renders a total distance with three addresses and cached distances', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper.text() ).to.contain( ' 8.0 km' );
  } );

  it( 'renders a total distance with four addresses and cached distances', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA', '10 Short Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 2 ], addresses[ 3 ] ) ]: { distance: 1000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper.text() ).to.contain( ' 9.0 km' );
  } );

  it( 'renders no distance if there is an uncached distance needed', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper.text() ).not.to.contain( ' km' );
  } );

  it( 'renders no distance if there is an expired cached distance needed', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const maxDistanceAge = 7 * 24 * 60 * 60 * 1000;
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: now - maxDistanceAge - 10 },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances } );
    const wrapper = shallow( component );
    expect( wrapper.text() ).not.to.contain( ' km' );
  } );

  it( 'does not fetch distance if all needed distances are cached', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.not.have.been.called;
  } );

  it( 'fetches each uncached distance if there is an uncached distance needed', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.have.been.calledWith( addresses[ 0 ], addresses[ 1 ] );
  } );

  it( 'fetches each expired distance if there is an expired cached distance needed', function() {
    const now = Date.now();
    const addresses = [ '123 Home Drive, Chicago, IL, USA', '321 State Street, Chicago, IL, USA', '345 Main Street, Chicago, IL, USA' ];
    const maxDistanceAge = 7 * 24 * 60 * 60 * 1000;
    const cachedDistances = {
      [ getKeyForAddresses( addresses[ 0 ], addresses[ 1 ] ) ]: { distance: 5000, lastUpdatedAt: now - maxDistanceAge - 10 },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 2 ] ) ]: { distance: 3000, lastUpdatedAt: now },
      [ getKeyForAddresses( addresses[ 1 ], addresses[ 3 ] ) ]: { distance: 2000, lastUpdatedAt: now },
    };
    const fetchDistanceBetween = sinon.spy();
    const component = React.createElement( Distance, { ...defaultProps, addresses, cachedDistances, fetchDistanceBetween } );
    shallow( component );
    expect( fetchDistanceBetween ).to.have.been.calledWith( addresses[ 0 ], addresses[ 1 ] );
  } );
} );

