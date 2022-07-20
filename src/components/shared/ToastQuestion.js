import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  WhiteColor,
  ToastQuestionGenericStyles,
  SignUpColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";

export const ToastQuestion = (props) => {
  return props.visible ? (
    <View style={ToastQuestionGenericStyles.contentToastSimple}>
      <View style={ToastQuestionGenericStyles.viewToast}>
        {undefined !== props.close && (
          <Pressable
            onPress={props.close}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 25,
              height: 25,
              backgroundColor: SignUpColor,
              borderRadius: 100,
            }}
          >
            <Icon
              name="close"
              color={WhiteColor}
              size={22}
              style={{ alignSelf: "center", marginTop: 1 }}
            ></Icon>
          </Pressable>
        )}
        <Icon name="ios-link" color={WhiteColor} size={22}></Icon>
        <Text style={ToastQuestionGenericStyles.textToast}>
          Choose from the Gallery or Take a Photo/Video with Camera
        </Text>
        {props.functionVideo ? (
          <View style={ToastQuestionGenericStyles.viewButtons}>
            <Pressable
              onPress={props.functionGallery}
              style={ToastQuestionGenericStyles.threeButtons}
            >
              <Icon name="md-images" color={WhiteColor} size={22}></Icon>
            </Pressable>
            <Pressable
              onPress={props.functionCamera}
              style={ToastQuestionGenericStyles.threeButtons}
            >
              <Icon name="ios-camera" color={WhiteColor} size={22}></Icon>
            </Pressable>
            <Pressable
              onPress={props.functionVideo}
              style={ToastQuestionGenericStyles.threeButtons}
            >
              <Icon name="videocam" color={WhiteColor} size={22}></Icon>
            </Pressable>
          </View>
        ) : (
          <View style={ToastQuestionGenericStyles.viewButtons}>
            <Pressable
              onPress={props.functionGallery}
              style={ToastQuestionGenericStyles.button}
            >
              <Icon name="md-images" color={WhiteColor} size={22}></Icon>
            </Pressable>
            <Pressable
              onPress={props.functionCamera}
              style={ToastQuestionGenericStyles.button}
            >
              <Icon name="ios-camera" color={WhiteColor} size={22}></Icon>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  ) : null;
};
