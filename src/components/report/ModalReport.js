import React, { Component } from "react";
import {
  GlobalStyles,
  PlaceholderColor,
  ToastQuestionGenericStyles,
  WhiteColor,
} from "../../Styles";
import { View, Pressable, Text, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ReactNativePickerModule from "react-native-picker-module";
import { connect } from "react-redux";
import { actionMessage } from "../../redux/actions/SharedActions";
import { actionSendReport } from "../../redux/actions/ReportActions";

class ModalReport extends Component {
  constructor(props) {
    super(props);
    this.picker = React.createRef();
    this.state = {
      type: 0,
      reasons: [
        "Aggressive",
        "Annoying",
        "Inappropriate",
        "Offensive",
        "Other",
      ],
      reason: "Aggressive",
      description: "",
    };
  }

  componentDidMount = () => { };

  close = () => {
    this.setState({ description: "", reason: "Aggressive" });
    this.props.close();
  };

  send = () => {
    if (this.state.reason !== "Other" || this.state.description.trim() !== "") {
      this.props.send(
        this.props.id,
        this.props.type,
        this.state.reason,
        this.state.description.trim()
      );
      this.close();
    } else {
      this.setState({ description: this.state.description.trim() });
      this.props.message(
        "You must provide a description if the reason is Other"
      );
    }
  };

  render() {
    return (
      this.props.visible && (
        <View style={ToastQuestionGenericStyles.contentToast}>
          <View style={ToastQuestionGenericStyles.viewToast}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Report {1 === this.props.type ? "User" : "Journey"}
            </Text>
            <View
              style={[
                styles.viewSection,
                styles.checkInput,
                styles.aligItemsRight,
              ]}
            >
              <Text style={styles.textLabel}>Reason</Text>
              <View style={styles.comboSelect}>
                <Pressable
                  onPress={() => {
                    this.picker.current.show();
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <Text style={GlobalStyles.textWhite}>
                    {null !== this.state.reason
                      ? this.state.reason
                      : "Select here"}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={22}
                    style={styles.iconSelect}
                  />
                </Pressable>
              </View>
              <ReactNativePickerModule
                pickerRef={this.picker}
                title={"Reason for the Report"}
                items={this.state.reasons}
                onValueChange={(value) => this.setState({ reason: value })}
              />
            </View>
            <TextInput
              numberOfLines={4}
              multiline={true}
              style={ToastQuestionGenericStyles.inputLarge}
              value={this.state.description}
              onChangeText={(text) => this.setState({ description: text })}
              placeholder="Description (Other requires description)"
            />
            <View style={{ flexDirection: "row" }}>
              <View style={styles.widhtMedium}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonCancel}
                  onPress={() => this.close()}
                >
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
              <View style={styles.widhtMedium}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonConfirm}
                  onPress={() => this.send()}
                >
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Send
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )
    );
  }
}

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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  send: (nId, nType, sReason, sDescription) => {
    dispatch(actionSendReport(nId, nType, sReason, sDescription));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalReport);
