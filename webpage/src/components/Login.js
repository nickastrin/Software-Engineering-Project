import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <nav>
          <button>
            <Link to="/MainPage">Return Home</Link>
          </button>
        </nav>
      </div>
    );
  }
}

export default Login;
