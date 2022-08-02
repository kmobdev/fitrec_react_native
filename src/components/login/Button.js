import React from "react";

import { Text, Pressable, StyleSheet } from "react-native";

import { GreenFitrecColor, WhiteColor } from "../../Styles";

import Icon from "react-native-vector-icons/Ionicons";

const Button = (props) => {
  const { onPress, title } = props;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.roundButton, styles.loginButton]}
    >
      <Text style={styles.loginText}>{title}</Text>
      <Icon name="arrow-forward" color={GreenFitrecColor} size={22} />
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  roundButton: {
    width: "95%",
    borderRadius: 50,
    justifyContent: "center",
    backgroundColor: WhiteColor,
    alignItems: "center",
    height: 40,
  },
  loginText: {
    color: GreenFitrecColor,
    marginRight: 5,
  },
});
