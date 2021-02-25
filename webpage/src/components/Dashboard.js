import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import Statistics from "./Statistics";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Dashboard Page</h1>
        <BrowserRouter>
          <nav>
            <button>
              <Link to="/Dashboard/Statistics">Statistics</Link>
            </button>
          </nav>

          <Switch>
            <Route path="/Dashboard/Statistics">
              <Statistics />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Dashboard;
