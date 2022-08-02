import React, { Component } from "react";
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
import { connect } from "react-redux";
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

class ListNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastText: "",
      refreshing: false,
      loading: false,
      showGroupInvitation: false,
      toastText: "",
      group: null,
      isRequestPending: true,
      journeySelect: [],
      showQuestionDeleteAll: false,
      showNotificationGroup: false,
      notificationText: "",
      capitanName: "",
      groupName: "",
      groupKey: "",
    };
    this.oNotificationRows = [];
  }

  componentDidMount = () => {
    this.props.navigation.setParams({
      deleteAll: this.deleteAllNotificationsQuestion,
    });
    this.props.getNotifications();
    this.props.getJourneyList();
    var nNotificationId = this.props.navigation.getParam(
      "notificationId",
      null
    );
    if (null !== nNotificationId) {
      this.props.notificationProps.notifications.forEach((oElement) => {
        if (oElement.id === nNotificationId) {
          this.openNotification(oElement);
        }
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      refreshing: false,
      loading: false,
    });
    if (
      this.props.invitationsProps !== nextProps.invitationsProps &&
      nextProps.invitationsProps.invitationAction
    ) {
      this.openRequestGroup(this.props.invitationsProps.groupId);
    }
    if (nextProps.notificationProps.status) {
      this.props.cleanGroupNotification();
      this.setState({
        group: nextProps.notificationProps.group,
        showGroupInvitation: true,
        loading: false,
        isRequestPending: nextProps.notificationProps.group.requestPending,
      });
    }
    if (nextProps.notificationProps.nNotificationId !== null) {
      let oNotification = this.props.notificationProps.notifications.filter(
        (oNotification) =>
          oNotification.id === nextProps.notificationProps.nNotificationId
      );
      if (oNotification.length > 0) {
        this.openNotification(oNotification[0]);
        this.props.cleanNavigation();
      }
    }
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

  refreshNotifications = () => {
    this.props.getNotifications();
    this.props.getJourneyList();
    this.setState({
      loading: true,
      refreshing: true,
    });
  };

  openNotification = (oNotification) => {
    if (!this.state.loading) {
      this.props.viewNotification(oNotification.id);
      switch (oNotification.type) {
        case NOTIFICATION_TYPE_GROUP_CHAT:
          this.props.navigation.navigate("ListMessages");
          break;
        case NOTIFICATION_SEND_REQUEST:
          this.props.navigation.navigate("MyPals");
          this.props.navigatePals();
          break;
        case NOTIFICATION_TYPE_NEW_CAPTAIN:
          if (!oNotification.group) break;
          const { key: sKey } = oNotification.group;
          this.props.navigateToGroup(sKey);
          this.props.navigation.navigate("Groups");
          break;
        case NOTIFICATION_INVITATION_GROUP:
        case NOTIFICATION_REQUEST_GROUP:
          this.openRequestGroup(oNotification.group.key);
          break;
        case NOTIFICATION_CAPITAN_MESSAGE_GROUP:
          this.setState({
            showNotificationGroup: true,
            notificationText: oNotification.description,
            capitanName: oNotification.user.name,
            groupName: oNotification.group.name,
            groupKey: oNotification.group.key,
          });
          break;
        case NOTIFICATION_TYPE_LIKE_JOURNEY:
        case NOTIFICATION_TYPE_TAG_JOURNEY:
          this.props.navigation.navigate("ShowJourney", {
            id: oNotification.journey.id,
          });
          break;
        case NOTIFICATION_TYPE_NEW_FOLLOWER:
          this.props.getProfile(oNotification.id_send);
          this.props.navigation.navigate("ProfileViewDetails");
          break;
        default:
          break;
      }
    }
  };

  openRequestGroup = (groupId) => {
    this.props.openGroupNotification(groupId, this.props.session.account.key);
  };

  navigateGroup = (sGroupKey) => {
    this.props.getGroup(sGroupKey, this.props.session.account.key);
    this.props.navigation.navigate("DetailsGroup");
  };

  showToast = (sText) => {
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

  rejectRequest = () => {
    this.setState({
      loading: true,
    });
    this.props.rejectInvitationGroup({
      accountId: this.props.session.account.key,
      groupId: this.state.group.key,
    });
  };

  acceptRequest = () => {
    this.setState({
      loading: true,
    });
    let nGroupId = this.state.group.id,
      sGroupKey = this.state.group.key,
      nUserId = this.props.session.account.id,
      sUserKey = this.props.session.account.key,
      sUserName = this.props.session.account.name;
    this.props.acceptInvitationGroup(
      nGroupId,
      sGroupKey,
      nUserId,
      sUserKey,
      sUserName
    );
  };

  deleteNotification = (oNotification) => {
    this.setState({
      loading: true,
    });
    this.props.deleteNotification(oNotification.id);
    this.oNotificationRows[oNotification.id].close();
  };

  deleteAllNotificationsQuestion = () => {
    this.props.notificationProps.notifications.length > 0
      ? this.setState({
          showQuestionDeleteAll: true,
        })
      : this.showToast("You have no notifications to delete");
  };

  deleteAllNotifications = () => {
    this.setState({
      loading: true,
      showQuestionDeleteAll: false,
    });
    this.props.deleteAllNotification();
  };

  deleteButtonRender = (item) => {
    return (
      <TouchableHighlight>
        <Pressable
          style={styles.buttonDelete}
          onPress={() => this.deleteNotification(item)}
        >
          <Icon name="trash" size={26} color={WhiteColor} />
        </Pressable>
      </TouchableHighlight>
    );
  };

  expandImage = (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  onCancleHandler = () => {
    this.setState({
      showNotificationGroup: false,
      capitanName: "",
      notificationText: "",
      groupName: "",
      groupKey: "",
    });
  };

  onViewGroupHandler = () => {
    this.navigateGroup(this.state.groupKey);
    this.setState({
      showNotificationGroup: false,
      capitanName: "",
      notificationText: "",
      groupName: "",
      groupKey: "",
    });
  };

  render = () => {
    return (
      <ImageBackground
        source={require("../../assets/bk.png")}
        resizeMode="cover"
        style={GlobalStyles.fullImageGroups}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.refreshNotifications()}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.props.notificationProps.notifications}
            renderItem={({ item }) => (
              <View>
                <Swipeable
                  renderRightActions={() => this.deleteButtonRender(item)}
                  ref={(ref) => (this.oNotificationRows[item.id] = ref)}
                >
                  <Pressable onPress={() => this.openNotification(item)}>
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
        {this.state.showQuestionDeleteAll && (
          <View style={ToastQuestionGenericStyles.contentToastConfirm}>
            <View style={ToastQuestionGenericStyles.viewToast}>
              <Text style={ToastQuestionGenericStyles.textToast}>
                Are you sure you want to delete all notifications?
              </Text>
              <View style={styles.flexRow}>
                <View style={styles.width50}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() =>
                      this.setState({ showQuestionDeleteAll: false })
                    }
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.width50}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => this.deleteAllNotifications()}
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
        <Toast toastText={this.state.toastText} />
        <InvitationGroup
          visible={this.state.showGroupInvitation}
          group={this.state.group}
          close={() => {
            this.setState({ showGroupInvitation: false, group: null });
          }}
          rejectRequest={() => {
            this.rejectRequest();
          }}
          acceptRequest={() => {
            this.acceptRequest();
          }}
          sUserKey={this.props.session.account.key}
          isRequestPending={this.state.isRequestPending}
          expandImage={(sUrlToImage) => this.expandImage(sUrlToImage)}
        />
        {this.state.showNotificationGroup && (
          <View style={ToastQuestionGenericStyles.contentToastConfirm}>
            <View style={ToastQuestionGenericStyles.viewToast}>
              <Text style={ToastQuestionGenericStyles.titleToast}>
                {this.state.groupName}
              </Text>
              <Text style={ToastQuestionGenericStyles.subTitleToast}>
                {this.state.capitanName}:
              </Text>
              <Text style={ToastQuestionGenericStyles.textToast}>
                {this.state.notificationText}
              </Text>
              <View style={styles.flexRow}>
                <View style={styles.cancleButtonView}>
                  <Pressable
                    style={GlobalStyles.buttonCancel}
                    onPress={this.onCancleHandler}
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.groupButtonView}>
                  <Pressable
                    style={GlobalStyles.buttonConfirm}
                    onPress={this.onViewGroupHandler}
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
        <LoadingSpinner visible={this.state.loading} />
        <Toast toastText={this.state.toastText} />
      </ImageBackground>
    );
  };
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
