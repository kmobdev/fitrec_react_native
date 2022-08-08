import React, { Component, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Share,
  Pressable,
} from "react-native";
import { GreenFitrecColor, WhiteColor, GlobalStyles } from "../../Styles";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Toast } from "../../components/shared/Toast";
import { connect, useDispatch } from "react-redux";
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

const Home = (props) => {

  // Listeners for notifications onignal
  // Comment at the customer's request, the comment will be kept for the doubts of a rollback - Leandro Curbelo 03/11/2020
  // OneSignal.addEventListener('received', this.onReceived);
  // OneSignal.addEventListener('opened', this.onOpened);

  const swiperRef = useRef();

  const dispatch = useDispatch();

  const [toastText, setToastText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectActivity, setSelectActivity] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    activity: [],
    range: "",
    gender: "",
    gyms: [],
  });
  const [activitiesFilter, setActivitiesFilter] = useState([]);
  const [showSelectActivities, setShowSelectActivities] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [showGyms, setShowGyms] = useState(false);
  const [index, setIndex] = useState(0);

  // METHOD OPEN NOTIFICATION
  // onOpened = (oData) => {
  //   // Action when the notification opens
  //   var oNotification = oData.notification.payload.additionalData;
  //   const { account: oAccount } = this.props.session;
  //   // Sentence to know if the user is logged
  //   if (oAccount) {
  //     if (!oNotification)
  //       return props.navigation.navigate("ListNotifications");
  //     // All: Actions to be taken on the notification
  //     // The types of notification are detailed in Readme.MD
  //     switch (oNotification.type) {
  //       case NOTIFICATION_MESSAGE:
  //         this.props.sendConversationKey(oNotification.id);
  //         this.props.getMessages(oNotification.id, oAccount.key);
  //         props.navigation.navigate("Messages");
  //         break;
  //       case NOTIFICATION_NEW_CAPTAIN_GROUP:
  //       case NOTIFICATION_MESSAGE_GROUP:
  //         this.props.navigateToGroup(oNotification.id);
  //         props.navigation.navigate("Groups");
  //         break;
  //       case NOTIFICATION_PAL_REQUEST:
  //         props.navigation.navigate("MyPals");
  //         this.props.navigatePals();
  //         break;
  //       case NOTIFICATION_REQUEST_JOIN_GROUP:
  //         this.props.getGroups(oAccount.key);
  //         props.navigation.navigate("Groups", {
  //           groupId: oNotification.id,
  //           request: true,
  //         });
  //         break;
  //       case NOTIFICATION_GROUP_INITATION:
  //         this.props.getInvitationsGroup({ accountId: oAccount.key });
  //         props.navigation.navigate("Groups", { invitation: true });
  //         break;
  //       case NOTIFICATION_CAPTAIN:
  //         this.props.getNotifications();
  //         this.props.navigateToNotification(oNotification.id);
  //         props.navigation.navigate("ListNotifications");
  //         break;
  //       case NOTIFICATION_JOURNEY_TAG:
  //       case NOTIFICATION_FOLLOW:
  //       default:
  //         props.navigation.navigate("ListNotifications");
  //         break;
  //     }
  //   }
  // };

  useEffect(() => {
    props.navigation.setParams({
      sharedButton: getUserHome,
      showTab: false,
    });

    getUserHome();
    checkOneSignalCode();
    dispatch(actionGetAllActivities());
    dispatch(actionGetGyms());
    if (
      props.palsProps.myFriends.status !== true &&
      props.palsProps.myFriends.length === 0
    )
      dispatch(actionGetMyFriends());

  }, []);

  // componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.homeProps.status) {
  //     this.setState({
  //       activities: nextProps.homeProps.activities,
  //       refresh: !refresh,
  //     });
  //   } else if (
  //     !nextProps.homeProps.status &&
  //     "" !== nextProps.homeProps.messageError
  //   ) {
  //     showToast(nextProps.homeProps.messageError);
  //   } else if (
  //     this.props.chatProps !== nextProps.chatProps &&
  //     nextProps.chatProps.statusSend
  //   ) {
  //     showToast("Message sent successfully");
  //     if (null !== selectActivity) {
  //       selectActivity.users.map((element) => {
  //         element.check = false;
  //       });
  //     }
  //   }
  //   if (nextProps.activity.activities.length > 0) {
  //     this.setState({
  //       activitiesFilter: nextProps.activity.activities,
  //     });
  //   }
  //   if (nextProps.activity.gyms.length > 0 && gyms.length === 0)
  //     this.setState({
  //       gyms: nextProps.activity.gyms,
  //     });
  //   if (this.props.blockProps.status) this.setState({ showActivity: false });

  //   if (nextProps.homeProps.bNavigationHome) {
  //     if (swiperRef) swiperRef.current.scrollTo(0, true);
  //     this.props.cleanNavigation();
  //   }

  //   this.setState({
  //     loading: false,
  //     refreshing: false,
  //     refresh: !refresh,
  //   });
  // };

  const navigateGroup = (sGroupKey) => {
    props.getGroup(sGroupKey, props.session.account.key);
    props.navigation.navigate("DetailsGroup");
  };

  const checkOneSignalCode = () => {
    console.log(
      "this.props.session.account ====>>>> ",
      props.session.account
    );
    if (null !== props.session.account) {
      dispatch(actionCheckOneSignalCode({
        accountId: props.session.account.key,
      }));

    }
  };

  const getUserHome = () => {
    let aActivities =
      filters.activity.length > 0
        ? filters.activity
        : null,
      sGarder =
        filters.gender !== "" ? filters.gender : null,
      aGyms =
        filters.gyms.length > 0 ? filters.gyms : null,
      sRange =
        filters.range !== "" ? filters.range : null;
    dispatch(actionGetUserHome(aActivities, sGarder, aGyms, sRange));
  };

  const sharedOption = () => {
    Share.share({
      message:
        props.session.account.name +
        " has just invited you to check out a hot new Social Fitness application called, " +
        "FITREC. Go to 'www.FITREC.com' to discover why we're better together, when it comes " +
        "to health and fitness. Or, download the app today for Android 'https://play.google.com/" +
        "store/apps/details?id=com.fitrecApp' or for iOS 'https://itunes.apple.com/us/app/fitrec/id1183833997?mt=8'",
    });
  };

  const showToast = (text, callback = null) => {
    setToastText(text);
    setLoading(false)
    setTimeout(() => {
      setToastText("");
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  const onRefresh = () => {
    setRefreshing(true)
    getUserHome();
  };

  const getImgActivity = (sActivityName) => {
    var lActivityImg = lActivitiesHome.find(
      (lActivity) => lActivity.name === sActivityName
    );
    if (undefined !== lActivityImg) {
      return lActivityImg.img;
    }
  }

  const getIcon = (sActivityName) => {
    var lActivityIcon = lActivitiesIcon.find(
      (lActivity) => lActivity.name === sActivityName
    );
    if (undefined !== lActivityIcon) {
      return lActivityIcon.icon;
    }
  }

  const openActivity = (item) => {
    setActivities(item);
    setShowActivity(true);
    setShowFilters(false);
  };

  const sendMessageHandler = (message) => {
    setLoading(false);
    var sendUsers = [];
    for (let element of selectActivity.users) {
      if (element.check && element.key !== null) {
        sendUsers.push(element.key);
      }
    }
    let data = {
      accountId: props.session.account.key,
      message: message,
      participants: sendUsers,
      type: "text",
      name: props.session.account.name,
    };
    dispatch(actionSendMessageAll(data));
  };

  const setFiltersHandler = (data, bIsDefault = false) => {
    if (bIsDefault) {
      activitiesFilter.forEach((oActivity) => {
        oActivity.selected = false;
      });
      gyms.forEach((gym) => {
        gym.selected = false;
      });
    }
    setFilters({
      activity: data.activity,
      range: data.range,
      gender: data.gender,
      gyms: data.gyms,
    })
    setShowFilters(false);
    getUserHome();
  };

  const applyActivityFilter = () => {
    var aActivitiesIds = [];
    activitiesFilter.forEach((oActivity) => {
      if (oActivity.selected === true) aActivitiesIds.push(oActivity);
    });
    setFilters({
      ...filters,
      activity: aActivitiesIds,
    });
    setShowSelectActivities(false),
      setFiltersHandler(filters);
  };

  const applyGymFilter = () => {
    var aGymIds = [];
    gyms.forEach((oGym) => {
      if (oGym.selected === true) aGymIds.push(oGym);
    });
    setFilters({
      ...filters,
      gyms: aGymIds,
    });
    setShowGyms(false);
    setFiltersHandler(filters);
  };

  const swipe = (index) => {
    props.navigation.setParams({
      index: index,
    });
    setIndex(index);
  };

  const renderContent = () => {
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
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={activities}
            extraData={refresh}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.activityContent}>
                <Pressable
                  onPress={() => openActivity(item)}
                >
                  <View style={styles.activityHead}>
                    <View style={styles.activityHeadLeft}>
                      <Image
                        style={styles.activityIcon}
                        source={getIcon(item.name)}
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
                    source={getImgActivity(item.name)}
                  />
                </Pressable>
              </View>
            )}
          />
        </ScrollView>
        <Toast toastText={toastText} />
        <LoadingSpinner visible={loading} />
        <ShowPeople
          visible={showActivity}
          activity={selectActivity}
          close={() => setShowActivity(false)}
          sendMessage={(message) => sendMessageHandler(message)}
          navigation={props.navigation}
        />
        <HomeFilters
          visible={showFilters}
          press={() => {
            setShowFilters(!showFilters);
          }}
          setFilter={(data, bIsDefault = false) =>
            setFiltersHandler(data, bIsDefault)
          }
          filters={filters}
          activities={activities}
          showActivities={() => setSelectActivity(true)}
          showGyms={() => setShowGyms(true)}
        />
        <SelectActivities
          visible={showSelectActivities}
          activities={activitiesFilter}
          close={applyActivityFilter}
        />
        <SelectGyms
          visible={showGyms}
          gyms={gyms}
          close={applyGymFilter}
          message={(message) => showToast(message)}
        />
      </ImageBackground>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {props.swiperHome === undefined ? (
        <Swiper
          loop={false}
          showsPagination={false}
          onIndexChanged={(index) => swipe(index)}
          scrollEnabled={true}
          horizontal={true}
          ref={swiperRef}
        >
          <View style={styles.contentSwipe}>{renderContent}</View>
          <View style={styles.contentSwipe}>
            <JourneyList
              swiperHome={true}
              navigation={props.navigation}
              indexHome={index}
            />
          </View>
        </Swiper>
      ) : (
        renderContent
      )}
    </View>
  );

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
