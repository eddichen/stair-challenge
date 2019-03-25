import React, { Component } from 'react';
import { firebaseApp } from '../base';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Header from "./Header";

const styles = () => ({
  container: {
    paddingTop: 100
  }
})

class App extends Component {
  constructor() {
    super()

    this.state = {
      users: []
    }
  }

  getUserData() {
    const db = firebaseApp.firestore();

    db.collection("users").get().then((querySnapshot) => {
      let userDetails = []

      querySnapshot.forEach(doc => {
        userDetails.push(doc.data())
      })

      this.setState({
        users: userDetails
      })
    })
  }

  componentDidMount() {
    this.getUserData()
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Header title="Stair Challenge" {...this.props} />
        <Grid container className={classes.container} justify="center">
          <Route render={({history}) => (          
            <Button variant="contained" color="primary" onClick={() => {history.push('/stair-form')}}>Log your stair climb</Button>
          )} />
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(App);
