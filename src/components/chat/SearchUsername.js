import React from "react";
import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";
import { BlackColor, PlaceholderColor, SignUpColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";

export const SearchUsername = (props) => (
  <View>
    <Icon
      name="ios-search"
      size={24}
      color={PlaceholderColor}
      style={[styles.searchBarIcon, styles.searchBarIconLeft]}
    />
    <TextInput
      style={styles.searchTextInput}
      placeholder={props.ph ? props.ph : "Search for people"}
      value={props.value}
      onFocus={props.onFocus}
      onChangeText={props.change}
      onBlur={props.blur}
    />
    {props.close !== undefined && props.value === "" ? (
      <Pressable
        onPress={props.close}
        style={[styles.searchBarIcon, styles.searchBarIconRight]}>
        <Text style={{ color: SignUpColor, marginTop: 3 }}>Close</Text>
      </Pressable>
    ) : (
      <Pressable
        onPress={props.clean}
        style={[styles.searchBarIcon, styles.searchBarIconRight]}>
        <Icon name="md-close" size={24} color={SignUpColor} />
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  searchBarIcon: {
    position: "absolute",
    top: 8,
  },
  searchBarIconLeft: {
    left: 10,
  },
  searchBarIconRight: {
    right: 10,
  },
  searchTextInput: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingStart: 20,
    paddingEnd: 20,
    borderBottomColor: PlaceholderColor,
    textAlign: "center",
    height: 40,
    color: BlackColor,
  },
});
