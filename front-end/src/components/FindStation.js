import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import https from "https";
import { Helmet } from "react-helmet";
import "./Sessions.css";

class FindStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      stationcity: "",
      sessionList: [],
      flag: "",
      err: "",
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sessionLoop = this.sessionLoop.bind(this);
  }

  sessionLoop() {
    let length = this.state.sessionList.length;
    let list = [];
    for (var i = 0; i < length; i++) {
      list.push(
        "Result No. " +
          (i + 1) +
          ":\n Station ID: " +
          this.state.sessionList[i].StationID +
          ",\n Station Name: " +
          this.state.sessionList[i].StationName +
          ",\n Charge Rate: " +
          this.state.sessionList[i].ChargeRate +
          ",\n Operator: " +
          this.state.sessionList[i].Operator +
          ",\n Country: " +
          this.state.sessionList[i].Country +
          ",\n City: " +
          this.state.sessionList[i].City +
          ",\n Street: " +
          this.state.sessionList[i].Street +
          ",\n Postal Code: " +
          this.state.sessionList[i].PostalCode
      );
    }
    return list;
  }

  handleClick(e) {
    let [firstPart, secondPart] = this.state.stationcity.split(" ");
    let url = "/FindStation/";
    if (secondPart === undefined) {
      url = url + firstPart;
    } else {
      url = url + firstPart + "-" + secondPart;
    }

    window.history.replaceState(null, "Query Result", url);
    axios
      .get("https://localhost:8765/evcharge/api" + url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((response) => {
        this.setState({ err: "ok" });
        this.setState({ flag: "true" });
        this.setState({ sessionList: response.data });
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          this.setState({ err: error.response.data });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          this.setState({ err: error.request });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          this.setState({ err: error.message });
        }
      });
  }

  handleChange(e) {
    this.setState({ stationcity: e.target.value });
  }

  render() {
    return (
      <div>
        <Helmet>
          <style>{"body { background-color: #eef0f1; }"}</style>
        </Helmet>
        <h1 type="text" className="text-header">
          Find Station Screen
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
        <h4 type="text" className="text-body">
          Specify City
        </h4>
        <form onSubmit={this.handleSubmit}>
          <label type="text" className="text-body">
            City:
            <input
              type="input"
              className="input"
              stationcity={this.state.stationcity}
              onChange={this.handleChange}
            />
          </label>

          <button
            type="button"
            className="submit-button"
            onClick={this.handleClick}
          >
            {" "}
            Proceed{" "}
          </button>
        </form>
        {this.state.err === "ok" ? (
          <div>
            <h5
              type="text"
              className="text-header"
              style={{ fontWeight: "bold", marginBottom: "15px" }}
            >
              Query Results:
            </h5>
            {
              <pre>
                {this.sessionLoop().map((value, index) => {
                  return (
                    <li
                      key={index}
                      type="text"
                      className="text-body"
                      style={{ fontSize: "16px" }}
                    >
                      {value}
                    </li>
                  );
                })}
              </pre>
            }
          </div>
        ) : (
          <p type="text" className="text-body" style={{ fontWeight: "bold" }}>
            {this.state.err}
          </p>
        )}
      </div>
    );
  }
}

export default FindStation;
