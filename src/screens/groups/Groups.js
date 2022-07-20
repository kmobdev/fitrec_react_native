import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  Keyboard,
  ScrollView
} from "react-native";
import {
  GlobalStyles,
  GlobalTabs,
  ToastQuestionGenericStyles,
  WhiteColor,
  PlaceholderColor,
  GreenFitrecColor,
  SignUpColor,
  GlobalMessages,
  GlobalModal,
} from "../../Styles";
import { SearchUsername } from "../../components/chat/SearchUsername";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { Toast } from "../../components/shared/Toast";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { ShowUserRequestGroup } from "../../components/groups/ShowUsersRequestGroup";
import { GetUserAccount } from "../../redux/services/FirebaseServices";
import {
  actionJoinGroup,
  actionGetGroups,
  actionGetGroupsNearMe,
  actionLeaveGroup,
  actionRequestJoinGroup,
  actionAddMember,
  actionResetOpenGroup,
  actionRejectRequest,
  actionAcceptRequest,
  actionGetGroupInvitations,
  actionAcceptInvitationGroup,
  actionRejectInvitationGroup,
  actionResetUpdateGroup,
  actionCleanCreateGroup,
  actionGetGroup,
} from "../../redux/actions/GroupActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import moment from "moment/min/moment-with-locales";
import Geolocation from "@react-native-community/geolocation";
import {
  actionGetMyFriends,
  actionGetProfile,
} from "../../redux/actions/ProfileActions";
import { actionGetPeopleGroup } from "../../redux/actions/MyPalsActions";
import FastImage from "react-native-fast-image";
import { OPTIONS_GEOLOCATION_GET_POSITION } from "../../Constants";
import { actionCleanNavigation } from "../../redux/actions/NavigationActions";
import { GROUP_PRIVATE } from "../../constants/Groups";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      tabSelectMy: true,
      showToastQuestion: false,
      loading: false,
      loadingUsers: false,
      toastText: "",
      groupsNearMe: [],
      search: "",
      searchMember: "",
      searchPeople: "",
      friends: [],
      friendsBack: null,
      isAddParticipant: false,
      newParticipants: [],
      showUserRequestGroupDetails: false,
      group: null,
      refreshing: false,
      showGroupInvitations: false,
      isCapitan: false,
      lastUserViewProfile: {
        id: null,
        key: null,
      },
      isOpenGroup: false,
    };
  }

  componentDidMount = () => {
    this.props.navigation.setParams({
      tabSelectMy: this.state.tabSelectMy,
      openOptions: () => this.openOptions(),
    });
    this.listGroup();
    if (null !== this.state.friendsBack && this.state.friendsBack.length > 0)
      this.setState({
        friends: this.state.friendsBack,
        searchPeople: "",
      });
    if (true === this.props.navigation.getParam("invitation", null)) {
      this.setState({ showGroupInvitations: true });
    } else {
      var sGroupKey = this.props.navigation.getParam("groupId", null);
      if (null !== sGroupKey) {
        this.props.grupProps.listGroup.forEach((oElement) => {
          if (oElement.key === sGroupKey) {
            if (null !== this.props.navigation.getParam("request", null))
              this.openRequestModal(oElement);
            else this.openGroup(oElement.key);
          }
        });
      }
    }
    this.getGroupNearMe(null);
  };

  componentWillReceiveProps = async (nextProps) => {
    await this.setState({
      loading: false,
      refreshing: false,
    });
    undefined === this.props.grupProps.listGroup &&
      undefined === this.props.grupProps.listGroupNearMe &&
      this.listGroup();
    if (
      this.props.grupProps.status &&
      null !== this.props.grupProps.firebaseId &&
      undefined !== this.props.grupProps.firebaseId
    )
      this.openGroup(this.props.grupProps.firebaseId);
    undefined !== nextProps.grupProps.messageError &&
      "" !== nextProps.grupProps.messageError &&
      null !== nextProps.grupProps.messageError &&
      this.showToast(nextProps.grupProps.messageError);
    if (
      null !== nextProps.grupProps.friendRefresh &&
      nextProps.grupProps.friendRefresh
    ) {
      this.setState({
        friendsBack: this.props.friendsProps.myFriends,
        friends: this.props.friendsProps.myFriends,
      });
    }
    if (
      (undefined !== nextProps.grupProps.listGroup &&
        null !== nextProps.grupProps.listGroup) ||
      null !== this.state.group
    ) {
      if (null !== nextProps.grupProps.listGroup) {
        nextProps.grupProps.listGroup.forEach((oGroup) => {
          if (null !== this.state.group) {
            if (oGroup.key === this.state.group.key) {
              if (
                (undefined !== oGroup.usersRequest &&
                  oGroup.usersRequest.length > 0) ||
                oGroup.messages !== this.state.group.messages
              ) {
                this.setState({
                  usersRequest: oGroup.usersRequest,
                  group: oGroup,
                });
              } else {
                if (this.state.showUserRequestGroupDetails) {
                  this.setState({
                    usersRequest: null,
                    group: null,
                    showUserRequestGroupDetails: false,
                  });
                }
              }
            }
          }
        });
      }
    }
    if (
      this.props.invitationsProps !== nextProps.invitationsProps &&
      nextProps.invitationsProps.invitationAction
    ) {
      this.showToast("Invitation processed successfully");
    }
    if (
      this.state.searchPeople !== "" &&
      nextProps.myPalsRequest.peopleFitrec !== this.state.friends
    ) {
      this.state.friends = nextProps.myPalsRequest.peopleFitrec;
    }
    if (
      this.props.friendsProps.status !== true &&
      (null === this.props.friendsProps.myFriends ||
        this.props.friendsProps.myFriends.length === 0)
    )
      this.props.getMyFriends(this.props.session.account.key);
    else if (null === this.state.friendsBack)
      this.setState({
        friendsBack: this.props.friendsProps.myFriends,
        friends: this.props.friendsProps.myFriends,
      });
    if (this.props.grupProps.sGroupKey) {
      this.openGroup(this.props.grupProps.sGroupKey);
      this.props.clearNavigation();
    }
  };

  openGroup = async (sGroupKey) => {
    this.props.getGroup(sGroupKey, this.props.session.account.key);
    this.props.navigation.navigate("DetailsGroup");
  };

  onRefresh = async () => {
    await this.setState({
      refreshing: true,
    });
    this.listGroup();
  };

  listGroup = async (nType = null) => {
    const { tabSelectMy: bIsMyTab } = this.state;
    this.props.getGroupsInvitation({
      accountId: this.props.session.account.key,
    });
    if (!bIsMyTab) {
      await this.setState({
        loading: true,
        showToastQuestion: false,
      });
      if (
        this.state.refreshing ||
        undefined === this.props.grupProps.listGroup ||
        null === this.props.grupProps.listGroup ||
        this.props.grupProps.listGroup.length === 0
      )
        this.props.getGroups(this.props.session.account.key, this.state.search);
      this.getGroupNearMe(nType);
    }
  };

  getGroupNearMe = (nType) => {
    var sFilter = this.state.search,
      sDistance = null,
      nLatitude = null,
      nLongitude = null;
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          if (
            null !== this.props.session.account &&
            position &&
            undefined !== position.coords
          ) {
            nLatitude = position.coords.latitude;
            nLongitude = position.coords.longitude;
          }
          this.props.getGroupsNearMe(
            sFilter,
            nType,
            sDistance,
            nLatitude,
            nLongitude
          );
        },
        () => {
          this.props.getGroupsNearMe(
            sFilter,
            nType,
            sDistance,
            nLatitude,
            nLongitude
          );
        },
        OPTIONS_GEOLOCATION_GET_POSITION
      );
    } catch (oError) {
      this.props.getGroupsNearMe(
        sFilter,
        nType,
        sDistance,
        nLatitude,
        nLongitude
      );
    }
  };

  addParticipant = async (oElement) => {
    if (
      this.state.newParticipants.filter(
        (element) => element.key === oElement.key
      ).length == 0
    ) {
      await this.setState({
        newParticipants: [...this.state.newParticipants, oElement],
      });
    } else {
      var aParticipants = [];
      this.state.newParticipants.forEach((oParticipant) => {
        oParticipant.key !== oElement.key && aParticipants.push(oParticipant);
      });
      this.setState({
        newParticipants: aParticipants,
      });
    }
  };

  addMember = async () => {
    await this.setState({
      isAddParticipant: !this.state.isAddParticipant,
      newParticipants: [],
      search: "",
      searchMember: "",
      friends: this.state.friendsBack,
    });
  };

  confirmAddMember = async () => {
    // TODO: Look at the group blocked users
    if (this.state.newParticipants.length > 0) {
      let nGroupId = this.state.group.id,
        sGroupKey = this.state.group.key,
        sGroupName = this.state.group.name,
        sGroupImage = this.state.group.image,
        aMembers = this.state.newParticipants;
      await this.setState({
        isAddParticipant: !this.state.isAddParticipant,
        newParticipants: [],
      });
      this.props.addMember(
        nGroupId,
        sGroupKey,
        sGroupName,
        sGroupImage,
        aMembers
      );
      this.props.getMyFriends(this.props.session.account.key);
    }
  };

  acceptRequest = async (oRequest) => {
    await this.setState({
      loading: true,
    });
    let sGroupKey = this.state.group.key,
      sCapitanKey = this.props.session.account.key,
      sUserKey = oRequest.key,
      sUserName = oRequest.name;
    this.props.acceptRequestGroup(sGroupKey, sCapitanKey, sUserKey, sUserName);
  };

  cancelRequest = async (oRequest) => {
    await this.setState({
      loading: true,
    });
    this.props.rejectRequestGroup({
      groupId: this.state.group.key,
      accountId: this.props.session.account.key,
      userId: oRequest.key,
    });
  };

  changeTabSelect = async (bValueSelect) => {
    await this.setState({ tabSelectMy: bValueSelect });
    this.props.navigation.setParams({ tabSelectMy: bValueSelect });
  };

  openOptions = () => {
    Keyboard.dismiss();
    this.setState({ showToastQuestion: !this.state.showToastQuestion });
  };

  openRequestModal = async (oGroup) => {
    await this.setState({
      showUserRequestGroupDetails: true,
      usersRequest: oGroup.usersRequest,
      group: oGroup,
    });
  };

  requestJoinGroup = async (oGroup) => {
    if (!this.state.loading) {
      await this.setState({
        loading: true,
      });
      var sGroupKey = oGroup.key,
        sUserKey = this.props.session.account.key,
        sUserId = this.props.session.account.id,
        sUserImage = this.props.session.account.image,
        sUserName = this.props.session.account.name,
        sUserUsername = this.props.session.account.username,
        nGroupId = oGroup.id,
        sGroupName = oGroup.name;
      this.props.requestJoinGroup(
        sGroupKey,
        nGroupId,
        sGroupName,
        sUserKey,
        sUserId,
        sUserImage,
        sUserName,
        sUserUsername
      );
    }
  };

  viewProfile = async (oUser) => {
    if (oUser.sender !== undefined) {
      if (oUser.sender === this.state.lastUserViewProfile.key) {
        this.props.getProfile(this.state.lastUserViewProfile.id);
      } else {
        GetUserAccount(oUser.sender).then(async (userAccountSnapshot) => {
          var oUserAccount = userAccountSnapshot.val();
          await this.setState({
            lastUserViewProfile: {
              id: oUserAccount.id,
              key: oUser.sender,
            },
          });
          this.props.getProfile(oUserAccount.id);
        });
      }
    } else {
      this.props.getProfile(oUser.id);
    }
    this.props.navigation.navigate("ProfileViewDetails");
  };

  acceptAllRequest = (oGroup) => {
    // TODO: Take the erreglo within the 'UsersreQuest' group and generate a function in the action where itere on it and sends to accept the applications, with a single function that Itere will be made a single descent of the group and a single update of the group
    this.showToast("Function not yet implemented");
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

  rejectInvitation = async (groupKey) => {
    await this.setState({
      loading: true,
    });
    this.props.rejectInvitationGroup({
      accountId: this.props.session.account.key,
      groupId: groupKey,
    });
  };

  acceptInvitation = async (sGroupKey, nGroupId) => {
    await this.setState({
      loading: true,
    });
    let nUserId = this.props.session.account.id,
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

  searchUsers = async (sSearch) => {
    if ("" === sSearch) {
      await this.setState({
        friends: this.state.friendsBack,
        searchPeople: "",
      });
    } else {
      this.props.getPeople(sSearch);
      await this.setState({
        loading: true,
        searchPeople: sSearch,
      });
    }
  };

  getMyGroups = () => {
    const { listGroup: aGroups } = this.props.grupProps;
    if (aGroups && aGroups.length > 0) {
      const { search: sSearch } = this.state;
      if (sSearch)
        return aGroups.filter((oGroup) =>
          oGroup.name.toUpperCase().includes(sSearch.toUpperCase())
        );
      return aGroups;
    }
    return null;
  };

  render() {
    return (
      <ImageBackground
        source={require("../../assets/bk.png")}
        resizeMode="cover"
        style={GlobalStyles.fullImageGroups}
      >
        <View style={GlobalTabs.viewTabs}>
          <Pressable
            onPress={() => this.changeTabSelect(true)}
            style={[
              GlobalTabs.tabLeft,
              this.state.tabSelectMy && GlobalTabs.tabActive,
            ]}
          >
            <View>
              <Text
                style={
                  this.state.tabSelectMy
                    ? GlobalTabs.tabsTextActive
                    : GlobalTabs.tabsText
                }
              >
                My
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => this.changeTabSelect(false)}
            style={[
              GlobalTabs.tabRight,
              !this.state.tabSelectMy && GlobalTabs.tabActive,
            ]}
          >
            <View>
              <Text
                style={
                  !this.state.tabSelectMy
                    ? GlobalTabs.tabsTextActive
                    : GlobalTabs.tabsText
                }
              >
                Near me
              </Text>
            </View>
          </Pressable>
        </View>
        {this.state.tabSelectMy ? (
          //MY
          <View style={{ flex: 1 }}>
            {this.props.session.groupInvitations.length > 0 && (
              <View style={styles.viewButton}>
                <Pressable
                  onPress={() => this.setState({ showGroupInvitations: true })}
                  style={styles.button}
                >
                  <Icon name="md-notifications" size={16} color={WhiteColor} />
                  <Text style={styles.textButton}>Group Invitations</Text>
                </Pressable>
              </View>
            )}
            <SearchUsername
              ph={"Search by group name"}
              value={this.state.search}
              change={(text) => {
                this.setState({ search: text });
                this.listGroup();
              }}
              blur={() => this.listGroup()}
              clean={() => this.setState({ search: "" })}
            />
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                  tintColor={GreenFitrecColor}
                  title="Pull to refresh..."
                />
              }
            >
              {this.getMyGroups() ? (
                <FlatList
                  data={this.getMyGroups()}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state.refresh}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.viewNotificaton}>
                        <Pressable
                          onPress={() => this.openGroup(item.key)}
                          style={{ flexDirection: "row", width: "100%" }}
                        >
                          {null === item.image ? (
                            <Image
                              style={GlobalStyles.photoProfileCardList}
                              source={require("../../assets/imgGroup.png")}
                            />
                          ) : (
                            <FastImage
                              style={GlobalStyles.photoProfileCardList}
                              source={{
                                uri: item.image,
                                priority: FastImage.priority.high,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          )}
                          <View
                            style={{
                              justifyContent: "center",
                              marginLeft: 10,
                              marginRight: 175,
                            }}
                          >
                            <Text style={styles.textUserReference}>
                              {item.name.length > 40
                                ? item.name.substring(0, 37) + "..."
                                : item.name}
                            </Text>
                            <Text>
                              {moment(item.dateCreated).format("MMM DD LT")}
                            </Text>
                          </View>
                          {item.isCapitan === true &&
                            undefined !== item.usersRequest &&
                            item.usersRequest.length > 0 && (
                              <Pressable
                                onPress={() => this.openRequestModal(item)}
                                style={styles.viewIconAddMemberRight}
                              >
                                <View>
                                  <Icon
                                    name="ios-person-add"
                                    size={36}
                                    color={SignUpColor}
                                  />
                                </View>
                              </Pressable>
                            )}
                          {item.messagesRead > 0 && (
                            <View
                              style={[
                                GlobalMessages.viewGlobalBubble,
                                styles.viewIconAddMemberRight,
                                { marginTop: 0, right: 65 },
                              ]}
                            >
                              <View style={GlobalMessages.viewBubble}>
                                <Text style={GlobalMessages.text}>
                                  {item.messagesRead}
                                </Text>
                              </View>
                            </View>
                          )}
                          <View style={styles.viewIconRight}>
                            <Icon
                              name="chevron-forward"
                              size={36}
                              color={PlaceholderColor}
                            />
                          </View>
                        </Pressable>
                      </View>
                    );
                  }}
                />
              ) : (
                <Text
                  style={[
                    styles.margin,
                    {
                      alignItems: "center",
                      padding: 20,
                      textAlign: "center",
                      fontSize: 18,
                      flexWrap: "wrap",
                    },
                  ]}
                >
                  You are not yet part of any group
                </Text>
              )}
            </ScrollView>
          </View>
        ) : (
          //NEAR ME
          <View style={{ flex: 1 }}>
            <SearchUsername
              ph={"Search by group name"}
              value={this.state.search}
              change={(text) => {
                this.setState({ search: text });
                "" === text && this.listGroup();
              }}
              blur={() => this.listGroup()}
              clean={() => this.setState({ search: "" })}
            />
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                  tintColor={GreenFitrecColor}
                  title="Pull to refresh..."
                />
              }
            >
              {null !== this.props.grupProps.listGroupNearMe &&
                undefined !== this.props.grupProps.listGroupNearMe &&
                this.props.grupProps.listGroupNearMe.length > 0 ? (
                <FlatList
                  data={this.props.grupProps.listGroupNearMe}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state.refresh}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.viewNotificaton}>
                        <Pressable
                          onPress={() => this.openGroup(item.key)}
                          style={{ flexDirection: "row", width: "100%" }}
                        >
                          {null === item.image ? (
                            <Image
                              style={GlobalStyles.photoProfileCardList}
                              source={require("../../assets/imgGroup.png")}
                            />
                          ) : (
                            <FastImage
                              style={GlobalStyles.photoProfileCardList}
                              source={{
                                uri: item.image,
                                priority: FastImage.priority.high,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          )}
                          <View
                            style={{ justifyContent: "center", marginLeft: 10 }}
                          >
                            <Text style={styles.textUserReference}>
                              {item.name}
                            </Text>
                            <Text>
                              {item.type == GROUP_PRIVATE
                                ? "Private"
                                : "Public"}
                            </Text>
                          </View>
                          <View style={styles.viewIconRight}>
                            <Icon
                              name="ios-arrow-forward"
                              size={36}
                              color={PlaceholderColor}
                            />
                          </View>
                        </Pressable>
                      </View>
                    );
                  }}
                />
              ) : (
                <Text
                  style={[
                    styles.margin,
                    {
                      alignItems: "center",
                      padding: 20,
                      textAlign: "center",
                      fontSize: 18,
                      flexWrap: "wrap",
                    },
                  ]}
                >
                  No nearby groups found
                </Text>
              )}
            </ScrollView>
          </View>
        )}
        <ToastQuestionGeneric
          visible={this.state.showToastQuestion}
          title="Select filter"
          options={
            <View style={{ padding: 10 }}>
              <Pressable onPress={() => this.listGroup(0)}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="lock-open" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Public Groups
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => this.listGroup(1)}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="lock-closed" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Private Groups
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => this.listGroup()}>
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Icon name="ios-options" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Default
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        />
        <ShowUserRequestGroup
          visible={this.state.showUserRequestGroupDetails}
          users={this.state.usersRequest}
          close={() => {
            this.setState({ showUserRequestGroupDetails: false });
          }}
          viewProfile={this.viewProfile}
          acceptAll={() => {
            this.acceptAllRequest(this.state.group);
          }}
          acceptRequest={(item) => {
            this.acceptRequest(item);
          }}
          cancelRequest={(item) => {
            this.cancelRequest(item);
          }}
        />
        <LoadingSpinner
          visible={this.state.loading || this.state.loadingUsers}
        />
        <Toast toastText={this.state.toastText} />
        {this.state.showGroupInvitations &&
          this.props.session.groupInvitations.length > 0 ? (
          <View style={GlobalModal.viewContent}>
            <View style={GlobalModal.viewHead}>
              <Text style={GlobalModal.headTitle}>Group Invitations</Text>
              <Pressable
                style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
                onPress={() => this.setState({ showGroupInvitations: false })}
              >
                <Icon name="md-close" color={SignUpColor} size={22} />
                <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                  Close
                </Text>
              </Pressable>
            </View>
            <ScrollView>
              <FlatList
                data={this.props.session.groupInvitations}
                renderItem={({ item }) => (
                  <View>
                    {item.group !== null ? (
                      <View style={styles.viewNotificaton}>
                        <View
                          style={{
                            width: "20%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {null !== item.group &&
                            null !== item.group.image &&
                            undefined !== item.group.image &&
                            "" !== item.group.image &&
                            "img/group.png" !== item.group.image ? (
                            <Image
                              style={[
                                { height: 60, width: 60 },
                                { borderRadius: 100 },
                              ]}
                              source={{ uri: item.group.image }}
                            />
                          ) : (
                            <Image
                              style={[
                                { height: 60, width: 60 },
                                { borderRadius: 100 },
                              ]}
                              source={require("../../assets/imgGroup.png")}
                            />
                          )}
                        </View>
                        <View
                          style={{ justifyContent: "center", width: "60%" }}
                        >
                          <Text
                            style={styles.textUserReference}
                            numberOfLines={1}
                          >
                            {item.group.name}
                          </Text>
                          <View style={{ marginBottom: 5 }}>
                            <Text style={{ marginLeft: 5 }}>
                              {item.group.description}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "20%",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Pressable
                            onPress={() => this.rejectInvitation(item.id)}
                            style={{ marginRight: 10 }}
                          >
                            <Icon
                              name="md-close"
                              size={35}
                              color={SignUpColor}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() =>
                              this.acceptInvitation(item.id, item.group.id)
                            }
                          >
                            <Icon name="md-checkmark" size={35} color="green" />
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.viewNotificaton}>
                        <View
                          style={{ justifyContent: "center", width: "85%" }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              marginBottom: 5,
                              fontSize: 18,
                              color: GreenFitrecColor,
                            }}
                            numberOfLines={1}
                          >
                            The group has been removed
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "15%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Pressable
                            onPress={() => this.rejectInvitation(item.id)}
                            style={{ marginRight: 10 }}
                          >
                            <Icon
                              name="md-close"
                              size={35}
                              color={SignUpColor}
                            />
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              />
            </ScrollView>
          </View>
        ) : null}
      </ImageBackground>
    );
  }
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
    fontSize: 18,
    color: GreenFitrecColor,
  },
  viewIconRight: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  viewIconAddMemberRight: {
    position: "absolute",
    right: 35,
    height: "100%",
    justifyContent: "center",
  },
  viewButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: SignUpColor,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: WhiteColor,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  grupProps: state.reducerGroup,
  invitationsProps: state.reducerInvitationsGroup,
  myPalsRequest: state.reducerRequests,
  groupUpdateProps: state.reducerUpdateGroup,
  friendsProps: state.reducerMyPals,
});

const mapDispatchToProps = (dispatch) => ({
  joinGroup: (sUserKey, sUserName, nUserId, sGroupKey, nGroupId) => {
    dispatch(
      actionJoinGroup(sUserKey, sUserName, nUserId, sGroupKey, nGroupId)
    );
  },
  getGroups: (sUserKey, sFilter) => {
    dispatch(actionGetGroups(sUserKey, sFilter));
  },
  getGroupsNearMe: (sFilter, nType, sDistance, nLatitude, nLongitude) => {
    dispatch(
      actionGetGroupsNearMe(sFilter, nType, sDistance, nLatitude, nLongitude)
    );
  },
  leaveGroup: (sUserKey, sGroupKey, nGroupId) => {
    dispatch(actionLeaveGroup(sUserKey, sGroupKey, nGroupId));
  },
  requestJoinGroup: (
    sGroupKey,
    nGroupId,
    sGroupName,
    sUserKey,
    nUserId,
    sUserImage,
    sUserName,
    sUserUsername
  ) => {
    dispatch(
      actionRequestJoinGroup(
        sGroupKey,
        nGroupId,
        sGroupName,
        sUserKey,
        nUserId,
        sUserImage,
        sUserName,
        sUserUsername
      )
    );
  },
  addMember: (nGroupId, sGroupKey, sGroupName, sGroupImage, aMembers) => {
    dispatch(
      actionAddMember(nGroupId, sGroupKey, sGroupName, sGroupImage, aMembers)
    );
  },
  resetOpenGroup: () => {
    dispatch(actionResetOpenGroup());
  },
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
  },
  rejectRequestGroup: (data) => {
    dispatch(actionRejectRequest(data));
  },
  acceptRequestGroup: (sGroupKey, sCapitanKey, sUserKey, sUserName) => {
    dispatch(actionAcceptRequest(sGroupKey, sCapitanKey, sUserKey, sUserName));
  },
  getGroupsInvitation: (data) => {
    dispatch(actionGetGroupInvitations(data));
  },
  rejectInvitationGroup: (data) => {
    dispatch(actionRejectInvitationGroup(data));
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
        sUserName
      )
    );
  },
  getPeople: (sFilter) => {
    dispatch(actionGetPeopleGroup(sFilter));
  },
  resetUpdateGroup: (data) => {
    dispatch(actionResetUpdateGroup(data));
  },
  getGroup: (sGroupKey, sUserKey) => {
    dispatch(actionGetGroup(sGroupKey, sUserKey));
  },
  getMyFriends: (sUserKey) => {
    dispatch(actionGetMyFriends(sUserKey));
  },
  clearCreateGroup: () => {
    dispatch(actionCleanCreateGroup());
  },
  clearNavigation: () => {
    dispatch(actionCleanNavigation());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
