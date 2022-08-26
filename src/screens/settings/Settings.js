import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  PlaceholderColor,
  GlobalStyles,
  WhiteColor,
  SignUpColor,
  GreenFitrecColor,
  ToastQuestionStyles,
} from "../../Styles";
import CarouselTutorial from "../../components/login/CarouselTutorial";
import YouTubeVideo from "../../components/login/YouTubeVideo";
import Conditions from "../register/Conditions";
import { Toast } from "../../components/shared/Toast";
import ContactUsForm from "../../components/settings/ContactUsForm";
import { useDispatch, useSelector } from "react-redux";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { actionDesactiveAccount } from "../../redux/actions/UserActions";
import { APP_VERSION } from "../../Constants";

const Settings = (props) => {
  const session = useSelector((state) => state.reducerSession);

  const dispatch = useDispatch();

  const [showTutorial, setShowTutorial] = useState(false);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [toastText, setToastText] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const desactivateAccount = () => {
    setLoading(true);
    setShowToastQuestion(false);
    dispatch(actionDesactiveAccount(session.account.key));
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.viewOptionBorder}>
          <Pressable onPress={() => setShowContact(true)}>
            <View style={styles.viewOption}>
              <View style={styles.viewLeft}>
                <Text style={styles.text16}>Contact us</Text>
              </View>
              <View style={styles.viewRight}>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color={PlaceholderColor}
                />
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewOptionBorder}>
          <Pressable onPress={() => setShowConditions(true)}>
            <View style={styles.viewOption}>
              <View style={styles.viewLeft}>
                <Text style={styles.text16}>Terms & conditions</Text>
              </View>
              <View style={styles.viewRight}>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color={PlaceholderColor}
                />
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewOptionBorder}>
          <Pressable onPress={() => setShowTutorial(true)}>
            <View style={styles.viewOption}>
              <View style={styles.viewLeft}>
                <Text style={styles.text16}>App tutorial</Text>
              </View>
              <View style={styles.viewRight}>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color={PlaceholderColor}
                />
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewOptionBorder}>
          <Pressable onPress={() => setShowVideoTutorial(true)}>
            <View style={styles.viewOption}>
              <View style={styles.viewLeft}>
                <Text style={styles.text16}>Video app tutorial</Text>
              </View>
              <View style={styles.viewRight}>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color={PlaceholderColor}
                />
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewOptionBorder}>
          <Pressable onPress={() => setShowToastQuestion(true)}>
            <View style={styles.viewOption}>
              <View style={styles.viewLeft}>
                <Text style={styles.text16}>Deactivate user account</Text>
              </View>
              <View style={styles.viewRight}>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color={PlaceholderColor}
                />
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <CarouselTutorial
        visible={showTutorial}
        close={() => setShowTutorial(false)}
      />
      <YouTubeVideo
        visible={showVideoTutorial}
        url="https://www.youtube.com/embed/O5bwmQtr5zQ"
        close={() => setShowVideoTutorial(false)}
        noMargin={true}
      />
      {showConditions && (
        <View style={styles.viewFullAbsolute}>
          <View style={[styles.head, props.noMargin && { paddingTop: 10 }]}>
            <Text style={styles.headTitle}>Terms & Conditions</Text>
            <View style={[styles.headClose, props.noMargin && { top: 5 }]}>
              <Pressable onPress={() => setShowConditions(false)}>
                <Text style={styles.headCloseText}>Close</Text>
              </Pressable>
            </View>
          </View>
          <Conditions hiddenButtons={true} />
        </View>
      )}
      <Toast toastText={toastText} />
      <ContactUsForm
        close={() => setShowContact(false)}
        email={session.account.email}
        visible={showContact}
      />
      <ToastQuestionGeneric
        visible={showToastQuestion}
        titleBig="Deactivate user account"
        title="Are you sure you want to deactivate your user account?"
        options={
          <View style={ToastQuestionStyles.viewButtons}>
            <Pressable
              onPress={() => setShowToastQuestion(false)}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: GreenFitrecColor, marginRight: 10 },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={desactivateAccount}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: SignUpColor },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Ok</Text>
            </Pressable>
          </View>
        }
      />
      <View style={styles.version}>
        <Text style={GlobalStyles.textMuted}>{APP_VERSION}</Text>
      </View>
      <LoadingSpinner visible={loading} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteColor,
  },
  viewOptionBorder: {
    borderBottomWidth: 1,
    borderColor: PlaceholderColor,
  },
  viewOption: {
    padding: 10,
    width: "100%",
    flexDirection: "row",
  },
  viewLeft: {
    width: "80%",
    justifyContent: "center",
  },
  viewRight: {
    width: "20%",
    alignItems: "flex-end",
  },
  viewFullAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: WhiteColor,
  },
  head: {
    backgroundColor: WhiteColor,
    paddingTop: 10,
    padding: 10,
  },
  headTitle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  headClose: {
    position: "absolute",
    right: 10,
    top: 5,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headCloseText: {
    color: SignUpColor,
    fontWeight: "bold",
    fontSize: 18,
  },
  version: {
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  text16: {
    fontSize: 16,
  },
});
