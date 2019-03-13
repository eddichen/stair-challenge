import React, { Component } from 'react';
import {firebaseApp, auth, provider} from '../base';

class StairForm extends Component {
  constructor() {
    super();

    this.state = {
      googleUser: null,
      floors: 0,
      date: this.getDefaultDate()
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }  

  componentDidMount() {
    auth.onAuthStateChanged((googleUser) => {
      if (googleUser) {
        this.setState({ googleUser });
      } 
    });
  }

  signIn() {
    auth.signInWithRedirect(provider);
  }

  signOut() {
    if(auth.currentUser) {
      auth.signOut();
      window.location.reload(true);
    }
  }

  getDefaultDate() {
    const todaysDate = new Date()
    let day = todaysDate.getDate()
    let month = todaysDate.getMonth() + 1
    const year = todaysDate.getFullYear()

    if(month < 10) month = `0${month}`
    if(day < 10) day = `0${day}`

    return `${year}-${month}-${day}`
  }

  handleChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.floors === 0) {
      return;
    }

    const db = firebaseApp.firestore();
    db.collection("users").add({
      uid: this.state.googleUser.uid,
      name: this.state.googleUser.displayName,
      date: this.state.date,
      floors: this.state.floors
    })
    this.setState({
      floors: 0
    })
    this.props.history.push("/stair-confirmation");
  }

  render() {
    return (
      <div>
        <h1>Stair form</h1>
        {this.state.googleUser ?
          (<div>
            <button type="button" onClick={this.signOut}>Log out</button>
            {/* <img src={this.state.user.photoURL} alt={`${this.state.user.displayName}`} /> */}
            <h1>Hi {this.state.googleUser.displayName}</h1>
            <form className="form" action="" onSubmit={this.handleSubmit}>
              <label htmlFor="floors">How many floors have you climbed?</label>
              <input type="number" id="floors" name="floors" onChange={this.handleChange} value={this.state.floors} required />
              <label htmlFor="">When did you do this?</label> 
              <input type="date" id="date" name="date" value={this.state.date} onChange={this.handleChange} required />
              <button type="submit">Submit</button>
            </form>
          </div>)
        :
          (<div>
            <button type="button" onClick={this.signIn}>Login</button>
          </div>)
        }
      </div>
    )
  }
}

export default StairForm;