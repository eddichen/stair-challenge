import React, { Component } from 'react';
import { firebaseApp, auth } from '../base';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Header from "./Header";

const styles = () => ({
  container: {
    paddingTop: 100
  }
})

class StairForm extends Component {
  constructor() {
    super();

    this.state = {
      googleUser: null,
      floors: 0,
      date: this.getDefaultDate(),
      climbs: null,
      climbTotals: null,
      submit: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }  

  getUserData() {
    const db = firebaseApp.firestore();
    const uid = this.state.googleUser.uid;

    db.collection("users").get().then((user) => {
      user.docs.forEach(user => {
        if(user.id === uid) {
          const climbData = [];
          const userClimbs = user.data().climbs;
          if(userClimbs) {
            userClimbs.forEach(climb => {
              climbData.push({ 
                date: climb.date,
                floors: [...climb.floors]
              })
            })

            this.setState({
              climbs: climbData
            })
          }

          const climbTotals = user.data().climbTotals;
          console.log(climbTotals);
          if(climbTotals) {
            this.setState({
              climbTotals: climbTotals
            })
          }
        }
      })
    })
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
    if(climbsState !== null) {
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

    //sorting the dates in descending order
    climbsState.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })
    
    return climbsState;
  }

  calculateTotals(climbs) {
    const findMonthYear = /\d{4}-\d{2}/
    const formMonthYear = findMonthYear.exec(this.state.date)

    if(climbs) {
      //filter climbs by the month
      const formMonthClimbs = climbs.filter(climb => {
        const climbMonthYear = findMonthYear.exec(climb.date)
        return climbMonthYear[0] === formMonthYear[0]
      })

      const formMonthFloors = this.sumFloors(formMonthClimbs)
      const allFloors = this.sumFloors(climbs)
      
      return {
        ...this.state.climbTotals,
        all: allFloors,
        [formMonthYear[0]]: formMonthFloors
      }
    } else {
      return {
        ...this.state.climbTotals,
        all: this.state.floors,
        [formMonthYear[0]]: this.state.floors
      }
    }
  }

  sumFloors(climbs) {
    const climbTotals = climbs.reduce((accumulator, currentValue) => {
      return [...accumulator, ...currentValue.floors]
    }, []);

    return climbTotals.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.floors === 0) {
      return;
    }

    this.setState({
      climbs: this.updateClimbs(this.state.climbs),
      climbTotals: this.calculateTotals(this.state.climbs),
      submit: true
    })
  }

  componentDidMount() {
    auth.onAuthStateChanged((googleUser) => {
      if (googleUser) {
        this.setState({ googleUser });
        this.getUserData();
      } 
    });
  }

  componentDidUpdate() {
    if(this.state.submit) {
      const db = firebaseApp.firestore();

      db.collection("users").doc(this.state.googleUser.uid).set({
        uid: this.state.googleUser.uid,
        name: this.state.googleUser.displayName,
        avatar: this.state.googleUser.photoURL,
        climbs: this.state.climbs,
        climbTotals: this.state.climbTotals
      })

      this.props.history.push("/user-dashboard");
    }
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Header title="Log" />
        {this.state.googleUser ?
          (<Grid container className={classes.container} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h4">Hi {this.state.googleUser.displayName},</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Log your individual stair climbs in floors below:</Typography>
            </Grid>
            <Grid item xs={12}>
            <form className="form" action="" onSubmit={this.handleSubmit}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <TextField type="number" id="floors" name="floors" max="8" min="1" label="Floors climbed:" onChange={this.handleChange} value={this.state.floors} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField type="date" id="date" name="date" label="Date:" onChange={this.handleChange} value={this.state.date} required />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">Submit</Button>
                </Grid>
              </Grid>
            </form>
            </Grid>
          </Grid>)
        :
          (<Grid container className={classes.container} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h4">Hey there,</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">To get started, log in with your Google account to log your stair climb</Typography>
            </Grid>
          </Grid>)
        }
      </div>
    )
  }
}

export default withStyles(styles)(StairForm);