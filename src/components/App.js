import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from "react-router-dom";
import Register from "./Register";

class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <Link to="/register">register</Link>
        <Route path="/register" component={ Register } />
      </div>
    );
  }
}

export default App;
