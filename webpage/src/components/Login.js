import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  
  onButtonClickHandler = () => {
    window.alert('Login Successful or Failed (Dont know yet)')
    //Depending on the result edit for successful or failed
  };
  
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
            <button onClick={this.onButtonClickHandler}>Submit</button>
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
