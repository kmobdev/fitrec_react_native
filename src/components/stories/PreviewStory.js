import React from "react";
import { StyleSheet, Dimensions, Pressable, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { BlackColor, SignUpColor, WhiteColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import { POST_TYPE_VIDEO } from "../../Constants";

export const PreviewStory = (props) =>
  props.show ? (
    <>
      {props.type == POST_TYPE_VIDEO ? (
        <Video
          repeat={true}
          controls={false}
          disableFocus={false}
          resizeMode={"contain"}
          source={{ uri: props.image }}
          style={styles.container}
        />
      ) : (
        <FastImage
          style={styles.container}
          source={{
            uri: props.image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      <Pressable onPress={props.close} style={styles.icon}>
        <Icon name="close" color={WhiteColor} size={32} />
      </Pressable>
      <Pressable style={styles.uploadButton} onPress={props.upload}>
        <Text style={styles.uploadText}>Upload</Text>
        <Icon
          name="chevron-forward-outline"
          color={BlackColor}
          size={30}
          style={styles.uploadIcon}
        />
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
  uploadButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
    flexDirection: "row",
    width: 100,
    height: 40,
    backgroundColor: WhiteColor,
    borderRadius: 100,
    alignContent: "center",
    alignItems: "center",
  },
  uploadIcon: {
    marginTop: 3,
    alignSelf: "center",
  },
  uploadText: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
