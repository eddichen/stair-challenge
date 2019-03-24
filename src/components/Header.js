import React, { Component } from 'react';
import {firebaseApp, auth, provider} from '../base';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

class Header extends Component {
  constructor() {
    super()

    this.state = {
      googleUser: null
    }
  }

  signIn() {
    auth.signInWithRedirect(provider);
  }

  componentDidMount() {
    auth.onAuthStateChanged((googleUser) => {
      if (googleUser) {
        this.setState({ googleUser });
      } 
    });
  }

  render() {
    return(
      <AppBar>
        <Toolbar>
          <Grid container justify="space-between">
            <Typography variant="h6" color="inherit">{ this.props.title }</Typography>

            {this.state.googleUser ?
              (<div>
                <Avatar alt={`${this.state.googleUser.displayName}`} src={this.state.googleUser.photoURL} />
              </div>) 
              :
              (<Button variant="contained" color="secondary" onClick={this.signIn}>Login</Button>)
            }
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header;