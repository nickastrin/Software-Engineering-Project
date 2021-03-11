import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import https from "https";

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
        <h1>Find Station Screen</h1>
        <nav>
          <button>
            <Link to="/">Return to Home</Link>
          </button>
        </nav>
        <h2>Specify City</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            City:
            <input
              type="text"
              stationcity={this.state.stationcity}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <button onClick={this.handleClick}> Proceed </button>
        {this.state.err === "ok" ? (
          <div>
            <h4>Query Results:</h4>
            {
              <pre>
                {this.sessionLoop().map((value, index) => {
                  return <li key={index}>{value}</li>;
                })}
              </pre>
            }
          </div>
        ) : (
          <p>{this.state.err}</p>
        )}
      </div>
    );
  }
}

export default FindStation;
