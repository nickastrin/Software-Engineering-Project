import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import Statistics from "./Statistics";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Dashboard Page</h1>
        <nav>
          <button>
            <Link to="/">Return Home</Link>
          </button>
        </nav>

        <BrowserRouter>
          <Switch>
            <Route path="/Dashboard/Statistics">
              <Statistics />
            </Route>
            <Route path="/">
              <nav>
                <button>
                  <Link to="/Dashboard/Statistics">Statistics</Link>
                </button>
              </nav>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Dashboard;
