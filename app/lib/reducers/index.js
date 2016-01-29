import { combineReducers } from 'redux';
import library from './library';
import trip from './trip';
import distance from './distance';
import auth from './auth';
import ui from './ui';
import notices from './notices';
import admin from './admin';

export default combineReducers( {
  auth,
  library,
  trip,
  ui,
  notices,
  distance,
  admin,
} );
