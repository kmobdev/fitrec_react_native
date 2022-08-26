import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  actionSendContactus,
  actionUpdateProfileResetState,
} from "../../redux/actions/ProfileActions";
import { Toast } from "../shared/Toast";
import { LoadingSpinner } from "../shared/LoadingSpinner";

const ContactUsForm = (props) => {
  const session = useSelector((state) => state.reducerSession);
  const profile = useSelector((state) => state.reducerProfile);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toastText, setToastText] = useState("");

  useEffect(() => {
    if (null !== profile.statusSend && profile.statusSend) {
      showToast("Contact sent successfully", () => {
        props.close();
        dispatch(actionUpdateProfileResetState());
      });
    }
    setLoading(false);
  }, []);

  const sendContact = () => {
    if ("" === message) {
      showToast("Message required");
    } else {
      this.setState({
        loading: true,
      });
      const account = this.props.session.account;
      const sMessage = `New App Feedback from ${account.name}:\n${this.state.message}\n\nUsername: ${account.username}\nEmail: ${account.email}`;
      this.props.sendContact(sMessage);
    }
  };

  const showToast = (text, callback = null) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  return (
    props.visible && (
      <View style={GlobalModal.viewContent}>
        <View style={GlobalModal.viewHead}>
          <Text style={GlobalModal.headTitle}>Contact us</Text>
          <Pressable style={GlobalModal.buttonClose} onPress={props.close}>
            <Text style={GlobalModal.titleClose}>Close</Text>
          </Pressable>
        </View>
        <ScrollView>
          <View style={styles.viewSection}>
            <Text style={styles.textLabel}>From</Text>
            <TextInput
              style={[styles.textInput, { color: PlaceholderColor }]}
              value={props.email}
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
              onChangeText={(text) => setMessage(text)}
              value={message}
            />
          </View>
          <View style={[styles.viewSection, styles.viewSectionButtons]}>
            <View style={styles.viewButton}>
              <Pressable
                onPress={props.close}
                style={[styles.button, { backgroundColor: GreenFitrecColor }]}>
                <Text style={styles.textButton}>Cancel</Text>
              </Pressable>
            </View>
            <View style={styles.viewButton}>
              <Pressable
                onPress={() => sendContact()}
                style={[styles.button, { backgroundColor: SignUpColor }]}>
                <Text style={styles.textButton}>Send</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        <Toast toastText={toastText} />
        <LoadingSpinner visible={loading} />
      </View>
    )
  );
};

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

export default ContactUsForm;
