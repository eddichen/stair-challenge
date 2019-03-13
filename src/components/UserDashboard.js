import React, { Component } from 'react';
import {firebaseApp, auth, provider} from '../base';

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
        this.getUserData();
      } 
    });
  }

  getUserData() {
    const db = firebaseApp.firestore();
    const uid = this.state.googleUser.uid;

    db.collection("users").where("uid", "==", uid).get().then((climbs) => {
        const climbData = [];
        climbs.forEach((climb) => {
          const climbDate = climb.data().date;
          climbData.push({ 
            [climbDate]: [{
              floors: parseInt(climb.data().floors)
            }]
          })
        })

        this.setState({
          climbs: climbData
        })
        console.log(this.state.climbs);
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
                {/* {this.state.climbs !== null ? (this.state.climbs.map(date => (
                  <tr key={date}>
                    <td>{date}</td> 
                    <td>{this.state.climbs[date].floors}</td> 
                  </tr>
                ))) : null }   */}
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