import React, { Component, useRef } from "react";
import { GlobalStyles, SignUpColor, PlaceholderColor } from "../../Styles";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ReactNativePickerModule from "react-native-picker-module";
import Icon from "react-native-vector-icons/Ionicons";

const SelectCombo = (props) => {

  const picker = useRef();


  return (
    <View
      style={[
        GlobalStyles.viewSection,
        styles.textInput,
        { alignItems: "flex-end" },
      ]}
    >
      <Text style={styles.textLabel}>{props.title}</Text>
      <View
        style={[styles.comboSelect, props.error && styles.paddingExtra]}
      >
        <Pressable
          onPress={() => picker.current.show()}
          style={{ flexDirection: "row" }}
        >
          <Text>
            {null !== props.value
              ? props.textSelect
              : "Select here"}
          </Text>
          <Icon name="chevron-down" size={22} style={styles.iconSelect} />
        </Pressable>
      </View>
      {props.error ? (
        <Icon
          name="ios-warning"
          size={16}
          color={SignUpColor}
          style={styles.iconError}
        ></Icon>
      ) : null}
      <ReactNativePickerModule
        pickerRef={picker}
        title={props.title}
        items={props.items}
        onValueChange={(data) => {
          props.onValueChange(data);
        }}
      />
    </View>
  );
}

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
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
  },
  iconSelect: {
    marginLeft: 10,
    marginTop: -2,
  },
});

export default SelectCombo;