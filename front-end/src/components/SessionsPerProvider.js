import axios from "axios";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import DatePicker from "react-date-picker";
import https from "https";
import { Helmet } from "react-helmet";
import "./Sessions.css";

class SessionsPerProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      providerid: 0,
      providerName: "",
      sessionList: [],
      err: "",
    };

    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeEndDate = this.changeEndDate.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sessionLoop = this.sessionLoop.bind(this);
  }

  changeStartDate = (e) => {
    this.setState({ startDate: e });
  };

  changeEndDate = (e) => {
    this.setState({ endDate: e });
  };

  errorCheck() {
    return this.state.endDate >= this.state.startDate ? 1 : 0;
  }

  sessionLoop() {
    let length = this.state.sessionList.length;
    let list = [];
    for (var i = 0; i < length; i++) {
      list.push(
        "Session No. " +
          (i + 1) +
          ":\n Station Sessions: " +
          this.state.sessionList[i].StationID +
          ",\n Session ID: " +
          this.state.sessionList[i].SessionID +
          ",\n Vehicle ID: " +
          this.state.sessionList[i].VehicleID +
          ",\n Started On: " +
          this.state.sessionList[i].StartedOn +
          ",\n Finished On: " +
          this.state.sessionList[i].FinishedOn +
          ",\n Price Policy: " +
          this.state.sessionList[i].PricePolicyRef +
          ",\n Cost Per kWh: " +
          this.state.sessionList[i].CostPerKWh +
          " kWh,\n Energy Delivered: " +
          this.state.sessionList[i].ΕnergyDelivered +
          " kWh,\n Total Cost: " +
          this.state.sessionList[i].TotalCost
      );
    }
    return list;
  }

  handleClick(e) {
    e.preventDefault(e);
    // Simple GET request using axios
    let tmpStart = this.state.startDate.toLocaleDateString("en-GB");
    let tmpEnd = this.state.endDate.toLocaleDateString("en-GB");

    let [startDay, startMonth, startYear] = tmpStart.split("/");
    let [endDay, endMonth, endYear] = tmpEnd.split("/");

    let url =
      "/SessionsPerProvider/" +
      this.state.providerid +
      "/" +
      startYear +
      startMonth +
      startDay +
      "/" +
      endYear +
      endMonth +
      endDay;

    window.history.replaceState(null, "Query Result", url);
    axios
      .get(
        "https://localhost:8765/evcharge/api" + url,
        {
          headers: {
            "x-observatory-auth": this.props.token,
          },
        },
        {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      )
      .then((response) => {
        this.setState({ err: "ok" });
        console.log(response.data);
        this.setState({ providerName: response.data.ProviderName });
        this.setState({ sessionList: response.data.Sessions });
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
    this.setState({ providerid: e.target.value });
  }

  render() {
    const token = this.props.token;
    if (token === undefined || token === null) {
      return <Redirect to="/Login" />;
    }
    return (
      <div>
        <Helmet>
          <style>{"body { background-color: #eef0f1; }"}</style>
        </Helmet>
        <h1 type="text" className="text-header">
          Provider Session Screen
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
          Specify Provider ID
        </h4>
        <form onSubmit={this.handleSubmit}>
          <label type="text" className="text-body">
            ProviderID:
            <input
              type="input"
              className="input"
              providerid={this.state.providerid}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <h4 type="text" className="text-body">
          Choose Start Date
        </h4>
        <DatePicker
          type="input"
          className="input-date"
          onChange={this.changeStartDate}
          value={this.state.startDate}
        />
        <h4 type="text" className="text-body">
          Choose End Date
        </h4>
        <DatePicker
          type="input"
          className="input-date"
          onChange={this.changeEndDate}
          value={this.state.endDate}
        />
        {this.errorCheck() ? (
          <button
            type="button"
            className="submit-button"
            onClick={this.handleClick}
          >
            {" "}
            Proceed{" "}
          </button>
        ) : (
          <h4 type="text" className="text-body" style={{ fontWeight: "bold" }}>
            Invalid
          </h4>
        )}
        {this.state.err === "ok" ? (
          <div>
            <h5
              type="text"
              className="text-header"
              style={{ fontWeight: "bold", marginBottom: "15px" }}
            >
              Search Results:
            </h5>
            <p type="text" className="text-body">
              Provider Name: {this.state.providerName}
            </p>
            <div>
              <text
                type="text"
                className="text-header"
                style={{ fontWeight: "bold" }}
              >
                Session Summary:
              </text>
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

export default SessionsPerProvider;
