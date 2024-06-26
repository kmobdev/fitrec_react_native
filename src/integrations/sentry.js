import * as Sentry from "@sentry/react-native";
import { APP_VERSION, DEBUG, SENTRY_DNS } from "../Constants";

/*
 * docs for Sentry: https://docs.sentry.io/platforms/javascript/configuration/options/
 * can test out with calling: Sentry.nativeCrash();
 */

export const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_DNS,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    tracesSampleRate: 1.0,
    enableNative: true,
    debug: DEBUG,
    enabled: true,
    environment: DEBUG ? "development" : "production",
    release: APP_VERSION,
  });
};
