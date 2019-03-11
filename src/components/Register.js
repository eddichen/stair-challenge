import React, { Component } from 'react';
import base from "../base"

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      users: []
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.ref = base.syncState(`users`, {
      context: this,
      state: 'users',
      asArray: true
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  handleSubmit(event) {
    event.preventDefault()
    const newUser = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value
    }
    this.addUser(newUser);
    event.currentTarget.reset();
  }

  addUser(newUser) {
    const users = this.state.users;
    users.push(newUser);
    this.setState({ users });
  }

  render() {
    return(
      <div>
        {/* <form className="form" action="" onSubmit={this.handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" onChange={this.handleInputChange} required />
          <label htmlFor="floors">Floors:</label>
          <input type="number" name="floors" id="floors" onChange={this.handleInputChange} required />
          <label htmlFor="date">Date:</label>
          <input type="date" name="date" id="date" onChange={this.handleInputChange} required />
          <button type="submit">Submit</button>
        </form> */}
        <h1>register</h1>
        <form className="form" action="" onSubmit={this.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" ref={firstName => { this.firstName = firstName;}} required />
          <label htmlFor="lastName">Last Name</label> 
          <input type="text" id="lastName" name="lastName" ref={lastName => { this.lastName = lastName;}} required />
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" ref={email => { this.email = email;}} required />
          <button type="submit">Register</button>
        </form>
      </div>
    )
  }
}

export default Register;