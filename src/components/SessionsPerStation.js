import axios from "axios";
import React, { Component } from "react";
import DatePicker from "react-date-picker";
import { Link } from "react-router-dom";
import https from "https";

class SessionsPerStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      stationid: 0,
      activePoints: 0,
      chargingSessions: 0,
      operator: "",
      periodFrom: "",
      periodTo: "",
      sessionList: [],
      totalDelivered: 0,
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
          ":\n PointID: " +
          this.state.sessionList[i].PointID +
          ",\n Point Sessions: " +
          this.state.sessionList[i].PointSessions +
          ",\n Energy Delivered: " +
          this.state.sessionList[i].EnergyDelivered +
          " kWh"
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
      "/SessionsPerStation/" +
      this.state.stationid +
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
      .get("https://localhost:8765/evcharge/api" + url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((response) => {
        this.setState({ activePoints: response.data.NumberOfActivePoints });
        this.setState({
          chargingSessions: response.data.NumberOfChargingSessions,
        });
        this.setState({ operator: response.data.Operator });
        this.setState({ periodFrom: response.data.PeriodFrom });
        this.setState({ periodTo: response.data.PeriodTo });
        this.setState({ sessionList: response.data.SessionsSummaryList });
        this.setState({ totalDelivered: response.data.TotalEnergyDelivered });
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
    this.setState({ stationid: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Station Session Screen</h1>
        <nav>
          <button>
            <Link to="/">Return to Home</Link>
          </button>
        </nav>
        <h2>Choose Station ID</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            StationID:
            <input
              type="text"
              stationid={this.state.stationid}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <h4>Choose Start Date</h4>
        <DatePicker
          onChange={this.changeStartDate}
          value={this.state.startDate}
        />
        <h4>Choose End Date</h4>
        <DatePicker onChange={this.changeEndDate} value={this.state.endDate} />
        {this.errorCheck() ? (
          <button onClick={this.handleClick}> Proceed </button>
        ) : (
          <h4>Invalid</h4>
        )}
        {this.state.err === "ok" ? (
          <div>
            <h5>Search Results:</h5>
            <p>Active Points: {this.state.activePoints}</p>
            <p>Number of Charging Sessions: {this.state.chargingSessions}</p>
            <p>Operator Name: {this.state.operator}</p>
            <p>Period From: {this.state.periodFrom}</p>
            <p>Period To: {this.state.periodTo}</p>
            <p>Total Energy Delivered: {this.state.totalDelivered}</p>
            <div>
              Session Summary:
              {
                <pre>
                  {this.sessionLoop().map((value, index) => {
                    return <li key={index}>{value}</li>;
                  })}
                </pre>
              }
            </div>
          </div>
        ) : (
          <p>{this.state.err}</p>
        )}
      </div>
    );
  }
}

export default SessionsPerStation;
