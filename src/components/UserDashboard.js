import React, { Component } from 'react';
import { firebaseApp, auth } from '../base';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Header from "./Header";
import Chart from "./Chart";

const styles = () => ({
  container: {
    paddingTop: 100
  }
})

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
    const {classes} = this.props;

    return(
      <div>
        <Header title="Dashboard" />
        {this.state.googleUser ?
          (<Grid container className={classes.container} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h4">{this.state.googleUser.displayName}</Typography>
            </Grid>
            <Grid item xs={12}>
              {this.state.chartData !== null ? (<Chart chartData={this.state.chartData}  />) : null }
            </Grid>
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Floors</TableCell>             
                  </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.climbs !== null ? (this.state.climbs.map((climb, index) => (
                      <TableRow key={index}>
                        <TableCell>{climb.date}</TableCell> 
                        <TableCell>{this.calcDailyFloorCount(climb.floors)}</TableCell> 
                      </TableRow>
                    ))) : null }  
                </TableBody>
              </Table>
            </Grid>
          </Grid>)
          :
          (<Grid container className={classes.container} spacing={16}>>
            <Grid item>
              <Button variant="contained" color="primary" onClick={this.signIn}>Login</Button>
            </Grid>
          </Grid>)
        }
      </div>
    )
  }
}

export default withStyles(styles)(UserDashboard);