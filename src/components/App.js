import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from "react-router-dom";
import { firebaseApp } from '../base';
import Header from "./Header";
import StairForm from "./StairForm";

class App extends Component {
  constructor() {
    super()

    this.state = {
      users: []
    }
  }

  getUserData() {
    const db = firebaseApp.firestore();

    db.collection("users").get().then((querySnapshot) => {
      let userDetails = []

      querySnapshot.forEach(doc => {
        userDetails.push(doc.data())
      })

      this.setState({
        users: userDetails
      })
    })
  }

  componentDidMount() {
    this.getUserData()
  }

  render() {
    return (
      <div>
        <Header title="Stair Challenge" />
        <Link to="/stair-form">Log your stair climb</Link>
        <Route path="/stair-form" component={ StairForm } />
      </div>
    )
  }
}

export default App;
