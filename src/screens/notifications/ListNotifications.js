import React, { Component, useEffect, useRef, useState } from "react";
import {
  Text,
  ImageBackground,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Pressable,
  FlatList,
  TouchableHighlight,
} from "react-native";
import {
  GlobalStyles,
  GreenFitrecColor,
  SignUpColor,
  PlaceholderColor,
  WhiteColor,
  ToastQuestionGenericStyles,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  actionGetNotifications,
  actionViewNotification,
} from "../../redux/actions/UserActions";
import {
  actionOpenGroup,
  actionRejectInvitationGroup,
  actionAcceptInvitationGroup,
  actionGetGroup,
} from "../../redux/actions/GroupActions";
import moment from "moment/min/moment-with-locales";
import { Toast } from "../../components/shared/Toast";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { InvitationGroup } from "../../components/groups/InvitationGroup";
import { actionGetJourneyList } from "../../redux/actions/JourneyActions";
import {
  actionDeleteNotification,
  actionOpenGroupNotification,
  actionCleanOpenGroup,
  actionDeleteAllNotification,
} from "../../redux/actions/NotificationActions";
import { actionExpandImage } from "../../redux/actions/SharedActions";
import {
  NOTIFICATION_CAPITAN_MESSAGE_GROUP,
  NOTIFICATION_INVITATION_GROUP,
  NOTIFICATION_REQUEST_GROUP,
  NOTIFICATION_SEND_REQUEST,
  NOTIFICATION_TYPE_LIKE_JOURNEY,
  NOTIFICATION_TYPE_TAG_JOURNEY,
  NOTIFICATION_TYPE_GROUP_CHAT,
  NOTIFICATION_TYPE_NEW_FOLLOWER,
  NOTIFICATION_TYPE_NEW_CAPTAIN,
} from "../../Constants";
import {
  actionCleanNavigation,
  actionNavigateToGroup,
  actionNavigateToMyPals,
} from "../../redux/actions/NavigationActions";
import { actionGetProfile } from "../../redux/actions/ProfileActions";

const ListNotifications = (props) => {

  const oNotificationRows = useRef();


  const session = useSelector((state) => state.reducerSession);
  const groupProps = useSelector((state) => state.reducerGroup);
  const journeyProps = useSelector((state) => state.reducerJourney);
  const invitationsProps = useSelector((state) => state.reducerInvitationsGroup);
  const notificationProps = useSelector((state) => state.reducerNotification);

  const dispatch = useDispatch();

  const [toastText, setToastText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGroupInvitation, setShowGroupInvitation] = useState(false);
  const [group, setGroup] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(true);
  const [journeySelect, setJourneySelect] = useState([]);
  const [showQuestionDeleteAll, setShowQuestionDeleteAll] = useState(false);
  const [showNotificationGroup, setShowNotificationGroup] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [capitanName, setCapitanName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupKey, setGroupKey] = useState("");

  useEffect(() => {
    props.navigation.setParams({
      deleteAll: deleteAllNotificationsQuestion,
    });
    dispatch(actionGetNotifications());
    dispatch(actionGetJourneyList());
    var nNotificationId = props.navigation.getParam(
      "notificationId",
      null
    );
    if (null !== nNotificationId) {
      props.notificationProps.notifications.forEach((oElement) => {
        if (oElement.id === nNotificationId) {
          openNotification(oElement);
        }
      });
    }
    setRefreshing(false);
    setLoading(false);
  }, [])


  useEffect(() => {
    if (
      props.invitationsProps !== invitationsProps &&
      invitationsProps.invitationAction
    ) {
      openRequestGroup(props.invitationsProps.groupId);
    }
    if (notificationProps.status) {
      dispatch(actionCleanOpenGroup());
      setGroup(notificationProps.group);
      setShowGroupInvitation(true);
      setLoading(false);
      setIsRequestPending(notificationProps.group.requestPending);
    }
    if (notificationProps.nNotificationId !== null) {
      let oNotification = props.notificationProps.notifications.filter(
        (oNotification) =>
          oNotification.id === notificationProps.nNotificationId
      );
      if (oNotification.length > 0) {
        openNotification(oNotification[0]);
        dispatch(actionCleanNavigation());
      }
    }
  }, [invitationsProps, notificationProps])

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

  const refreshNotifications = () => {
    dispatch(actionGetNotifications());
    dispatch(actionGetJourneyList());
    setLoading(true);
    setRefreshing(true);
  };

  const openNotification = (oNotification) => {
    if (!loading) {
      props.viewNotification(oNotification.id);
      switch (oNotification.type) {
        case NOTIFICATION_TYPE_GROUP_CHAT:
          props.navigation.navigate("ListMessages");
          break;
        case NOTIFICATION_SEND_REQUEST:
          props.navigation.navigate("MyPals");
          dispatch(actionNavigateToMyPals());
          break;
        case NOTIFICATION_TYPE_NEW_CAPTAIN:
          if (!oNotification.group) break;
          const { key: sKey } = oNotification.group;
          dispatch(actionNavigateToGroup(sKey));
          props.navigation.navigate("Groups");
          break;
        case NOTIFICATION_INVITATION_GROUP:
        case NOTIFICATION_REQUEST_GROUP:
          openRequestGroup(oNotification.group.key);
          break;
        case NOTIFICATION_CAPITAN_MESSAGE_GROUP:
          setShowNotificationGroup(true);
          setNotificationText(oNotification.description);
          setCapitanName(oNotification.user.name);
          setGroupName(oNotification.group.name);
          setGroupKey(oNotification.group.key)

          break;
        case NOTIFICATION_TYPE_LIKE_JOURNEY:
        case NOTIFICATION_TYPE_TAG_JOURNEY:
          props.navigation.navigate("ShowJourney", {
            id: oNotification.journey.id,
          });
          break;
        case NOTIFICATION_TYPE_NEW_FOLLOWER:
          props.getProfile(oNotification.id_send);
          props.navigation.navigate("ProfileViewDetails");
          break;
        default:
          break;
      }
    }
  };

  const openRequestGroup = (groupId) => {
    dispatch(actionOpenGroupNotification(groupId, session.account.key));
  };

  const navigateGroup = (sGroupKey) => {
    dispatch(actionGetGroup(sGroupKey, session.account.key));
    props.navigation.navigate("DetailsGroup");
  };

  const rejectRequest = () => {
    setLoading(true);
    dispatch(actionRejectInvitationGroup({
      accountId: session.account.key,
      groupId: group.key,
    }));
  };

  const acceptRequest = () => {
    setLoading(true);
    let nGroupId = group.id,
      sGroupKey = group.key,
      nUserId = session.account.id,
      sUserKey = session.account.key,
      sUserName = session.account.name;
    dispatch(
      actionAcceptInvitationGroup(
        nGroupId,
        sGroupKey,
        nUserId,
        sUserKey,
        sUserName
      )
    );
  };

  const deleteNotification = (oNotification) => {
    setLoading(true);
    dispatch(actionDeleteNotification(oNotification.id));
    oNotificationRows[oNotification.id].close();
  };

  const deleteAllNotificationsQuestion = () => {
    props.notificationProps.notifications.length > 0
      ?
      setShowQuestionDeleteAll(true)
      : showToast("You have no notifications to delete");
  };

  const deleteAllNotifications = () => {
    setLoading(true);
    setShowQuestionDeleteAll(false);
    dispatch(actionDeleteAllNotification());
  };

  const deleteButtonRender = (item) => {
    return (
      <TouchableHighlight>
        <Pressable
          style={styles.buttonDelete}
          onPress={() => deleteNotification(item)}
        >
          <Icon name="trash" size={26} color={WhiteColor} />
        </Pressable>
      </TouchableHighlight>
    );
  };

  const expandImage = (urlToImage) => {
    dispatch(actionExpandImage(urlToImage));
  };

  const onCancleHandler = () => {
    setShowNotificationGroup(false);
    setCapitanName("");
    setNotificationText("");
    setGroupName("");
    setGroupKey("");
  };

  const onViewGroupHandler = () => {
    navigateGroup(groupKey);
    setShowNotificationGroup(false);
    setCapitanName("");
    setNotificationText("");
    setGroupName("");
    setGroupKey("");
  };

  return (
    <ImageBackground
      source={require("../../assets/bk.png")}
      resizeMode="cover"
      style={GlobalStyles.fullImageGroups}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshNotifications()}
            tintColor={GreenFitrecColor}
            title="Pull to refresh..."
          />
        }
      >
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={props.notificationProps.notifications}
          renderItem={({ item }) => (
            <View>
              <Swipeable
                renderRightActions={() => deleteButtonRender(item)}
                ref={oNotificationRows[item.id]}
              >
                <Pressable onPress={() => openNotification(item)}>
                  <View
                    style={[
                      styles.viewNotificaton,
                      {
                        backgroundColor:
                          1 == item.view ? WhiteColor : "#EDEDED",
                      },
                    ]}
                  >
                    {null !== item.image ? (
                      <Image
                        style={styles.notificationImage}
                        source={{ uri: item.image }}
                      />
                    ) : (
                      <Image
                        style={styles.notificationImage}
                        source={require("../../assets/imgProfileReadOnly.png")}
                      />
                    )}
                    <View style={styles.userNameMain}>
                      <Text
                        style={styles.textUserReference}
                        numberOfLines={1}
                      >
                        {item.user.name}(@{item.user.username})
                      </Text>
                      <View style={styles.iconMainView}>
                        {item.type == NOTIFICATION_SEND_REQUEST ||
                          item.type == NOTIFICATION_REQUEST_GROUP ||
                          item.type == NOTIFICATION_TYPE_NEW_FOLLOWER ? (
                          <Icon
                            name="md-person-add"
                            size={16}
                            color={SignUpColor}
                          />
                        ) : null}
                        {item.type == NOTIFICATION_CAPITAN_MESSAGE_GROUP ||
                          item.type == NOTIFICATION_INVITATION_GROUP ||
                          item.type == NOTIFICATION_TYPE_NEW_CAPTAIN ? (
                          <Icon
                            name="md-notifications"
                            size={16}
                            color={SignUpColor}
                          />
                        ) : null}
                        {item.type == NOTIFICATION_TYPE_LIKE_JOURNEY ||
                          item.type == NOTIFICATION_TYPE_TAG_JOURNEY ? (
                          <Icon
                            name="md-images"
                            size={16}
                            color={SignUpColor}
                          />
                        ) : null}
                        {item.type == NOTIFICATION_TYPE_GROUP_CHAT ? (
                          <Icon
                            name="chatbubbles"
                            size={16}
                            color={SignUpColor}
                          />
                        ) : null}
                        <Text
                          style={[GlobalStyles.textMuted, { marginLeft: 5 }]}
                        >
                          {item.description}
                        </Text>
                      </View>
                      <Text style={GlobalStyles.textMuted}>
                        {moment(
                          item.created_at,
                          "YYYY-MM-DD H:m:s"
                        ).fromNow()}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Swipeable>
            </View>
          )}
        />
      </ScrollView>
      {showQuestionDeleteAll && (
        <View style={ToastQuestionGenericStyles.contentToastConfirm}>
          <View style={ToastQuestionGenericStyles.viewToast}>
            <Text style={ToastQuestionGenericStyles.textToast}>
              Are you sure you want to delete all notifications?
            </Text>
            <View style={styles.flexRow}>
              <View style={styles.width50}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonCancel}
                  onPress={() => setShowQuestionDeleteAll(false)}
                >
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
              <View style={styles.width50}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonConfirm}
                  onPress={() => deleteAllNotifications()}
                >
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
      <Toast toastText={toastText} />
      <InvitationGroup
        visible={showGroupInvitation}
        group={group}
        close={() => {
          setShowGroupInvitation(false);
          setGroup(null);
        }}
        rejectRequest={rejectRequest}
        acceptRequest={acceptRequest}
        sUserKey={session.account.key}
        isRequestPending={isRequestPending}
        expandImage={(sUrlToImage) => expandImage(sUrlToImage)}
      />
      {showNotificationGroup && (
        <View style={ToastQuestionGenericStyles.contentToastConfirm}>
          <View style={ToastQuestionGenericStyles.viewToast}>
            <Text style={ToastQuestionGenericStyles.titleToast}>
              {groupName}
            </Text>
            <Text style={ToastQuestionGenericStyles.subTitleToast}>
              {capitanName}:
            </Text>
            <Text style={ToastQuestionGenericStyles.textToast}>
              {notificationText}
            </Text>
            <View style={styles.flexRow}>
              <View style={styles.cancleButtonView}>
                <Pressable
                  style={GlobalStyles.buttonCancel}
                  onPress={onCancleHandler}
                >
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
              <View style={styles.groupButtonView}>
                <Pressable
                  style={GlobalStyles.buttonConfirm}
                  onPress={onViewGroupHandler}
                >
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    View Group
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
      <LoadingSpinner visible={loading} />
      <Toast toastText={toastText} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  viewNotificaton: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: PlaceholderColor,
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  viewButtonOption: {
    flexDirection: "row",
    backgroundColor: SignUpColor,
    borderRadius: 5,
    padding: 5,
    paddingEnd: 10,
    paddingStart: 10,
  },
  viewButtonOptionText: {
    color: WhiteColor,
    marginLeft: 5,
    fontSize: 18,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    justifyContent: "flex-end",
  },
  buttonDelete: {
    height: "100%",
    width: 75,
    backgroundColor: SignUpColor,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  notificationImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  userNameMain: {
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 100,
  },
  flexRow: {
    flexDirection: "row",
  },
  cancleButtonView: {
    width: "45%",
    marginRight: 5,
  },
  groupButtonView: {
    width: "45%",
    marginLeft: 5,
  },
  width50: {
    width: "50%",
  },
  iconMainView: {
    flexDirection: "row",
    marginBottom: 5,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  groupProps: state.reducerGroup,
  journeyProps: state.reducerJourney,
  invitationsProps: state.reducerInvitationsGroup,
  notificationProps: state.reducerNotification,
});

const mapDispatchToProps = (dispatch) => ({
  getNotifications: () => {
    dispatch(actionGetNotifications());
  },
  openGroup: (data) => {
    dispatch(actionOpenGroup(data));
  },
  rejectInvitationGroup: (data) => {
    dispatch(actionRejectInvitationGroup(data, true));
  },
  acceptInvitationGroup: (
    nGroupId,
    sGroupKey,
    nUserId,
    sUserKey,
    sUserName
  ) => {
    dispatch(
      actionAcceptInvitationGroup(
        nGroupId,
        sGroupKey,
        nUserId,
        sUserKey,
        sUserName,
        true
      )
    );
  },
  getJourneyList: () => {
    dispatch(actionGetJourneyList());
  },
  viewNotification: (nNotificationId) => {
    dispatch(actionViewNotification(nNotificationId));
  },
  deleteNotification: (nNotificationId) => {
    dispatch(actionDeleteNotification(nNotificationId));
  },
  deleteAllNotification: () => {
    dispatch(actionDeleteAllNotification());
  },
  openGroupNotification: (sGrouKey, sUserKey) => {
    dispatch(actionOpenGroupNotification(sGrouKey, sUserKey));
  },
  cleanGroupNotification: () => {
    dispatch(actionCleanOpenGroup());
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
  getGroup: (sGroupKey, sUserKey) => {
    dispatch(actionGetGroup(sGroupKey, sUserKey));
  },
  navigatePals: () => {
    dispatch(actionNavigateToMyPals());
  },
  getProfile: (nUserId) => {
    dispatch(actionGetProfile(nUserId, true));
  },
  cleanNavigation: () => {
    dispatch(actionCleanNavigation());
  },
  navigateToGroup: (sGroupKey) => {
    dispatch(actionNavigateToGroup(sGroupKey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ListNotifications);
