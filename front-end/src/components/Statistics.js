import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Sessions.css";
import "../App.css";

class Statistics extends Component {
  render() {
    return (
      <div>
         <nav>
              <Link
                 to="/Dashboard"
                 type="button"
                 className="button"
                 style={{ width: "150px", marginBottom: "20px" }}
                >
                  Close Statistics
                </Link>
              </nav>
            <Helmet>
            <style>{"body { background-color: #eef0f1; }"}</style>
            </Helmet>
            <h2 type="text" className="text-header">
                Your Statistics
            </h2>
      </div>
    );
  }
}

export default Statistics;
