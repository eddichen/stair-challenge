import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { firebaseApp } from '../../base';
import Header from '../Header';
import './App.css';

const styles = () => ({
  container: {
    paddingTop: 100
  },
  title: {
    textAlign: 'center'
  }
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: null,
      currentMonth: null
    };
  }

  componentDidMount() {
    this.getCurrentMonth();
    this.getUserData();
  }

  getUserData() {
    const db = firebaseApp.firestore();
    const userDetails = [];

    db.collection('users').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        userDetails.push(doc.data());
      });
      this.orderUsers(userDetails);
    });
  }

  getCurrentMonth() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = new Date().getMonth();

    this.setState({
      currentMonth: months[currentMonth]
    });
  }

  orderUsers(userDetails) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (`0${(date.getMonth() + 1)}`).slice(-2);
    const currentMonth = `${year}-${month}`;
    const usersRanked = userDetails;

    // adding an easily accessible monthly total to the user object
    usersRanked.forEach((user) => {
      if (user.climbTotals[currentMonth] !== undefined) {
        user.monthlyTotal = user.climbTotals[currentMonth];
      } else {
        user.monthlyTotal = 0
      }
    });

    // sorting the user in descending order according to climbTotals
    usersRanked.sort((a, b) => b.monthlyTotal - a.monthlyTotal);

    this.setState({
      users: usersRanked
    });
  }

  progressWidth(userTotal = 0) {
    const state = this.state;
    const highestRankTotal = state.users[0].monthlyTotal;
    return { width: `${userTotal / highestRankTotal * 100}%` };
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Header title="Stair Challenge" {...this.props} />
        <Grid container className={classes.container} spacing={16} justify="center">
          <Grid item xs={12} className={classes.title}>
            <Typography variant="h4">
              Leaderboard for {this.state.currentMonth}
            </Typography>
          </Grid>
          {this.state.users !== null ? (
            <Grid item xs={12} md={6} lg={5}>
              {this.state.users.map(user => (
                <Grid container key={user.uid} spacing={16} alignItems="center">
                  <Grid item xs={2} md={1}>
                    <Avatar alt={`${user.name}`} src={user.avatar} />
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <div className="progress">
                      <span style={this.progressWidth(user.monthlyTotal)} />
                    </div>
                    <Typography variant="body1">{user.name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1">{user.monthlyTotal}</Typography>
                    <Typography variant="caption">FLOORS</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Route render={({ history }) => (<Button variant="contained" color="primary" onClick={() => { history.push('/stair-form'); }}>Log your stair climb</Button>)} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
