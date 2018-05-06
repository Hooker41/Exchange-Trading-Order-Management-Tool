import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
// import '../node_modules/@coreui/styles/scss/_dropdown-menu-right.scss';

// Containers
import { Full } from './containers';
// Pages
import { Login, Register } from './views/Pages';

// import { renderRoutes } from 'react-router-config';

import { Provider } from 'react-redux';
import configureStore from 'store/configure';
const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route path="/" name="Home" component={Full} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
