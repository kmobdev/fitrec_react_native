import React, { Component } from "react";
import {
  Text,
  ImageBackground,
  View,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
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
import { connect } from "react-redux";
import {
  actionUserLogin,
  actionUserLoginFB,
  actionUserLoginApple,
  actionCleanMessage,
} from "../../redux/actions/UserActions";
import { APP_VERSION } from "../../Constants";
import { Button, Input } from "../../components";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      toastText: "",
      displayImage: 1,
      showTutorial: false,
      showVideoTutorial: false,
      keyboardOffset: 0,
    };
  }

  getKeyboardOffsetStyle() {
    const { keyboardOffset } = this.state;
    return Platform.select({
      ios: () => ({ paddingBottom: keyboardOffset / 2 }),
      android: () => ({}),
    })();
  }

  login = async () => {
    var sError = this.validate({
      username: this.state.username,
      password: this.state.password,
    });
    if (null === sError)
      this.props.loginUser(this.state.username, this.state.password);
    else this.showToast(sError);
  };

  loginFB = async () => {
    this.props.loginUserFB();
  };

  loginApple = async () => {
    this.props.loginUserApple();
  };

  componentWillReceiveProps = async (nextProps) => {
    if (!nextProps.login.status && nextProps.login.redirectSignIn) {
      if (nextProps.login.appleAccount !== null)
        this.navigateHandler("Register", {
          appleCredentials: nextProps.login.appleAccount,
        });
      else
        this.navigateHandler("Register", {
          userFBData: nextProps.login.appleAccount,
        });
    }
    if (!nextProps.login.status && "" !== nextProps.login.messageError) {
      this.showToast(nextProps.login.messageError);
      this.props.cleanMessage();
    }
  };

  validate = (values) => {
    if (!values.username) {
      return "Username required";
    }
    if (!values.password) {
      return "Password required";
    }
    return null;
  };

  showToast = async (sText) => {
    this.setState({
      toastText: sText,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
    }, 2000);
  };

  showTutorialHandler = () => {
    this.setState({ showTutorial: true });
  }

  showVideoTutorialHandler = () => {
    this.setState({ showVideoTutorial: true });
  }

  navigateHandler = (route) => {
    this.props.navigation.navigate(route)
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require("../../assets/loginBackground.png")}
          style={GlobalStyles.fullImage}
        >
          <View
            style={[
              {
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
              this.getKeyboardOffsetStyle(),
            ]}>
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/logoWithName.png")}
                style={{ marginTop: 40 }}
              />
            </View>
            <View style={styles.Content}>
              <Input
                iconSource={"" === this.state.username && require("../../assets/user.png")}
                autoCapitalize={"none"}
                autoCompleteType={"username"}
                textContentType={"username"}
                // style={styles.textInput}
                value={this.state.username}
                onChangeText={(text) => this.setState({ username: text })}
                onSubmitEditing={() => {
                  this.secondTextInput.focus();
                }}
                blurOnSubmit={false}
              />
              <Input
                ref={(input) => {
                  this.secondTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.login();
                }}
                iconSource={"" === this.state.password && require("../../assets/password.png")}
                secureTextEntry={true}
                autoCapitalize={"none"}
                returnKeyType={"done"}
                textContentType={"password"}
                style={styles.textInput}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
              />
              <Button
                onPress={() => this.login()}
                title={'LOGIN NOW'}
              />
              <ButtonFacebook
                onPress={() => this.loginFB()}
                login={true}
                title="Sign in with Facebook"
              />
              {Platform.OS === "ios" && (
                <ButtonApple
                  onPress={() => this.loginApple()}
                  login={true}
                  title="Sign in with Apple"
                />
              )}
              <Pressable
                style={styles.touchableTextFree}
                onPress={() => {
                  this.navigateHandler("ForgotPassword");
                }}
              >
                <Text style={styles.textFree}>FORGOT PASSWORD?</Text>
              </Pressable>
              <Pressable
                style={styles.touchableTextFree}
                onPress={this.showVideoTutorialHandler}
              >
                <Text style={styles.textFree}>VIDEO APP TUTORIAL</Text>
              </Pressable>
            </View>
            <View style={[styles.viewSection, styles.viewSectionFooter]}>
              <View style={styles.switchButtons}>
                <Pressable
                  onPress={this.showTutorialHandler}
                  style={styles.roundButtonSwitchLeft}
                >
                  <Text style={styles.textButton}>TAKE A TOUR</Text>
                </Pressable>
                <Pressable
                  onPress={() => this.navigateHandler("Register")}
                  style={styles.roundButtonSwitchRight}
                >
                  <Text style={styles.textButton}>SIGN UP</Text>
                </Pressable>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white" }}>{APP_VERSION}</Text>
              </View>
            </View>
            <Toast toastText={this.state.toastText} />
          </View>
        </ImageBackground>
        <CarouselTutorial
          visible={this.state.showTutorial}
          close={() => {
            this.setState({ showTutorial: false });
          }}
        />
        <YouTubeVideo
          visible={this.state.showVideoTutorial}
          url="https://www.youtube.com/embed/O5bwmQtr5zQ"
          close={() => {
            this.setState({ showVideoTutorial: false });
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  Content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: WhiteColor,
    alignItems: "center",
    height: 40,
    width: "47%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: GreenFitrecColor,
  },
  roundButtonSwitchRight: {
    width: "95%",
    borderRadius: 50,
    justifyContent: "center",
    backgroundColor: WhiteColor,
    alignItems: "center",
    height: 40,
    width: "47%",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: SignUpColor,
  },
});

const mapStateToProps = (state) => ({
  login: state.reducerSession,
});

const mapDispatchToProps = (dispatch) => ({
  loginUser: (sUsername, sPassword) => {
    dispatch(actionUserLogin(sUsername, sPassword));
  },
  loginUserFB: () => {
    dispatch(actionUserLoginFB());
  },
  loginUserApple: () => {
    dispatch(actionUserLoginApple());
  },
  cleanMessage: () => {
    dispatch(actionCleanMessage());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
