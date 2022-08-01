import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import {
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
} from "../../Styles";
import { Toast } from "../../components/shared/Toast";
import { connect, useDispatch, useSelector } from "react-redux";
import { actionUserForgotPassword } from "../../redux/actions/UserActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Input } from "../../components";

const ForgotPassword = (props) => {

  const screenProps = useSelector((state) => state.reducerForgotPassword);

  const [email, setEmail] = useState('');
  const [toastText, setToastText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !screenProps.success &&
      "" !== screenProps.messageError
    ) {
      showToast(screenProps.messageError);
    } else if (screenProps.success) {
      showToast(
        "A link has been sent to reset your password to your email",
        () => props.navigation.navigate("Login")
      );
    }
    setIsLoading(false)
  }, [screenProps])

  const showToast = (Text, callback = null) => {
    setToastText(Text);
    setIsLoading(false)
    setTimeout(() => {
      setToastText('');
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  const forgotPassword = () => {
    dispatch(actionUserForgotPassword(email));
    setIsLoading(true)
  };

  return (
    <View style={styles.content}>
      <Text style={{ color: GreenFitrecColor }}>
        Enter your email address you use to sign in to FitRec
      </Text>
      <View style={styles.viewSection}>
        <Input
          style={styles.textInput}
          placeholder="Email address"
          placeholderTextColor={PlaceholderColor}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={forgotPassword}
      >
        <Text style={{ color: WhiteColor }}>NEXT</Text>
      </Pressable>
      <Toast toastText={toastText} />
      <LoadingSpinner visible={isLoading} />
    </View>
  );
}

export default ForgotPassword;

const styles = StyleSheet.create({
  content: {
    padding: 10,
    flex: 1,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "center",
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  button: {
    backgroundColor: SignUpColor,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 15,
  },
});
