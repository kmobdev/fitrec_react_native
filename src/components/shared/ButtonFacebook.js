import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { WhiteColor, FacebookColor } from "../../Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const ButtonFacebook = (props) => (
  <Pressable
    style={[
      styles.roundButton,
      styles.facebookButton,
      !props.login && { borderRadius: 5, width: "90%" },
    ]}
    onPress={props.onPress}
  >
    <FontAwesome
      name="facebook"
      color={WhiteColor}
      size={!props.login ? 18 : 22}
    />
    <Text style={styles.facebookText}>{props.title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  facebookButton: {
    backgroundColor: FacebookColor,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  facebookText: {
    fontSize: 16,
    color: WhiteColor,
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
