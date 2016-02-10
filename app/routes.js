import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './lib/store';
import App from './components/app';
import AdminDashboard from './components/admin-dashboard';
import ImportPanel from './components/import';
import LoggedIn from './components/logged-in';

export default (
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute component={ LoggedIn } />
        <Route path="/admin" component={ AdminDashboard } />
        <Route path="/import" component={ ImportPanel } />
      </Route>
    </Router>
  </Provider>
);
