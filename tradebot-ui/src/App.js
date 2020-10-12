import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Error from './components/Error';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/login' component={Login} exact />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
