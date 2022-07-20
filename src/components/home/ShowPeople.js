import React, { Component } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import {
  GlobalModal,
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { Toast } from "../../components/shared/Toast";
import { connect } from "react-redux";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import FastImage from "react-native-fast-image";

class ShowPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      refresh: false,
      toastText: "",
    };
  }

  checkElement = async (nIndex) => {
    this.props.activity.users[nIndex].check =
      !this.props.activity.users[nIndex].check;
    await this.setState({
      refresh: !this.state.refresh,
    });
  };

  resetMessage = async () => {
    this.props.activity.users.map((element) => {
      element.check = false;
    });
    await this.setState({
      message: "",
    });
  };

  changeText = async (text) => {
    await this.setState({ message: text });
    if ("" === this.state.message) {
      this.resetMessage();
    }
  };

  sendMessage = async () => {
    if ("" === this.state.message) {
      this.showToast("The message field cannot be empty");
    } else if (
      0 === this.props.activity.users.filter((element) => element.check).length
    ) {
      this.showToast("Select a user");
    } else {
      this.props.sendMessage(this.state.message);
      await this.setState({
        message: "",
      });
    }
  };

  showToast = async (sText) => {
    this.setState({
      toastText: sText,
      loading: false,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
    }, 2000);
  };

  redirectionViewProfile = (nIdFitrec) => {
    this.props.getProfile(nIdFitrec);
    this.props.navigation.navigate("ProfileViewDetailsHome");
  };

  uncheckUsers = () => {
    this.props.activity.users.map((element) => {
      element.check = false;
    });
  };

  render = () => {
    return (
      this.props.visible &&
      null !== this.props.activity && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            <Text style={GlobalModal.headTitle}>
              {this.props.activity.name}
            </Text>
            <Pressable
              style={GlobalModal.buttonClose}
              onPress={() => {
                this.props.close();
                this.resetMessage();
                this.uncheckUsers();
              }}
            >
              <Text style={GlobalModal.titleClose}>Close</Text>
            </Pressable>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              {"" !== this.state.message && (
                <Pressable
                  onPress={() => {
                    this.resetMessage();
                  }}
                  style={{ position: "absolute", zIndex: 999, bottom: 0.5 }}
                >
                  <Icon name={"close"} size={24} color={SignUpColor} />
                </Pressable>
              )}
              <TextInput
                placeholder="Type your message"
                value={this.state.message}
                onFocus={() => {
                  if (null !== this.scrollView && undefined !== this.scrollView)
                    this.scrollView.scrollToEnd({ animated: true });
                }}
                style={[
                  styles.messageInput,
                  { paddingLeft: "" !== this.state.message ? 20 : 0 },
                ]}
                onChangeText={(text) => this.changeText(text)}
              />
              <Pressable
                onPress={() => this.sendMessage()}
                style={styles.sendIcon}
              >
                <Icon
                  name={"" !== this.state.message ? "md-send" : "md-text"}
                  size={28}
                  color={SignUpColor}
                />
              </Pressable>
            </View>
            <View style={styles.peopleContainer}>
              {this.props.activity.users.map((element, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    if ("" !== this.state.message) {
                      this.checkElement(index);
                    } else {
                      this.redirectionViewProfile(element.id);
                    }
                  }}
                  style={styles.itemContainer}
                >
                  {this.renderImage(element.image)}
                  <Text
                    style={{ color: PlaceholderColor, textAlign: "center" }}
                  >
                    {element.username}
                  </Text>
                  {"" !== this.state.message && (
                    <View style={{ position: "absolute", right: 0, top: 0 }}>
                      {undefined !== element.check && element.check ? (
                        <Icon
                          name="md-checkmark-circle"
                          size={24}
                          color={SignUpColor}
                        />
                      ) : (
                        <Icon
                          name="ios-add-circle-outline"
                          size={24}
                          color={PlaceholderColor}
                        />
                      )}
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Toast toastText={this.state.toastText} />
        </View>
      )
    );
  };

  renderImage = (sImage = null) => {
    return (
      <>
        {null !== sImage ? (
          <FastImage
            style={{
              width: 60,
              height: 60,
              backgroundColor: WhiteColor,
              borderRadius: 100,
              marginBottom: 5,
            }}
            source={{
              uri: sImage,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image
            style={{
              width: 60,
              height: 60,
              backgroundColor: WhiteColor,
              borderRadius: 100,
              marginBottom: 5,
            }}
            source={require("../../assets/profile.png")}
          />
        )}
      </>
    );
  };
}

const styles = StyleSheet.create({
  peopleContainer: {
    flexDirection: "row",
    marginTop: 40,
    width: "100%",
    flexWrap: "wrap",
  },
  itemContainer: {
    alignItems: "center",
    width: "33%",
    marginBottom: 10,
    padding: 10,
  },
  messageInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    paddingBottom: 5,
    width: "100%",
    fontSize: 16,
    paddingRight: 25,
  },
  sendIcon: {
    position: "absolute",
    zIndex: 999,
    right: 0,
    bottom: 0.5,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
});

const mapDispatchToProps = (dispatch) => ({
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowPeople);
