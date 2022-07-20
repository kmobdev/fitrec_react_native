import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { PlaceholderColor, GlobalStyles } from "../../Styles";
import { GlobalCheckBox } from "../shared/GlobalCheckBox";

export const CheckBox = (props) => (
  <View
    style={[GlobalStyles.viewSection, styles.displayComboBox, props.stylesView]}
  >
    <Text style={[styles.textLabel, props.stylesText]}>{props.title}</Text>
    <GlobalCheckBox
      onPress={props.onPress}
      isCheck={props.value ? true : false}
      title="Yes"
    />
    <GlobalCheckBox
      onPress={props.onPress}
      isCheck={!props.value ? true : false}
      title="No"
    />
  </View>
);

const styles = StyleSheet.create({
  displayComboBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 10,
    color: PlaceholderColor,
  },
});
