import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import reducers from './reducers';
import Debug from 'redux-debug';
import debugFactory from 'debug';

const debug = debugFactory( 'voyageur:store' );

function storeSlicer() {
  return state => {
    let { auth, ui } = state;
    return { auth, ui: { useMiles: ui.useMiles } };
  };
}

const createStoreWithMiddleware = compose(
  applyMiddleware( thunk ),
  applyMiddleware( Debug( debug ) ),
  persistState( null, { key: 'voyageur', slicer: storeSlicer } )
)( createStore );

export default createStoreWithMiddleware( reducers );
