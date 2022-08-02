import * as Sentry from "@sentry/react-native";

/*
 * docs for Sentry: https://docs.sentry.io/platforms/javascript/configuration/options/
 */

export const initSentry = () => {
	Sentry.init({
		dsn: "https://982cc31971cd4d48ad5ec746c965eda6@o1335969.ingest.sentry.io/6604329",
		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		// We recommend adjusting this value in production.
		tracesSampleRate: 1.0,
		debug: false, // hard code to false for now but can set to true to turn off dev events
	});
}
