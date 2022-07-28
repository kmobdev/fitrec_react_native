import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
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
import { connect } from "react-redux";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { actionDesactiveAccount } from "../../redux/actions/UserActions";
import { APP_VERSION } from "../../Constants";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTutorial: false,
      showVideoTutorial: false,
      showConditions: false,
      toastText: "",
      showContact: false,
      showToastQuestion: false,
    };
  }

  showToast = async (sText, callback = null) => {
    this.setState({
      toastText: sText,
      loading: false,
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

  desactivateAccount = async () => {
    await this.setState({
      loading: true,
      showToastQuestion: false,
    });
    this.props.desactivateAccount(this.props.session.account.key);
  };

  componentWillReceiveProps = async (nextProps) => {
    await this.setState({
      loading: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.viewOptionBorder}>
            <Pressable
              onPress={() => this.setState({ showContact: true })}
            >
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
            <Pressable
              onPress={() => this.setState({ showConditions: true })}
            >
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
            <Pressable
              onPress={() => this.setState({ showTutorial: true })}
            >
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
            <Pressable
              onPress={() => this.setState({ showVideoTutorial: true })}
            >
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
          {/* QUEDA COMENTAOD PARA UNA ACTUALIZACION
                    <View style={styles.viewOptionBorder}>
                        <Pressable onPress={() => this.showToast("Function not yet implemented")}>
                            <View style={styles.viewOption}>
                                <View style={styles.viewLeft}>
                                    <Text style={styles.text16}>Blocked users</Text>
                                </View>
                                <View style={styles.viewRight}>
                                    <Icon name="ios-arrow-forward" size={30} color={PlaceholderColor} />
                                </View>
                            </View>
                        </Pressable>
                    </View>
                    */}
          <View style={styles.viewOptionBorder}>
            <Pressable
              onPress={() => this.setState({ showToastQuestion: true })}
            >
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
          noMargin={true}
        />
        {this.state.showConditions && (
          <View style={styles.viewFullAbsolute}>
            <View
              style={[styles.head, this.props.noMargin && { paddingTop: 10 }]}
            >
              <Text style={styles.headTitle}>Terms & Conditions</Text>
              <View
                style={[styles.headClose, this.props.noMargin && { top: 5 }]}
              >
                <Pressable
                  onPress={() => this.setState({ showConditions: false })}
                >
                  <Text style={styles.headCloseText}>Close</Text>
                </Pressable>
              </View>
            </View>
            <Conditions hiddenButtons={true} />
          </View>
        )}
        <Toast toastText={this.state.toastText} />
        <ContactUsForm
          close={() => this.setState({ showContact: false })}
          email={this.props.session.account.email}
          visible={this.state.showContact}
        />
        <ToastQuestionGeneric
          visible={this.state.showToastQuestion}
          titleBig="Deactivate user account"
          title="Are you sure you want to deactivate your user account?"
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => this.setState({ showToastQuestion: false })}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.desactivateAccount()}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: SignUpColor },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Ok</Text>
              </Pressable>
            </View>
          }
        />
        <View style={styles.version}>
          <Text style={GlobalStyles.textMuted}>{APP_VERSION}</Text>
        </View>
        <LoadingSpinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteColor
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
    fontSize: 16
  }
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  desactivateAccountProps: state.reducerDesactivateAccount,
});

const mapDispatchToProps = (dispatch) => ({
  desactivateAccount: (sUserKey) => {
    dispatch(actionDesactiveAccount(sUserKey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
