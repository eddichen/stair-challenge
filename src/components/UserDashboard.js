import React, { Component } from 'react';
import { firebaseApp, auth } from '../base';

class UserDashboard extends Component {
  constructor() {
    super();

    this.state = {
      googleUser: null,
      climbs: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((googleUser) => {
      if (googleUser) {
        this.setState({ googleUser });
        this.getClimbData();
      } 
    });
  }

  getClimbData() {
    const db = firebaseApp.firestore();
    const uid = this.state.googleUser.uid;

    db.collection("users").doc(uid).get().then((user) => {
      this.setState({
        climbs: user.data().climbs
      })
    })
  }

  calcDailyFloorCount(climbs) {
    return climbs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    })
  }

  render() {
    return(
      <div>
        <h1>Dashboard</h1>
        {this.state.googleUser ?
          (<div>
          <h2>Hi {this.state.googleUser.displayName}</h2>
          <table>
            <thead>
              <tr>
                <td>Date</td>
                <td>Floors</td>             
              </tr>
            </thead>
            <tbody>
                {this.state.climbs !== null ? (this.state.climbs.map((climb, index) => (
                  <tr key={index}>
                    <td>{climb.date}</td> 
                    <td>{this.calcDailyFloorCount(climb.floors)}</td> 
                  </tr>
                ))) : null }  
            </tbody>
          </table>
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

export default UserDashboard;