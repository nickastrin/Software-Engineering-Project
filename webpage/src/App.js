import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./App.css";

import MainPage from "./components/MainPage";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
          <Route path="/">
            <MainPage />
            <nav>
              <button>
                <Link to="/Login">Login</Link>
              </button>
              <button>
                <Link to="/Dashboard">Profile</Link>
              </button>
            </nav>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
