import React, { Component } from 'react';
import { firebaseApp, auth } from '../base';
import { Route } from 'react-router-dom';
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
import Chart from "./Chart/Chart";

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

  getClimbData() {
    const db = firebaseApp.firestore();
    const uid = this.state.googleUser.uid;

    db.collection("users").get().then((user) => {
      user.docs.forEach(user => {
        if(user.id === uid) {
          let userClimbs = user.data().climbs.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
          })

          this.setState({
            climbs: userClimbs
          })
        }
      })
    })
  }

  calcDailyFloorCount(climbs) {
    return climbs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    })
  }

  separateDataFromLabels(dataSet) {
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

  signOut(history) {
    if(auth.currentUser) {
      auth.signOut();
      history.push('/');
    }
  }

  formatDate(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let newDate = new Date(date);
    return `${days[newDate.getDay()]} ${newDate.getDate()} ${months[newDate.getMonth()]}`
  }

  componentDidMount() {
    auth.onAuthStateChanged((googleUser) => {
      if (googleUser) {
        this.setState({ googleUser });
        this.getClimbData();
      } 
    });
  }

  componentDidUpdate() {
    if(this.state.climbs !== null && this.state.chartData === null) {
      this.separateDataFromLabels(this.state.climbs)
    }
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
              <Typography variant="h5">History</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Floors</TableCell>
                    <TableCell>Climbs</TableCell>             
                  </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.climbs !== null ? (this.state.climbs.map((climb, index) => (
                      <TableRow key={index}>
                        <TableCell>{this.formatDate(climb.date)}</TableCell> 
                        <TableCell>{this.calcDailyFloorCount(climb.floors)}</TableCell>
                        <TableCell>{climb.floors.length}</TableCell>
                      </TableRow>
                    ))) : null }  
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Route render={({history}) => (          
                  <Button variant="contained" color="primary" onClick={() => {history.push('/stair-form')}}>Log your stair climb</Button>
                )} />
                <Route render={({history}) => (          
                  <Button variant="contained" color="primary" onClick={() => this.signOut(history) }>Log out</Button>
                )} />
              </Grid>
            </Grid>
          </Grid>)
          :
          (<Grid container className={classes.container} spacing={16}>
            <Grid item>
              <Typography variant="body1">Please log in to see your dashboard</Typography>
            </Grid>
          </Grid>)
        }
      </div>
    )
  }
}

export default withStyles(styles)(UserDashboard);