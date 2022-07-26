import React, {useState, useEffect} from "react";
import SelectRoutes from "./routes/SelectRoutes";
import { Provider } from "react-redux";
import store from "./redux/Store";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";

import OneSignal from "react-native-onesignal";
import { LogBox } from "react-native";
import { initSegment } from "./integrations/segment";
import { AnalyticsProvider } from "@segment/analytics-react-native";

const App = () => {
  const analytics = initSegment()

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <AnalyticsProvider client={analytics}>
        <SelectRoutes />
      </AnalyticsProvider>
    </Provider>
  );
}

export default App
