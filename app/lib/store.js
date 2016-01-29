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
  persistState( 'auth', { key: 'voyageur' } )
)( createStore );

export default createStoreWithMiddleware( reducers );
