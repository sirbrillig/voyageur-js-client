import chai from 'chai';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import Header from '../app/components/header';

const expect = chai.expect;

describe( 'Header', function() {
  it( 'renders the site title', function() {
    const renderer = createRenderer();
    renderer.render(
      <Header />
    );
    const actual = renderer.getRenderOutput();
    const expected = <h1 className="header__title">Voyageur</h1>;
    expect( actual.props.children ).to.include( expected );
  } )
} );
