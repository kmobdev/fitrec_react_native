import { createClient } from "@segment/analytics-react-native";
import { DEBUG, SEGMENT_WRITE_KEY } from "../Constants";

/*
 * docs for Segment: https://segment.com/docs/connections/sources/catalog/libraries/mobile/react-native/
 */

export const initSegment = () => {
  return createClient({
    writeKey: SEGMENT_WRITE_KEY,
    trackAppLifecycleEvents: true,
    debug: DEBUG, // hard code to false for now but can set to true to turn off dev events
  });
};
