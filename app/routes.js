import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Provider } from 'react-redux';
import store from './lib/store';
import App from './components/app';
import AdminDashboard from './components/admin-dashboard';
import LoggedIn from './components/logged-in';

const history = createBrowserHistory();

export default (
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ App }>
        <IndexRoute component={ LoggedIn } />
        <Route path="/admin" component={ AdminDashboard } />
      </Route>
    </Router>
  </Provider>
);
