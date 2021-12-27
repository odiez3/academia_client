import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';


import Login from './components/login.cmpt';
import Dashboard from './components/dashboard.cmpt';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
         <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
