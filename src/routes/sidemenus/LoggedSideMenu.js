import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { PlaceholderColor, SignUpColor, GlobalMessages } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { actionUserSessionClose } from "../../redux/actions/UserActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Toast } from "../../components/shared/Toast";
import {
  actionNavigateToHome,
  actionNavigateToJourneys,
} from "../../redux/actions/NavigationActions";

class LoggedSideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      toastText: "",
    };
  }

  logoutUser = async () => {
    await this.setState({
      loading: true,
    });
    this.props.logoutUser(this.props.session.account.key);
  };

  navigatePage = (sPage) => {
    this.props.navigation.navigate(sPage);
    this.props.navigation.closeDrawer();
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

  navigateHome = () => {
    this.props.navigateHome();
    this.navigatePage("Home");
  };

  navigateJourney = () => {
    this.props.navigateJourney();
    this.navigatePage("JourneyList");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.viewTouchable}>
          <View style={styles.viewTitle}>
            <Text style={styles.textTitle}></Text>
          </View>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={this.navigateHome}>
            <View style={styles.viewText}>
              <Icon name="home" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Home</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable
            onPress={() => this.navigatePage("ProfileViewDetailsProfile")}>
            <View style={styles.viewText}>
              <Icon name="person-circle" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>My profile</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.navigatePage("MyPals")}>
            <View style={styles.viewText}>
              <Icon name="people-circle" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>My pals</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.navigatePage("Groups")}>
            <View style={styles.viewText}>
              <Icon name="ios-people" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Groups</Text>
              {this.props.chatProps.messageReadGroup > 0 && (
                <View
                  style={[
                    GlobalMessages.viewGlobalBubble,
                    {
                      marginTop: 0,
                      justifyContent: "center",
                      marginLeft: 5,
                    },
                  ]}>
                  <View style={GlobalMessages.viewBubble}>
                    <Text style={GlobalMessages.text}>
                      {this.props.chatProps.messageReadGroup}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.navigatePage("ListMessages")}>
            <View style={styles.viewText}>
              <Icon name="chatbubbles" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Messages</Text>
              {this.props.chatProps.messageRead > 0 && (
                <View
                  style={[
                    GlobalMessages.viewGlobalBubble,
                    {
                      marginTop: 0,
                      justifyContent: "center",
                      marginLeft: 5,
                    },
                  ]}>
                  <View style={GlobalMessages.viewBubble}>
                    <Text style={GlobalMessages.text}>
                      {this.props.chatProps.messageRead}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.navigatePage("Notifications")}>
            <View style={styles.viewText}>
              <Icon name="notifications" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Notifications</Text>
              {undefined !== this.props.notifications &&
                undefined !== this.props.notifications.notificationsUnRead &&
                this.props.notifications.notificationsUnRead > 0 && (
                  <View
                    style={[
                      GlobalMessages.viewGlobalBubble,
                      {
                        marginTop: 0,
                        justifyContent: "center",
                        marginLeft: 5,
                      },
                    ]}>
                    <View style={GlobalMessages.viewBubble}>
                      <Text style={GlobalMessages.text}>
                        {this.props.notifications.notificationsUnRead}
                      </Text>
                    </View>
                  </View>
                )}
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={this.navigateJourney}>
            <View style={styles.viewText}>
              <Icon name="images" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Journey</Text>
            </View>
          </Pressable>
        </View>
        {/* 
                        // TODO: Commented to the client's request because arrangements are expected on the blog
                        <View style={styles.viewTouchable}>
                            <Pressable onPress={() => this.navigatePage('Blog')}>
                                <View style={styles.viewText}>
                                    <Icon name="globe-outline" size={22} color={SignUpColor} />
                                    <Text style={styles.textButton}>Blog</Text>
                                </View>
                            </Pressable>
                        </View> 
                    */}
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.navigatePage("Settings")}>
            <View style={styles.viewText}>
              <Icon name="cog" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Settings</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.navigatePage("Blocks")}>
            <View style={styles.viewText}>
              <Icon name="lock-closed" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Blocked users</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.viewTouchable}>
          <Pressable onPress={() => this.logoutUser()}>
            <View style={styles.viewText}>
              <Icon name="ios-log-out-outline" size={22} color={SignUpColor} />
              <Text style={styles.textButton}>Logout</Text>
            </View>
          </Pressable>
        </View>

        <LoadingSpinner visible={this.state.loading} />
        <Toast toastText={this.state.toastText} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewTitle: {
    marginTop: 10,
    paddingLeft: 10,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
  viewTouchable: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  viewText: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    marginLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  chatProps: state.reducerChat,
  notifications: state.reducerNotification,
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: (sUserKey) => {
    dispatch(actionUserSessionClose(sUserKey));
  },
  navigateHome: () => {
    dispatch(actionNavigateToHome());
  },
  navigateJourney: () => {
    dispatch(actionNavigateToJourneys());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedSideMenu);
