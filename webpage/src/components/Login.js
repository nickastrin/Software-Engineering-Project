import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <nav>
            <form>
          <label>
            <p>Username</p>
            <input type="text" />
          </label>
          <label>
            <p>Password</p>
            <input type="password" />
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
          <button>
            <Link to="/MainPage">Return Home</Link>
          </button>
        </nav>
      </div>
    );
  }
}

export default Login;
