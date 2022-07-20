import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { GreenLightFitrecColor } from "../../Styles";

export const LoadingSpinner = (props) => {
  return props.visible ? (
    <View style={styles.Content}>
      <View style={styles.View}>
        <ActivityIndicator
          size="large"
          color={GreenLightFitrecColor}
          style={styles.ActivityIndicator}
        />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  Content: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  View: {
    backgroundColor: "#000",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
  },
  ActivityIndicator: {
    padding: 25,
    zIndex: 10,
  },
});
