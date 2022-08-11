import { createClient } from "@segment/analytics-react-native";
import { DEBUG } from "../Constants";

/*
 * docs for Segment: https://segment.com/docs/connections/sources/catalog/libraries/mobile/react-native/
 */

export const initSegment = () => {
  return createClient({
    writeKey: "0rhZPc61Cf2A3B09SFqdhrDydbUr0DBT",
    trackAppLifecycleEvents: true,
    debug: DEBUG, // hard code to false for now but can set to true to turn off dev events
  });
};
