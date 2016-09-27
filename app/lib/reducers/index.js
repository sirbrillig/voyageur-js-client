import { combineReducers } from 'redux';
import library from 'lib/reducers/library';
import trip from 'lib/reducers/trip';
import distances from 'lib/reducers/distances';
import auth from 'lib/reducers/auth';
import prefs from 'lib/reducers/prefs';
import ui from 'lib/reducers/ui';
import notices from 'lib/reducers/notices';
import admin from 'lib/reducers/admin';

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
