import React, { Component } from 'react';
import { firebaseApp, auth } from '../base';
import Chart from "./Chart";

class UserDashboard extends Component {
  constructor() {
    super();

    this.state = {
      googleUser: null,
      climbs: null,
      chartData: null,
      chartLabels: null
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
      }, 
      this.separateDataFromLabels)
    })
  }

  calcDailyFloorCount(climbs) {
    return climbs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    })
  }

  separateDataFromLabels() {
    const dataSet = this.state.climbs;
    let labels = [];
    let floors = [];

    dataSet.forEach(entry => {
      labels.push(entry.date);
      floors.push(this.calcDailyFloorCount(entry.floors));
    })

    this.setState({
      chartLabels: labels,
      chartData: floors
    })
  }

  render() {
    return(
      <div>
        <h1>Dashboard</h1>
        {this.state.googleUser ?
          (<div>
          <h2>Hi {this.state.googleUser.displayName}</h2>
          {this.state.chartData !== null ? (<Chart chartLabels={this.state.chartLabels} chartData={this.state.chartData}  />) : null }
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