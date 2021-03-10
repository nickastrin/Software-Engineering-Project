import axios from "axios";
import React, { Component } from "react";
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
      });
  }

  handleChange(e) {
    this.setState({ stationcity: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Find Station Screen</h1>
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
        {this.state.flag !== "" ? (
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
          <p></p>
        )}
      </div>
    );
  }
}

export default FindStation;
