import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { PlaceholderColor, GlobalStyles } from "../../Styles";

export const InputTextArea = (props) => (
  <View style={GlobalStyles.viewSection}>
    <Text style={[styles.textLabel, { top: 10 }]}>{props.title}</Text>
    <TextInput
      style={[styles.textInput, styles.inputTextArea]}
      multiline={true}
      numberOfLines={4}
      textAlign="left"
      placeholder={props.ph}
      placeholderTextColor={PlaceholderColor}
      onChangeText={props.onChange}
      value={props.value}
      onFocus={() => props.onFocus()}
    />
  </View>
);

const styles = StyleSheet.create({
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 10,
    color: PlaceholderColor,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  inputTextArea: {
    paddingStart: "5%",
    paddingEnd: "5%",
    height: 100,
    marginTop: 30,
  },
});
