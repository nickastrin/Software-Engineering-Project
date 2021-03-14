import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import { Helmet } from "react-helmet";
import "./Sessions.css";
import "../App.css";

function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    axios
      .post("https://localhost:8765/evcharge/api/login", {
        username: userName,
        password: password,
      })
      .then((response) => {
        // if successfull login
        setAuthTokens(response.data.token); //AuthTokens=token provided
        console.log("Token provided is:\n" + response.data.token);
        setLoggedIn(true);
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Helmet>
        <style>{"body { background-color: #eef0f1; }"}</style>
      </Helmet>
      <h1 type="text" className="text-header">
        Login
      </h1>
      <nav>
        <Link
          to="/"
          type="button"
          className="button-menu"
          style={{ width: "150px", marginBottom: "20px" }}
        >
          Return Home
        </Link>
      </nav>
      <div>
        <form>
          <input
            type="username"
            className="input"
            style={{ marginTop: "10px", marginBottom: "10px" }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="Username"
          />
          <br></br>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
          <button
            type="button"
            className="submit-button"
            onClick={(e) => {
              e.preventDefault();
              postLogin();
            }}
          >
            Login
          </button>
        </form>
        {isError && (
          <div
            type="text"
            className="text-body"
            style={{ marginTop: "15px", fontWeight: "bold" }}
          >
            The username or password provided were incorrect!
          </div>
        )}
      </div>
    </div>
  );
}
export default Login;
