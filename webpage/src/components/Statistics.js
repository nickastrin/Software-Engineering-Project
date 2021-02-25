import React, { Component } from "react";
import { Link } from "react-router-dom";

class Statistics extends Component {
  render() {
    return (
      <div>
        <h2>Your Statistics Page</h2>
        <button>
          <Link to="/Dashboard">Close Statistics</Link>
        </button>
      </div>
    );
  }
}

export default Statistics;
