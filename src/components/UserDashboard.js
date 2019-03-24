import React, { Component } from 'react';
import { firebaseApp, auth } from '../base';
import Chart from "./Chart";

class UserDashboard extends Component {
  constructor() {
    super();

    this.state = {
      googleUser: null,
      climbs: null,
      chartData: null
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
      const sortedDates = user.data().climbs.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      });

      this.setState({
        climbs: sortedDates
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
    let data = [];

    dataSet.forEach(entry => {
      data.push({ 
        date: entry.date,
        floors: this.calcDailyFloorCount(entry.floors)
      });
    })

    this.setState({
      chartData: data
    })
  }

  render() {
    return(
      <div>
        <h1>Dashboard</h1>
        {this.state.googleUser ?
          (<div>
          <h2>Hi {this.state.googleUser.displayName}</h2>
          {this.state.chartData !== null ? (<Chart chartData={this.state.chartData}  />) : null }
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