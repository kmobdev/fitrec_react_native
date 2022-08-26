import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  WhiteColor,
  ToastQuestionGenericStyles,
  SignUpColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";

export const ToastQuestionGeneric = (props) => {
  return props.visible ? (
    <View
      style={[
        ToastQuestionGenericStyles.contentToastSimple,
        {
          backgroundColor: "color:rgba(0, 0, 0, 0.3);",
          paddingBottom: props.padding ? props.padding : 0,
        },
      ]}>
      <View
        style={[
          ToastQuestionGenericStyles.viewToast,
          { maxWidth: undefined !== props.maxWidth ? props.maxWidth : 200 },
        ]}>
        {undefined !== props.bClose && (
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
            }}>
            <Icon
              name="close"
              color={WhiteColor}
              size={22}
              style={{ alignSelf: "center", marginTop: 1 }}></Icon>
          </Pressable>
        )}
        {props.icon && (
          <Icon name={props.icon} color={WhiteColor} size={22}></Icon>
        )}
        {props.titleBig && (
          <Text
            style={[
              ToastQuestionGenericStyles.textToast,
              { fontWeight: "bold", fontSize: 20 },
            ]}>
            {props.titleBig}
          </Text>
        )}
        {props.title && (
          <Text style={ToastQuestionGenericStyles.textToast}>
            {props.title}
          </Text>
        )}
        {props.options && <View>{props.options}</View>}
      </View>
    </View>
  ) : null;
};
