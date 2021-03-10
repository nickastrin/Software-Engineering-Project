import axios from "axios";
import React, { Component } from "react";
import DatePicker from "react-date-picker";
import https from "https";

class SessionsPerStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      stationid: 0,
      pointid: 0,
      chargingSessions: 0,
      operator: "",
      periodFrom: "",
      periodTo: "",
      sessionList: [],
    };

    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeEndDate = this.changeEndDate.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleChangeStation = this.handleChangeStation.bind(this);
    this.handleChangePoint = this.handleChangePoint.bind(this);
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
          ":\n SessionID: " +
          this.state.sessionList[i].SessionID +
          ",\n Session Index: " +
          this.state.sessionList[i].SessionIndex +
          ",\n Started On: " +
          this.state.sessionList[i].StartedOn +
          ",\n Finished On: " +
          this.state.sessionList[i].FinishedOn +
          ",\n Payment: " +
          this.state.sessionList[i].Payment +
          ",\n Protocol: " +
          this.state.sessionList[i].Protocol +
          ",\n Vehicle Type: " +
          this.state.sessionList[i].VehicleType +
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
      "/SessionsPerPoint/" +
      this.state.stationid +
      "-" +
      this.state.pointid +
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
        this.setState({
          chargingSessions: response.data.NumberOfChargingSessions,
        });
        this.setState({ operator: response.data.PointOperator });
        this.setState({ periodFrom: response.data.PeriodFrom });
        this.setState({ periodTo: response.data.PeriodTo });
        this.setState({ sessionList: response.data.ChargingSessionsList });
      });
  }

  handleChangeStation(e) {
    this.setState({ stationid: e.target.value });
  }

  handleChangePoint(e) {
    this.setState({ pointid: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Point Session Screen</h1>
        <h2>Choose Station ID</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            StationID:
            <input
              type="text"
              stationid={this.state.stationid}
              onChange={this.handleChangeStation}
            />
          </label>
        </form>
        <h4>Choose Point ID</h4>
        <form onSubmit={this.handleSubmit}>
          <label>
            PointID:
            <input
              type="text"
              pointid={this.state.pointid}
              onChange={this.handleChangePoint}
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
        {this.state.operator !== "" ? (
          <div>
            <h5>Search Results:</h5>
            <p>
              Point: {this.state.stationid} - {this.state.pointid}
            </p>
            <p>Number of Charging Sessions: {this.state.chargingSessions}</p>
            <p>Operator Name: {this.state.operator}</p>
            <p>Period From: {this.state.periodFrom}</p>
            <p>Period To: {this.state.periodTo}</p>
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
          <p></p>
        )}
      </div>
    );
  }
}

export default SessionsPerStation;
