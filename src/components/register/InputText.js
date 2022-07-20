import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { PlaceholderColor, GlobalStyles, SignUpColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";

export const InputText = (props) => (
  <View style={GlobalStyles.viewSection}>
    <Text style={styles.textLabel}>{props.title}</Text>
    <TextInput
      style={[
        styles.textInput,
        props.error && styles.paddingExtra,
        props.readonly && { color: PlaceholderColor },
      ]}
      onChangeText={(text) => props.onChange(text)}
      editable={props.readonly ? false : true}
      value={props.value}
      autoCapitalize="none"
      placeholder={props.ph}
      keyboardType={props.type !== undefined ? props.type : "default"}
    />
    {props.error ? (
      <Icon
        name="ios-warning"
        size={16}
        color={SignUpColor}
        style={styles.iconError}
      />
    ) : null}
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
  paddingExtra: {
    paddingRight: "10%",
  },
  iconError: {
    position: "absolute",
    right: "5%",
    bottom: 10,
  },
});
