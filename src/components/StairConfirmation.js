import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from "react-router-dom";
import App from "./App";

class StairConfirmation extends Component {
  render() {
    return (
      <div>
        <h1>Well done!</h1>
        <Link to="/">Return to the dashboard</Link>
        <Route path="/" component={ App } />
      </div>
    )
  }
}

export default StairConfirmation;