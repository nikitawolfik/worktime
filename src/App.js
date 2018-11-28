import React, { Component } from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import Home from "./components/Home/Home";
import Time from "./components/Time/Time";
import Layout from "./hoc/Layout/Layout";

class App extends Component {
  state = {
    startHour: 9,
    startMinute: 0,
    lengthHour: 8,
    lengthMinute: 0,
    hoursDone: 0,
    secondsDone: 0,
    lunchValue: 0,
    hoursTotal: 9,
    minutesTotal: 0,
    startDate: null,
    currentDate: null,
    name: null,
    lunch: false
  };
  createCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };
  readCookie = name => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  onClearName = () => {
    this.eraseCookie("Name");
    this.forceUpdate();
  };
  eraseCookie = name => {
    this.createCookie(name, "", -1);
  };
  nameChangedHandler = e => {
    const name = e.target.value;
    this.setState({
      name
    });
  };
  onEnterName = e => {
    e.preventDefault();
    const value = this.state.name;
    this.createCookie("Name", value, 100);
    this.forceUpdate();
  };
  getDate = () => {
    const currentDate = new Date();
    const c = currentDate;
    const startDate = new Date(
      c.getFullYear(),
      c.getMonth(),
      c.getDate(),
      this.state.startHour,
      this.state.startMinute,
      0,
      0
    );
    this.setState({ currentDate, startDate });
  };
  handleCookies = (
    lengthHour,
    lengthMinute,
    startHour,
    startMinute,
    lunchValue
  ) => {
    console.log(lengthHour, lengthMinute, startHour, startMinute, lunchValue);
    const lunch = lunchValue === 1 ? true : false;
    const hoursTotal = lengthHour + lunchValue + lengthMinute / 60;
    const minutesTotal = lengthMinute;
    this.setState({
      startMinute,
      startHour,
      lengthMinute,
      lengthHour,
      lunchValue,
      lunch,
      hoursTotal,
      minutesTotal
    });
  };
  createCookies = () => {
    this.createCookie("startHour", this.state.startHour, 7);
    this.createCookie("startMinute", this.state.startMinute, 7);
    this.createCookie("lengthHour", this.state.lengthHour, 7);
    this.createCookie("lengthMinute", this.state.lengthMinute, 7);
    this.createCookie("lunchValue", this.state.lunchValue, 7);
  };
  calculate = () => {
    const currentDate = new Date();
    const { startDate } = this.state;
    const secondsDone = (currentDate - startDate) / 1000;
    const hoursDone = +(secondsDone / 3600).toFixed(3);
    this.setState({ secondsDone, hoursDone });
  };
  handleButton = () => {
    this.getDate();
    this.calculate();
    const name = this.state.name ? this.state.name : "Stranger";
    if (!this.readCookie("Name")) {
      this.createCookie("Name", name, 7);
    }
    this.props.history.push("/time#intro");
  };

  handleSubmit = ({
    startHour,
    startMinute,
    lengthHour,
    lengthMinute,
    lunch
  }) => {
    startHour = isNaN(startHour) ? 0 : startHour;
    startMinute = isNaN(startMinute) ? 0 : startMinute;
    lengthHour = isNaN(lengthHour) ? 0 : lengthHour;
    lengthMinute = isNaN(lengthMinute) ? 0 : lengthMinute;
    const lunchValue = lunch ? 1 : 0;
    const hoursTotal = lengthHour + lunchValue + lengthMinute / 60;
    const minutesTotal = lengthMinute;
    this.setState(
      {
        startMinute,
        startHour,
        lengthMinute,
        lengthHour,
        lunch,
        lunchValue,
        hoursTotal,
        minutesTotal
      },
      () => {
        this.getDate();
        this.createCookies();
        this.calculate();
        const name = this.state.name ? this.state.name : "Stranger";
        if (!this.readCookie("Name")) {
          this.createCookie("Name", name, 7);
        }
        this.props.history.push("/time#intro");
      }
    );
  };
  componentDidMount() {}
  render() {
    const startHour = this.readCookie("startHour");
    const startMinute = this.readCookie("startMinute");
    const lengthHour = this.readCookie("lengthHour");
    const lengthMinute = this.readCookie("lengthMinute");
    const lunchValue = this.readCookie("lunchValue");
    const cookie =
      startHour && startMinute && lengthHour && lengthMinute && lunchValue;
    //this.eraseCookie('Name')
    const myHome = props => {
      return (
        <Home
          handleButton={this.handleButton}
          onClearName={this.onClearName}
          readCookie={this.readCookie}
          nameChangedHandler={this.nameChangedHandler}
          onEnterName={this.onEnterName}
          onEnterHours={this.onEnterHours}
          onEnterLength={this.onEnterLength}
          handleSubmit={this.handleSubmit}
          {...this.state}
          {...props}
        />
      );
    };
    const myTime = props => {
      return (
        <Time
          handleCookies={this.handleCookies}
          readCookie={this.readCookie}
          eraseCookie={this.eraseCookie}
          onClearName={this.onClearName}
          onEnterHours={this.onEnterHours}
          onEnterLength={this.onEnterLength}
          getDate={this.getDate}
          calculate={this.calculate}
          {...this.state}
          {...props}
        />
      );
    };

    let redirect = () => <Redirect to="/time" />;
    if (!this.readCookie("startHour")) {
      redirect = () => <Redirect to="/home" />;
    }
    return (
      <div>
        <Layout cookie={cookie}>
          <Switch>
            <Route path="/home" render={myHome} />
            {cookie && <Route path="/time" render={myTime} />}
            <Route render={redirect} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
