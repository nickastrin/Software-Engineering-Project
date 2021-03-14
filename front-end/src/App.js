import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import MainPage from "./components/MainPage";
import Dashboard from "./components/Dashboard";
import SessionsPerStation from "./components/SessionsPerStation";
import SessionsPerPoint from "./components/SessionsPerPoint";
import SessionsPerEV from "./components/SessionsPerEV";
import SessionsPerProvider from "./components/SessionsPerProvider";
import FindStation from "./components/FindStation";
import Login from "./components/Login";
import Companies from "./components/Companies";
import { AuthContext } from "./context/auth";
import "./App.css";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  console.log(existingTokens);
  const [authTokens, setAuthTokens] = useState(existingTokens); // global state variable, hook to update it

  // Creates tokens item in local storage
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data); // authTokens=data
  };
  console.log(authTokens);

  function logOut() {
    console.log("Entering Logout.\n");
    console.log(authTokens);
    axios
      .post(
        "https://localhost:8765/evcharge/api/logout",
        {},
        {
          headers: {
            "x-observatory-auth": authTokens,
          },
        }
      )
      .then((result) => {
        console.log(result.data);
        if (result.status === 200) {
          // if successfull logout
          console.log("Logout Successful.");
        } else {
          //setIsError(true);
          console.log("Error Happened.");
        }
      })
      .catch((e) => {
        console.log("Error 2:" + e.body);
      });
    setAuthTokens(null); //authTokens=null (or undifined ?)
    localStorage.removeItem("tokens"); // Token deleted from local storage
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      {" "}
      {/* Sets the context to authTokens, setAuthTokens*/}
      <div className="wrapper">
        <BrowserRouter>
          <Switch>
            <Route path="/SessionsPerStation">
              <SessionsPerStation token={authTokens} />
            </Route>
            <Route path="/SessionsPerPoint">
              <SessionsPerPoint token={authTokens} />
            </Route>
            <Route path="/SessionsPerProvider">
              <SessionsPerProvider token={authTokens} />
            </Route>
            <Route path="/SessionsPerEV">
              <SessionsPerEV token={authTokens} />
            </Route>
            <Route path="/FindStation">
              <FindStation />
            </Route>
            <Route path="/Companies">
              <Companies token={authTokens} />
            </Route>
            <Route path="/Dashboard">
              <Dashboard />
            </Route>
            <Route path="/Login">
              <Login />
            </Route>
            <Route path="/">
              <MainPage />
              <nav>
                <Link
                  to="/Login"
                  type="button"
                  className="button"
                  style={{ marginBottom: "10px" ,marginTop: "10px" }}
                >
                  Login
                </Link>
                <Link 
                  to="/Dashboard" 
                  type="button" 
                  className="button" 
                  style={{marginTop: "10px", marginBottom: "10px" }} >
                    Profile
                </Link>
                <button 
                  onClick={logOut} 
                  type="button" 
                  className="button"
                  style={{ marginTop: "10px", marginBottom: "10px" }}  >
                  Log out
                </button>
                <br></br>
                <br></br>
                <Link
                  to="/SessionsPerStation"
                  type="button"
                  className="button-menu"
                >
                  Station Session Search
                </Link>
                <Link
                  to="/SessionsPerPoint"
                  type="button"
                  className="button-menu"
                >
                  Point Session Search
                </Link>
                <Link to="/SessionsPerEV" type="button" className="button-menu">
                  EV Session Search
                </Link>
                <Link
                  to="/SessionsPerProvider"
                  type="button"
                  className="button-menu"
                >
                  Provider Session Search
                </Link>
                <Link to="/FindStation" type="button" className="button-menu">
                  Find Station
                </Link>
                <Link to="/Companies" type="button" className="button-menu">
                  Find Manufacturer
                </Link>
              </nav>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
