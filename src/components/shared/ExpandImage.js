import React from "react";
import { StyleSheet, Dimensions, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { SignUpColor, WhiteColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";

export const ExpandImage = (props) =>
  props.show ? (
    <>
      <FastImage
        style={styles.container}
        source={{
          uri: props.image,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Pressable onPress={props.close} style={styles.icon}>
        <Icon name="close" color={WhiteColor} size={32} />
      </Pressable>
    </>
  ) : null;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  icon: {
    position: "absolute",
    top: 50,
    right: 30,
    backgroundColor: SignUpColor,
    borderRadius: 100,
    width: 35,
    height: 35,
    alignItems: "center",
  },
});
