import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { WhiteColor, BlackColor, AppleColor } from "../../Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const ButtonApple = (props) => (
  <Pressable
    style={[
      styles.roundButton,
      styles.appleButton,
      !props.login && { borderRadius: 5, width: "90%" },
    ]}
    onPress={props.onPress}
  >
    <FontAwesome
      name="apple"
      color={BlackColor}
      size={!props.login ? 18 : 22}
    />
    <Text style={styles.appleText}>{props.title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  appleButton: {
    backgroundColor: WhiteColor,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  appleText: {
    fontSize: 16,
    color: BlackColor,
    marginLeft: 5,
  },
  roundButton: {
    width: "95%",
    borderRadius: 50,
    justifyContent: "center",
    height: 40,
    fontWeight: "500",
    backgroundColor: WhiteColor,
    alignItems: "center",
  },
});
