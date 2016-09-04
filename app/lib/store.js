import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import reducers from './reducers';
import Debug from 'redux-debug';
import debugFactory from 'debug';

const debug = debugFactory( 'voyageur:store' );

const createStoreWithMiddleware = compose(
  applyMiddleware( thunk ),
  applyMiddleware( Debug( debug ) ),
  persistState( [ 'auth', 'prefs', 'distances' ], { key: 'voyageur' } ),
  ( window && window.devToolsExtension ) ? window.devToolsExtension() : f => f
)( createStore );

export default createStoreWithMiddleware( reducers );
