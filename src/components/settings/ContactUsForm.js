import React, { Component } from "react";
import {
  GlobalModal,
  PlaceholderColor,
  GreenFitrecColor,
  WhiteColor,
  SignUpColor,
} from "../../Styles";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import {
  actionSendContactus,
  actionUpdateProfileResetState,
} from "../../redux/actions/ProfileActions";
import { Toast } from "../shared/Toast";
import { LoadingSpinner } from "../shared/LoadingSpinner";

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: "",
      toastText: "",
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    if (null !== nextProps.profile.statusSend && nextProps.profile.statusSend) {
      this.showToast("Contact sent successfully", () => {
        this.props.close();
        this.props.resetStateUpdateProfile();
      });
    }
    await this.setState({
      loading: false,
    });
  };

  sendContact = async () => {
    if ("" === this.state.message) {
      this.showToast("Message required");
    } else {
      await this.setState({
        loading: true,
      });
      let sMessage =
        "Username: " +
        this.props.session.account.username +
        "<br> Name: " +
        this.props.session.account.name +
        "<br> Message: " +
        this.state.message;
      this.props.sendContact(sMessage);
    }
  };

  showToast = async (sText, callback = null) => {
    this.setState({
      toastText: sText,
      loading: false,
      message: "",
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  render() {
    return (
      this.props.visible && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            <Text style={GlobalModal.headTitle}>Contact us</Text>
            <Pressable
              style={GlobalModal.buttonClose}
              onPress={this.props.close}
            >
              <Text style={GlobalModal.titleClose}>Close</Text>
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.viewSection}>
              <Text style={styles.textLabel}>From</Text>
              <TextInput
                style={[styles.textInput, { color: PlaceholderColor }]}
                value={this.props.email}
                editable={false}
              />
            </View>
            <View style={styles.viewSection}>
              <TextInput
                style={[styles.textInput, styles.inputTextArea]}
                multiline={true}
                numberOfLines={4}
                textAlign="left"
                placeholder="Your message"
                placeholderTextColor={PlaceholderColor}
                onChangeText={(text) => this.setState({ message: text })}
                value={this.state.message}
              />
            </View>
            <View style={[styles.viewSection, styles.viewSectionButtons]}>
              <View style={styles.viewButton}>
                <Pressable
                  onPress={this.props.close}
                  style={[styles.button, { backgroundColor: GreenFitrecColor }]}
                >
                  <Text style={styles.textButton}>Cancel</Text>
                </Pressable>
              </View>
              <View style={styles.viewButton}>
                <Pressable
                  onPress={() => this.sendContact()}
                  style={[styles.button, { backgroundColor: SignUpColor }]}
                >
                  <Text style={styles.textButton}>Send</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
          <Toast toastText={this.state.toastText} />
          <LoadingSpinner visible={this.state.loading} />
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  viewSectionButtons: {
    flexDirection: "row",
    borderBottomWidth: 0,
    marginTop: 20,
  },
  viewButton: {
    width: "50%",
    alignItems: "center",
  },
  button: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: WhiteColor,
    fontWeight: "bold",
    fontSize: 18,
  },
  inputTextArea: {
    paddingStart: 10,
    paddingEnd: 10,
    height: 100,
    marginTop: 30,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  textLabel: {
    position: "absolute",
    left: 10,
    bottom: 10,
    color: PlaceholderColor,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: 10,
    color: "#000000",
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  profile: state.reducerProfile,
});

const mapDispatchToProps = (dispatch) => ({
  sendContact: (sMessage) => {
    dispatch(actionSendContactus(sMessage));
  },
  resetStateUpdateProfile: () => {
    dispatch(actionUpdateProfileResetState());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsForm);
