import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from "react-router-dom";
import StairForm from "./StairForm";

class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <Link to="/stair-form">Log your stair climb</Link>
        <Route path="/stair-form" component={ StairForm } />
      </div>
    )
  }
}

export default App;
