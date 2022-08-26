import React, { useRef, useState } from "react";
import {
  GlobalStyles,
  PlaceholderColor,
  ToastQuestionGenericStyles,
  WhiteColor,
} from "../../Styles";
import { View, Pressable, Text, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ReactNativePickerModule from "react-native-picker-module";
import { actionMessage } from "../../redux/actions/SharedActions";
import { actionSendReport } from "../../redux/actions/ReportActions";
import { useDispatch } from "react-redux";

const ModalReport = (props) => {
  const picker = useRef();

  const dispatch = useDispatch();

  const [reasons, setReasons] = useState([
    "Aggressive",
    "Annoying",
    "Inappropriate",
    "Offensive",
    "Other",
  ]);
  const [reason, setReason] = useState("Aggressive");
  const [description, setDescription] = useState("");

  const close = () => {
    setDescription("");
    setReason("Aggressive");
    props.close();
  };

  const send = () => {
    if (reason !== "Other" || description.trim() !== "") {
      dispatch(
        actionSendReport(props.id, props.type, reason, description.trim())
      );
      close();
    } else {
      setDescription(description.trim());
      dispatch(
        actionMessage("You must provide a description if the reason is Other")
      );
    }
  };

  return (
    props.visible && (
      <View style={ToastQuestionGenericStyles.contentToast}>
        <View style={ToastQuestionGenericStyles.viewToast}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Report {1 === props.type ? "User" : "Journey"}
          </Text>
          <View
            style={[
              styles.viewSection,
              styles.checkInput,
              styles.aligItemsRight,
            ]}>
            <Text style={styles.textLabel}>Reason</Text>
            <View style={styles.comboSelect}>
              <Pressable
                onPress={() => {
                  picker.current.show();
                }}
                style={{ flexDirection: "row" }}>
                <Text style={GlobalStyles.textWhite}>
                  {null !== reason ? reason : "Select here"}
                </Text>
                <Icon name="chevron-down" size={22} style={styles.iconSelect} />
              </Pressable>
            </View>
            <ReactNativePickerModule
              pickerRef={picker}
              title={"Reason for the Report"}
              items={reasons}
              onValueChange={(value) => setReason(value)}
            />
          </View>
          <TextInput
            numberOfLines={4}
            multiline={true}
            style={ToastQuestionGenericStyles.inputLarge}
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Description (Other requires description)"
          />
          <View style={{ flexDirection: "row" }}>
            <View style={styles.widhtMedium}>
              <Pressable
                style={ToastQuestionGenericStyles.buttonCancel}
                onPress={() => close()}>
                <Text style={ToastQuestionGenericStyles.buttonText}>
                  Cancel
                </Text>
              </Pressable>
            </View>
            <View style={styles.widhtMedium}>
              <Pressable
                style={ToastQuestionGenericStyles.buttonConfirm}
                onPress={() => send()}>
                <Text style={ToastQuestionGenericStyles.buttonText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  widhtMedium: {
    width: "50%",
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    zIndex: 0,
  },
  checkInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  aligItemsRight: {
    alignItems: "flex-end",
  },
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 13,
    color: WhiteColor,
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
    alignContent: "center",
  },
  iconSelect: {
    color: WhiteColor,
    marginLeft: 10,
    paddingTop: -2,
  },
});

export default ModalReport;
