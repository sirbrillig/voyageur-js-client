import { combineReducers } from 'redux';
import library from './library';
import trip from './trip';
import distances from './distances';
import auth from './auth';
import prefs from './prefs';
import ui from './ui';
import notices from './notices';
import admin from './admin';

export default combineReducers( {
  auth,
  prefs,
  library,
  trip,
  ui,
  notices,
  distances,
  admin,
} );
