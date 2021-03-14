import React, { Component } from "react";
import { Link } from "react-router-dom";

class Statistics extends Component {
  render() {
    return (
      <div>
        <button>
          <Link to="/Dashboard">Close Statistics</Link>
        </button>
        <h2>Your Statistics Page</h2>
      </div>
    );
  }
}

export default Statistics;
