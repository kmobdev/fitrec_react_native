import React, { useState, useEffect } from "react";
import SelectRoutes from "./routes/SelectRoutes";
import { Provider } from "react-redux";
import store from "./redux/Store";
import { LogBox, StatusBar } from "react-native";
import "react-native-gesture-handler";
import * as Sentry from "@sentry/react-native";
import OneSignal from "react-native-onesignal";
import { initSegment } from "./integrations/segment";
import { AnalyticsProvider } from "@segment/analytics-react-native";
import { initSentry } from "./integrations/sentry";
import { PromiseHelperAllSettled } from "./integrations/promise_helper";

OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("8ca46953-1fae-474e-85e6-fe65e7ca2523");

OneSignal.promptForPushNotificationsWithUserResponse((response) => {
  console.log("Prompt response  :", response);
});
LogBox.ignoreAllLogs();

const App = () => {
  const analytics = initSegment();

  useEffect(() => {
    initSentry();

    if (Promise && !Promise.allSettled) {
      Promise.allSettled = PromiseHelperAllSettled;
    }
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <AnalyticsProvider client={analytics}>
        <SelectRoutes />
      </AnalyticsProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);
