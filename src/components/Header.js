import React, { Component } from 'react';
import {firebaseApp, auth, provider} from '../base';

class Header extends Component {
  constructor() {
    super()

    this.state = {
      googleUser: null
    }
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
      <div>
        <h1>{ this.props.title }</h1>

        {this.state.googleUser ?
          (<button type="button" onClick={this.signOut}>Log out</button>) 
          :
          (<button type="button" onClick={this.signIn}>Login</button>)
        }
      </div>
    )
  }
}

export default Header;