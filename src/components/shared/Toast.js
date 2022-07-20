import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { WhiteColor } from "../../Styles";

export const Toast = (props) => {
  return "" !== props.toastText ? (
    <View style={styles.Content}>
      <View style={styles.View}>
        <Text style={styles.Text}>{props.toastText}</Text>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  Content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  View: {
    maxWidth: 200,
    minWidth: 50,
    minHeight: 50,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  Text: {
    color: WhiteColor,
    textAlign: "center",
  },
});
