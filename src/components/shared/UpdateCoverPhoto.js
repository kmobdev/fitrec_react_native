import React from "react";
import { PlaceholderColor, WhiteColor } from "../../Styles";
import { View, Pressable, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const UpdateCoverPhoto = (props) => (
  <View style={styles.coverPhotoView}>
    <Pressable onPress={props.press} style={styles.coverPhotoButton}>
      <Icon style={styles.icon} name="ios-camera" size={22}></Icon>
      <Text style={styles.coverPhotoText}>UPDATE COVER PHOTO</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  coverPhotoView: {
    position: "absolute",
    right: "5%",
    bottom: 5,
  },
  coverPhotoButton: {
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: PlaceholderColor,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: WhiteColor,
  },
  icon: {
    marginRight: 5,
  },
  coverPhotoText: {
    marginTop: 3,
  },
});
