import axios from "axios";
import React, { Component } from "react";
import DatePicker from "react-date-picker";
import https from "https";

class SessionsPerProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      providerid: 0,
      providerName: "",
      sessionList: [],
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
      .get("https://localhost:8765/evcharge/api" + url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((response) => {
        console.log(response.data);
        this.setState({ providerName: response.data.ProviderName });
        this.setState({ sessionList: response.data.Sessions });
      });
  }

  handleChange(e) {
    this.setState({ providerid: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Provider Session Screen</h1>
        <h2>Specify Provider ID</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            ProviderID:
            <input
              type="text"
              providerid={this.state.providerid}
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
        {this.state.providerName !== "" ? (
          <div>
            <h5>Search Results:</h5>
            <p>Provider Name: {this.state.providerName}</p>
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

export default SessionsPerProvider;
