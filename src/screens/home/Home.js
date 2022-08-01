import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Share,
  Pressable
} from "react-native";
import { GreenFitrecColor, WhiteColor, GlobalStyles } from "../../Styles";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Toast } from "../../components/shared/Toast";
import { connect } from "react-redux";
import { actionGetUserHome } from "../../redux/actions/HomeActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { FlatList } from "react-native";
import { lActivitiesIcon, lActivitiesHome } from "../../Constants";
import ShowPeople from "../../components/home/ShowPeople";
import {
  actionGetMessages,
  actionSendMessageAll,
  actionSetConversationToNotification,
} from "../../redux/actions/ChatActions";
import HomeFilters from "../../components/home/HomeFilters";
import {
  actionCheckOneSignalCode,
  actionGetNotifications,
} from "../../redux/actions/UserActions";
import OneSignal from "react-native-onesignal";
import FastImage from "react-native-fast-image";
import {
  actionGetGroupInvitations,
  actionGetGroups,
} from "../../redux/actions/GroupActions";
import {
  actionGetAllActivities,
  actionGetGyms,
} from "../../redux/actions/ActivityActions";
import SelectActivities from "../../components/register/SelectActivities";
import SelectGyms from "../../components/register/SelectGyms";
import Swiper from "react-native-swiper";
import JourneyList from "../journey/JourneyList";
import {
  actionCleanNavigation,
  actionNavigateToGroup,
  actionNavigateToMyPals,
  actionNavigateToNotifications,
} from "../../redux/actions/NavigationActions";
import {
  NOTIFICATION_CAPTAIN,
  NOTIFICATION_FOLLOW,
  NOTIFICATION_GROUP_INVITATION,
  NOTIFICATION_JOURNEY_TAG,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_MESSAGE_GROUP,
  NOTIFICATION_PAL_REQUEST,
  NOTIFICATION_REQUEST_JOIN_GROUP,
  NOTIFICATION_NEW_CAPTAIN_GROUP,
} from "../../constants/Notifications";
import { actionGetMyFriends } from "../../redux/actions/ProfileActions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastText: "",
      refreshing: false,
      loading: false,
      activities: [],
      refresh: false,
      selectActivity: null,
      showActivity: false,
      showFilters: false,
      filters: {
        activity: [],
        range: "",
        gender: "",
        gyms: [],
      },
      activitiesFilter: [],
      showSelectActivities: false,
      gyms: [],
      showGyms: false,
      index: 0,
    };
    // Listeners for notifications onignal
    // Comment at the customer's request, the comment will be kept for the doubts of a rollback - Leandro Curbelo 03/11/2020
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
  }
  // METHOD OPEN NOTIFICATION
  onOpened = (oData) => {
    // Action when the notification opens
    var oNotification = oData.notification.payload.additionalData;
    const { account: oAccount } = this.props.session;
    // Sentence to know if the user is logged
    if (oAccount) {
      if (!oNotification)
        return this.props.navigation.navigate("ListNotifications");
      // All: Actions to be taken on the notification
      // The types of notification are detailed in Readme.MD
      switch (oNotification.type) {
        case NOTIFICATION_MESSAGE:
          this.props.sendConversationKey(oNotification.id);
          this.props.getMessages(oNotification.id, oAccount.key);
          this.props.navigation.navigate("Messages");
          break;
        case NOTIFICATION_NEW_CAPTAIN_GROUP:
        case NOTIFICATION_MESSAGE_GROUP:
          this.props.navigateToGroup(oNotification.id);
          this.props.navigation.navigate("Groups");
          break;
        case NOTIFICATION_PAL_REQUEST:
          this.props.navigation.navigate("MyPals");
          this.props.navigatePals();
          break;
        case NOTIFICATION_REQUEST_JOIN_GROUP:
          this.props.getGroups(oAccount.key);
          this.props.navigation.navigate("Groups", {
            groupId: oNotification.id,
            request: true,
          });
          break;
        case NOTIFICATION_GROUP_INVITATION:
          this.props.getInvitationsGroup({ accountId: oAccount.key });
          this.props.navigation.navigate("Groups", { invitation: true });
          break;
        case NOTIFICATION_CAPTAIN:
          this.props.getNotifications();
          this.props.navigateToNotification(oNotification.id);
          this.props.navigation.navigate("ListNotifications");
          break;
        case NOTIFICATION_JOURNEY_TAG:
        case NOTIFICATION_FOLLOW:
        default:
          this.props.navigation.navigate("ListNotifications");
          break;
      }
    }
  };

  navigateGroup = (sGroupKey) => {
    this.props.getGroup(sGroupKey, this.props.session.account.key);
    this.props.navigation.navigate("DetailsGroup");
  };

  componentDidMount = () => {
    this.props.navigation.setParams({
      sharedButton: this.sharedOption,
      showTab: false,
    });
    this.getUserHome();
    this.checkOneSignalCode();
    this.props.getAllActivities();
    this.props.getGyms();
    if (
      this.props.palsProps.myFriends.status !== true &&
      this.props.palsProps.myFriends.length === 0
    )
      this.props.getMyFriends();
  };

  checkOneSignalCode = () => {
    console.log('this.props.session.account ====>>>> ', this.props.session.account);
    if (null !== this.props.session.account) {
      this.props.checkOneSignalCode({
        accountId: this.props.session.account.key,
      });
    }
  };

  getUserHome = () => {
    let aActivities =
      this.state.filters.activity.length > 0
        ? this.state.filters.activity
        : null,
      sGarder =
        this.state.filters.gender !== "" ? this.state.filters.gender : null,
      aGyms =
        this.state.filters.gyms.length > 0 ? this.state.filters.gyms : null,
      sRange =
        this.state.filters.range !== "" ? this.state.filters.range : null;
    this.props.getUserHome(aActivities, sGarder, aGyms, sRange);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.homeProps.status) {
      this.setState({
        activities: nextProps.homeProps.activities,
        refresh: !this.state.refresh,
      });
    } else if (
      !nextProps.homeProps.status &&
      "" !== nextProps.homeProps.messageError
    ) {
      this.showToast(nextProps.homeProps.messageError);
    } else if (
      this.props.chatProps !== nextProps.chatProps &&
      nextProps.chatProps.statusSend
    ) {
      this.showToast("Message sent successfully");
      if (null !== this.state.selectActivity) {
        this.state.selectActivity.users.map((element) => {
          element.check = false;
        });
      }
    }
    if (nextProps.activity.activities.length > 0) {
      this.setState({
        activitiesFilter: nextProps.activity.activities,
      });
    }
    if (nextProps.activity.gyms.length > 0 && this.state.gyms.length === 0)
      this.setState({
        gyms: nextProps.activity.gyms,
      });
    if (this.props.blockProps.status)
      this.setState({ showActivity: false });

    if (nextProps.homeProps.bNavigationHome) {
      if (this.oSwiperRef) this.oSwiperRef.scrollTo(0, true);
      this.props.cleanNavigation();
    }

    this.setState({
      loading: false,
      refreshing: false,
      refresh: !this.state.refresh,
    });
  };

  sharedOption = () => {
    Share.share({
      message:
        this.props.session.account.name +
        " has just invited you to check out a hot new Social Fitness application called, " +
        "FITREC. Go to 'www.FITREC.com' to discover why we're better together, when it comes " +
        "to health and fitness. Or, download the app today for Android 'https://play.google.com/" +
        "store/apps/details?id=com.fitrecApp' or for iOS 'https://itunes.apple.com/us/app/fitrec/id1183833997?mt=8'",
    });
  };

  showToast = (sText, callback = null) => {
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

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getUserHome();
  };

  getImgActivity(sActivityName) {
    var lActivityImg = lActivitiesHome.find(
      (lActivity) => lActivity.name === sActivityName
    );
    if (undefined !== lActivityImg) {
      return lActivityImg.img;
    }
  }

  getIcon(sActivityName) {
    var lActivityIcon = lActivitiesIcon.find(
      (lActivity) => lActivity.name === sActivityName
    );
    if (undefined !== lActivityIcon) {
      return lActivityIcon.icon;
    }
  }

  openActivity = (lItem) => {
    this.setState({
      selectActivity: lItem,
      showActivity: true,
      showFilters: false,
    });
  };

  sendMessage = (message) => {
    this.setState({
      loading: true,
    });
    var sendUsers = [];
    for (let element of this.state.selectActivity.users) {
      if (element.check && element.key !== null) {
        sendUsers.push(element.key);
      }
    }
    this.props.sendMessage({
      accountId: this.props.session.account.key,
      message: message,
      participants: sendUsers,
      type: "text",
      name: this.props.session.account.name,
    });
  };

  setFilters = (data, bIsDefault = false) => {
    if (bIsDefault) {
      this.state.activitiesFilter.forEach((oActivity) => {
        oActivity.selected = false;
      });
      this.state.gyms.forEach((oGym) => {
        oGym.selected = false;
      });
    }
    this.setState({
      filters: {
        activity: data.activity,
        range: data.range,
        gender: data.gender,
        gyms: data.gyms,
      },
      showFilters: false,
    });
    this.getUserHome();
  };

  applyActivityFilter = () => {
    var aActivitiesIds = [];
    this.state.activitiesFilter.forEach((oActivity) => {
      if (oActivity.selected === true) aActivitiesIds.push(oActivity);
    });
    this.setState({
      filters: {
        ...this.state.filters,
        activity: aActivitiesIds,
      },
      showSelectActivities: false,
    });
    this.setFilters(this.state.filters);
  };

  applyGymFilter = () => {
    var aGymIds = [];
    this.state.gyms.forEach((oGym) => {
      if (oGym.selected === true) aGymIds.push(oGym);
    });
    this.setState({
      filters: {
        ...this.state.filters,
        gyms: aGymIds,
      },
      showGyms: false,
    });
    this.setFilters(this.state.filters);
  };

  swipe = (nIndex) => {
    this.props.navigation.setParams({
      index: nIndex,
    });
    this.setState({ index: nIndex });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.swiperHome === undefined ? (
          <Swiper
            loop={false}
            showsPagination={false}
            onIndexChanged={(nIndex) => this.swipe(nIndex)}
            scrollEnabled={true}
            horizontal={true}
            ref={(oRef) => (this.oSwiperRef = oRef)}
          >
            <View style={styles.contentSwipe}>{this.renderContent()}</View>
            <View style={styles.contentSwipe}>
              <JourneyList
                swiperHome={true}
                navigation={this.props.navigation}
                indexHome={this.state.index}
              />
            </View>
          </Swiper>
        ) : (
          this.renderContent()
        )}
      </View>
    );
  }

  renderContent = () => {
    return (
      <ImageBackground
        source={require("../../assets/bk.png")}
        resizeMode="stretch"
        style={GlobalStyles.fullImage}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.state.activities}
            extraData={this.state.refresh}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.activityContent}>
                <Pressable
                  onPress={() => {
                    this.openActivity(item);
                  }}
                >
                  <View style={styles.activityHead}>
                    <View style={styles.activityHeadLeft}>
                      <Image
                        style={styles.activityIcon}
                        source={this.getIcon(item.name)}
                      />
                      <Text style={styles.activityText}>{item.name} </Text>
                    </View>
                    <View style={styles.activityHeadRight}>
                      <FlatList
                        data={item.users.slice(0, 3)}
                        style={{ flexDirection: "row" }}
                        renderItem={({ item }) =>
                          null !== item.image ? (
                            <FastImage
                              style={styles.activityImageProfile}
                              source={{
                                uri: item.image,
                                priority: FastImage.priority.high,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          ) : (
                            <Image
                              style={styles.activityImageProfile}
                              source={require("../../assets/profile.png")}
                            />
                          )
                        }
                      />
                      <Text style={styles.activityText}>
                        {item.users.length > 3 &&
                          "+" + String(item.users.length - 3)}
                      </Text>
                      <SimpleLineIcons
                        name="bubble"
                        color={WhiteColor}
                        size={28}
                      />
                    </View>
                  </View>
                  <Image
                    style={styles.activityImageBrackground}
                    source={this.getImgActivity(item.name)}
                  />
                </Pressable>
              </View>
            )}
          />
        </ScrollView>
        <Toast toastText={this.state.toastText} />
        <LoadingSpinner visible={this.state.loading} />
        <ShowPeople
          visible={this.state.showActivity}
          activity={this.state.selectActivity}
          close={() => {
            this.setState({ showActivity: false });
          }}
          sendMessage={(message) => this.sendMessage(message)}
          navigation={this.props.navigation}
        />
        <HomeFilters
          visible={this.state.showFilters}
          press={() => {
            this.setState({ showFilters: !this.state.showFilters });
          }}
          setFilter={(data, bIsDefault = false) =>
            this.setFilters(data, bIsDefault)
          }
          filters={this.state.filters}
          activities={this.state.activities}
          showActivities={() => this.setState({ showSelectActivities: true })}
          showGyms={() => this.setState({ showGyms: true })}
        />
        <SelectActivities
          visible={this.state.showSelectActivities}
          activities={this.state.activitiesFilter}
          close={() => this.applyActivityFilter()}
        />
        <SelectGyms
          visible={this.state.showGyms}
          gyms={this.state.gyms}
          close={() => this.applyGymFilter()}
          message={(sMessage) => this.showToast(sMessage)}
        />
      </ImageBackground>
    );
  };
}

const styles = StyleSheet.create({
  activityContent: {
    backgroundColor: GreenFitrecColor,
    marginBottom: 10,
  },
  scrollView: {
    paddingBottom: 10,
  },
  activityHead: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
  },
  activityHeadLeft: {
    paddingTop: 10,
    paddingBottom: 10,
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  activityHeadRight: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  activityIcon: {
    width: 30,
    height: 30,
  },
  activityText: {
    color: WhiteColor,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
    marginRight: 5,
  },
  activityImageBrackground: {
    width: "100%",
    height: 100,
  },
  activityImageProfile: {
    width: 35,
    height: 35,
    backgroundColor: WhiteColor,
    borderRadius: 100,
    marginRight: 5,
  },
  contentSwipe: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  homeProps: state.reducerHome,
  chatProps: state.reducerChat,
  activity: state.reducerActivity,
  blockProps: state.reducerBlock,
  palsProps: state.reducerMyPals,
});

const mapDispatchToProps = (dispatch) => ({
  getUserHome: (aActivities, sGarder, aGyms, sRange) => {
    dispatch(actionGetUserHome(aActivities, sGarder, aGyms, sRange));
  },
  sendMessage: (data) => {
    dispatch(actionSendMessageAll(data));
  },
  checkOneSignalCode: (data) => {
    dispatch(actionCheckOneSignalCode(data));
  },
  getInvitationsGroup: (data) => {
    dispatch(actionGetGroupInvitations(data));
  },
  getNotifications: () => {
    dispatch(actionGetNotifications());
  },
  getAllActivities: () => {
    dispatch(actionGetAllActivities());
  },
  getGyms: () => {
    dispatch(actionGetGyms());
  },
  cleanNavigation: () => {
    dispatch(actionCleanNavigation());
  },
  sendConversationKey: (sConversationKey) => {
    dispatch(actionSetConversationToNotification(sConversationKey));
  },
  getMessages: (sConversationId, sUserKey) => {
    dispatch(actionGetMessages(sConversationId, sUserKey));
  },
  getGroups: (sUserKey) => {
    dispatch(actionGetGroups(sUserKey));
  },
  navigateToGroup: (sGroupKey) => {
    dispatch(actionNavigateToGroup(sGroupKey));
  },
  navigateToNotification: (nNotificationId) => {
    dispatch(actionNavigateToNotifications(nNotificationId));
  },
  navigatePals: () => {
    dispatch(actionNavigateToMyPals());
  },
  getMyFriends: () => {
    dispatch(actionGetMyFriends());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
