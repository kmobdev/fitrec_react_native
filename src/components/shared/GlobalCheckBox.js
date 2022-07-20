import React from "react";
import { View, Image } from "react-native";
import { CheckBox } from "react-native-elements";

export const GlobalCheckBox = (props) => {
  return props.title === null ? (
    <View style={{ marginEnd: -20 }}>
      <CheckBox
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderWidth: 0,
          margin: 0,
        }}
        checkedIcon={<Image source={require("../../assets/checked.png")} />}
        uncheckedIcon={<Image source={require("../../assets/check.png")} />}
        title={props.title}
        onPress={props.onPress}
        checked={props.isCheck}
      />
    </View>
  ) : (
    <View>
      <CheckBox
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderWidth: 0,
          margin: 0,
        }}
        checkedIcon={<Image source={require("../../assets/checked.png")} />}
        uncheckedIcon={<Image source={require("../../assets/check.png")} />}
        title={props.title}
        onPress={props.onPress}
        checked={props.isCheck}
      />
    </View>
  );
};
