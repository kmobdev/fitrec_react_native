import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  ImageBackground,
  View,
  Image,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import {
  GreenFitrecColor,
  WhiteColor,
  SignUpColor,
  GlobalStyles,
} from "../../Styles";
import { Toast } from "../../components/shared/Toast";
import { ButtonFacebook } from "../../components/shared/ButtonFacebook";
import { ButtonApple } from "../../components/shared/ButtonApple";
import YouTubeVideo from "../../components/login/YouTubeVideo";
import CarouselTutorial from "../../components/login/CarouselTutorial";
import { useDispatch, useSelector } from "react-redux";
import {
  actionUserLogin,
  actionUserLoginFB,
  actionUserLoginApple,
  actionCleanMessage,
} from "../../redux/actions/UserActions";
import { APP_VERSION } from "../../Constants";
import { Button, Input } from "../../components";
import { ImageSet } from "../../constants/Images";

const Login = (props) => {

  const screenProps = useSelector((state) => state.reducerSession);
  const dispatch = useDispatch();

  const secondTextInput = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toastText, setToastText] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);

  useEffect(() => {
    if (!screenProps.status && screenProps.redirectSignIn) {
      if (screenProps.appleAccount !== null)
        navigateHandler("Register", {
          appleCredentials: screenProps.appleAccount,
        });
      else
        navigateHandler("Register", {
          userFBData: screenProps.appleAccount,
        });
    }
    if (!screenProps.status && "" !== screenProps.messageError) {
      showToast(screenProps.messageError);
      dispatch(actionCleanMessage());
    }
  }, [screenProps])

  const login = () => {
    var sError = validate({
      username: username,
      password: password,
    });
    if (null === sError) {
      dispatch(actionUserLogin(username, password))
    } else {
      showToast(sError);
    }
  };

  const loginFB = () => {
    dispatch(actionUserLoginFB())
  };

  const loginApple = () => {
    dispatch(actionUserLoginApple());
  };

  const validate = (values) => {
    if (!values.username) {
      return "Username required";
    }
    if (!values.password) {
      return "Password required";
    }
    return null;
  };

  const showToast = (message) => {
    setToastText(message);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const showTutorialHandler = () => {
    setShowTutorial(true);
  }

  const showVideoTutorialHandler = () => {
    setShowVideoTutorial(true);
  }

  const navigateHandler = (route) => {
    props.navigation.navigate(route)
  }

  return (
    <ScrollView contentContainerStyle={GlobalStyles.container}>
      <ImageBackground
        source={ImageSet.loginBackground}
        style={GlobalStyles.fullImage}>
        <View style={styles.mainContainer}>
          <View style={styles.imageView}>
            <Image
              source={ImageSet.logoWithName}
              style={{ marginTop: 40 }}
            />
          </View>
          <View style={styles.Content}>
            <View style={styles.SectionStyle}>
              <Input
                iconSource={username === '' && ImageSet.user}
                autoCapitalize={"none"}
                autoCompleteType={"username"}
                textContentType={"username"}
                value={username}
                onChangeText={(text) => setUsername(text)}
                onSubmitEditing={() => { secondTextInput.current.focus(); }}
                blurOnSubmit={false}
                inputStyle={styles.textInput}
              />
            </View>

            <View style={styles.SectionStyle}>
              <Input
                ref={secondTextInput}
                onSubmitEditing={login}
                iconSource={password === '' && ImageSet.password}
                secureTextEntry={true}
                autoCapitalize={"none"}
                returnKeyType={"done"}
                textContentType={"password"}
                style={styles.textInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
                inputStyle={styles.textInput}
              />
            </View>
            <Button
              onPress={login}
              title={'LOGIN NOW'}
            />
            <ButtonFacebook
              onPress={loginFB}
              login={true}
              title="Sign in with Facebook"
            />
            {Platform.OS === "ios" && (
              <ButtonApple
                onPress={loginApple}
                login={true}
                title="Sign in with Apple"
              />
            )}
            <Pressable
              style={styles.touchableTextFree}
              onPress={() => {
                navigateHandler("ForgotPassword");
              }}
            >
              <Text style={styles.textFree}>FORGOT PASSWORD?</Text>
            </Pressable>

            <Pressable
              style={styles.touchableTextFree}
              onPress={showVideoTutorialHandler}
            >
              <Text style={styles.textFree}>VIDEO APP TUTORIAL</Text>
            </Pressable>
          </View>
          <View style={[styles.viewSection, styles.viewSectionFooter]}>
            <View style={styles.switchButtons}>
              <Pressable
                onPress={showTutorialHandler}
                style={styles.roundButtonSwitchLeft}
              >
                <Text style={styles.textButton}>TAKE A TOUR</Text>
              </Pressable>
              <Pressable
                onPress={() => navigateHandler("Register")}
                style={styles.roundButtonSwitchRight}
              >
                <Text style={styles.textButton}>SIGN UP</Text>
              </Pressable>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "white" }}>{APP_VERSION}</Text>
            </View>
          </View>
          <Toast toastText={toastText} />
        </View>
      </ImageBackground>
      <CarouselTutorial
        visible={showTutorial}
        close={() => setShowTutorial(false)}
      />
      <YouTubeVideo
        visible={showVideoTutorial}
        url="https://www.youtube.com/embed/O5bwmQtr5zQ"
        close={() => setShowVideoTutorial(false)}
      />
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  Content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    borderBottomWidth: 0.5,
    borderBottomColor: WhiteColor,
    marginTop: "android" === Platform.OS ? 10 : 25,
  },
  ImageStyle: {
    height: 30,
    width: 150,
    position: "absolute",
    bottom: 10,
  },
  roundButton: {
    width: "95%",
    borderRadius: 50,
    justifyContent: "center",
    backgroundColor: WhiteColor,
    alignItems: "center",
    height: 40,
  },
  switchButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    color: GreenFitrecColor,
    marginRight: 5,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 20,
    color: WhiteColor,
    width: "95%",
    textAlign: "center",
    paddingBottom: 10,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
  },
  viewSectionFooter: {
    paddingBottom: 10,
  },
  textFree: {
    color: WhiteColor,
    marginTop: 10,
    fontSize: 16,
  },
  touchableTextFree: {
    borderBottomWidth: 0.5,
    borderBottomColor: WhiteColor,
    marginTop: 10,
  },
  textButton: {
    color: WhiteColor,
  },
  roundButtonSwitchLeft: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "47%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: GreenFitrecColor,
  },
  roundButtonSwitchRight: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "47%",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: SignUpColor,
  },
  imageView: {
    alignItems: "center",
  },
});
