import React, { Component } from 'react';
import {firebaseApp, auth, provider} from '../base';
import Header from "./Header";

class StairForm extends Component {
  constructor() {
    super();

    this.state = {
      googleUser: null,
      floors: 0,
      date: this.getDefaultDate(),
      climbs: null
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }  

  componentDidMount() {
    auth.onAuthStateChanged((googleUser) => {
      if (googleUser) {
        this.setState({ googleUser });
        this.getUserData();
      } 
    });
  }

  getUserData() {
    const db = firebaseApp.firestore();
    const uid = this.state.googleUser.uid;

    db.collection("users").doc(uid).get().then((user) => {
        const climbData = [];
        const userClimbs = user.data().climbs;
        if(userClimbs) {
          userClimbs.forEach(climb => {
            climbData.push({ 
              date: climb.date,
              floors: [...climb.floors]
            })
          })
        }

        this.setState({
          climbs: climbData
        })
    })
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

  updateClimbs(climbsState) {
    if(climbsState) {
      if(climbsState.find(climb => climb.date === this.state.date)) {
        climbsState.forEach(climb => {
          if(climb.date === this.state.date) {
            climb.floors.push(parseInt(this.state.floors))
          }
        })
      } else {
        climbsState.push({
          date: this.state.date,
          floors: [parseInt(this.state.floors)]
        })
      }
    } else {
      climbsState = [{
        date: this.state.date,
        floors: [parseInt(this.state.floors)]
      }]
    }

    this.setState({
      climbs: climbsState
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.floors === 0) {
      return;
    }

    this.updateClimbs(this.state.climbs)

    const db = firebaseApp.firestore();

    db.collection("users").doc(this.state.googleUser.uid).set({
      uid: this.state.googleUser.uid,
      name: this.state.googleUser.displayName,
      climbs: this.state.climbs
    })

    this.props.history.push("/user-dashboard");
  }

  render() {
    return (
      <div>
        <Header title="Log" />
        {this.state.googleUser ?
          (<div>
            <h1>Hi {this.state.googleUser.displayName},</h1>
            <form className="form" action="" onSubmit={this.handleSubmit}>
              <label htmlFor="floors">How many floors have you climbed?</label>
              <input type="number" id="floors" name="floors" max="8" min="1" onChange={this.handleChange} value={this.state.floors} required />
              <label htmlFor="">When did you do this?</label> 
              <input type="date" id="date" name="date" value={this.state.date} onChange={this.handleChange} required />
              <button type="submit">Submit</button>
            </form>
          </div>)
        :
          (<div>
            <h1>Hey there,</h1>
            <p>To get started, log in with your Google account to log your stair climb</p>
            <button type="button" onClick={this.signIn}>Login</button>
          </div>)
        }
      </div>
    )
  }
}

export default StairForm;