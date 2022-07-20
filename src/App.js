import React, { Component } from "react";
import SelectRoutes from "./routes/SelectRoutes";
import { Provider } from "react-redux";
import store from "./redux/Store";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";

import OneSignal from "react-native-onesignal";
import { LogBox } from "react-native";

export default class App extends Component {
  constructor(props) {
    super(props);
    LogBox.ignoreAllLogs(true);
    // OneSignal.init('8ca46953-1fae-474e-85e6-fe65e7ca2523');
    // OneSignal.inFocusDisplaying(2);
  }

  render() {
    return (
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />
        <SelectRoutes />
      </Provider>
    );
  }
}
