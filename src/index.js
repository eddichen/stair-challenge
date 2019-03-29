import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './components/App/App';
import StairForm from './components/StairForm';
import UserDashboard from './components/UserDashboard';

const router = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/stair-form" component={StairForm} />
      <Route path="/user-dashboard" component={UserDashboard} />
    </div>
  </Router>
);

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
