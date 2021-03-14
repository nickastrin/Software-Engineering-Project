import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Sessions.css";
import "../App.css";
import Statistics from "./Statistics";

class Dashboard extends Component {
  render() {
    return (
      <div>
      <Helmet>
        <style>{"body { background-color: #eef0f1; }"}</style>
      </Helmet>
      <h1 type="text" className="text-header">
          Dashboard Page
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
        <BrowserRouter>
          <Switch>
            <Route path="/Dashboard/Statistics">
              <Statistics />
            </Route>
            <Route path="/">
              <nav>
              <Link
                 to="/Dashboard/Statistics"
                 type="button"
                 className="button-menu"
                 style={{ width: "150px", marginBottom: "20px" }}
                >
                  Statistics
                </Link>
              </nav>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Dashboard;
