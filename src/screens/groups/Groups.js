import React, { useEffect, useState } from "react";
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
  ScrollView,
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
import { connect, useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { ShowUserRequestGroup } from "../../components/groups/ShowUsersRequestGroup";
import { GetUserAccount } from "../../redux/services/FirebaseServices";
import {
  actionGetGroups,
  actionGetGroupsNearMe,
  actionRequestJoinGroup,
  actionAddMember,
  actionRejectRequest,
  actionAcceptRequest,
  actionGetGroupInvitations,
  actionAcceptInvitationGroup,
  actionRejectInvitationGroup,
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

const Groups = ({ navigation }) => {
  const session = useSelector((state) => state.reducerSession);
  const groupProps = useSelector((state) => state.reducerGroup);
  const invitationsProps = useSelector(
    (state) => state.reducerInvitationsGroup
  );
  const myPalsRequest = useSelector((state) => state.reducerRequests);
  const groupUpdateProps = useSelector((state) => state.reducerUpdateGroup);
  const friendsProps = useSelector((state) => state.reducerMyPals);

  const dispatch = useDispatch();

  const [tabSelectMy, setTabSelectMy] = useState(true);
  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [toastText, setToastText] = useState("");
  const [groupsNearMe, setGroupsNearMe] = useState([]);
  const [search, setSearch] = useState("");
  const [searchMember, setSearchMember] = useState("");
  const [searchPeople, setSearchPeople] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendsBack, setFriendsBack] = useState(null);
  const [isAddParticipant, setIsAddParticipant] = useState(false);
  const [newParticipants, setNewParticipants] = useState([]);
  const [showUserRequestGroupDetails, setShowUserRequestGroupDetails] =
    useState(false);
  const [group, setGroup] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showGroupInvitations, setShowGroupInvitations] = useState(false);
  const [lastUserViewProfile, setLastUserViewProfile] = useState({
    id: null,
    key: null,
  });

  useEffect(() => {
    navigation.setParams({
      tabSelectMy: tabSelectMy,
      openOptions: () => openOptions(),
    });
    listGroup();
    if (null !== friendsBack && friendsBack.length > 0) setFriends(friendsBack);
    setSearchPeople("");

    if (true === navigation.getParam("invitation", null)) {
      setShowGroupInvitations(true);
    } else {
      var sGroupKey = navigation.getParam("groupId", null);
      if (null !== sGroupKey) {
        groupProps.listGroup.forEach((oElement) => {
          if (oElement.key === sGroupKey) {
            if (null !== navigation.getParam("request", null))
              openRequestModal(oElement);
            else openGroup(oElement.key);
          }
        });
      }
    }
    getGroupNearMe(null);
  }, []);

  useEffect(() => {
    setLoading(false);
    setRefreshing(false);
    undefined === groupProps.listGroup &&
      undefined === groupProps.listGroupNearMe &&
      listGroup();
    if (
      groupProps.status &&
      null !== groupProps.firebaseId &&
      undefined !== groupProps.firebaseId
    )
      openGroup(groupProps.firebaseId);
    undefined !== groupProps.messageError &&
      "" !== groupProps.messageError &&
      null !== groupProps.messageError &&
      showToast(groupProps.messageError);
    if (null !== groupProps.friendRefresh && groupProps.friendRefresh) {
      setFriendsBack(friendsProps.myFriends);
      setFriends(friendsProps.myFriends);
    }
    if (
      (undefined !== groupProps.listGroup && null !== groupProps.listGroup) ||
      null !== group
    ) {
      if (null !== groupProps.listGroup) {
        groupProps.listGroup.forEach((oGroup) => {
          if (null !== group) {
            if (oGroup.key === group.key) {
              if (
                (undefined !== oGroup.usersRequest &&
                  oGroup.usersRequest.length > 0) ||
                oGroup.messages !== group.messages
              ) {
                setUsersRequest(oGroup.usersRequest);
                setGroup(oGroup);
              } else {
                if (showUserRequestGroupDetails) {
                  setUsersRequest(null);
                  setGroup(null);
                  setShowUserRequestGroupDetails(false);
                }
              }
            }
          }
        });
      }
    }
    if (
      invitationsProps !== invitationsProps &&
      invitationsProps.invitationAction
    ) {
      showToast("Invitation processed successfully");
    }
    if (searchPeople !== "" && myPalsRequest.peopleFitrec !== friends) {
      friends = myPalsRequest.peopleFitrec;
    }
    if (
      friendsProps.status !== true &&
      (null === friendsProps.myFriends || friendsProps.myFriends.length === 0)
    )
      dispatch(actionGetMyFriends(session.account.key));
    else if (null === friendsBack) setFriendsBack(friendsProps.myFriends);
    setFriends(friendsProps.myFriends);
    if (groupProps.sGroupKey) {
      openGroup(groupProps.sGroupKey);
      dispatch(actionCleanNavigation());
    }
  }, []);

  const openGroup = (sGroupKey) => {
    dispatch(actionGetGroup(sGroupKey, session.account.key));
    navigation.navigate("DetailsGroup");
  };

  const onRefresh = () => {
    setRefreshing(true);
    listGroup();
  };

  const listGroup = (nType = null) => {
    dispatch(
      actionGetGroupInvitations({
        accountId: session.account.key,
      })
    );

    if (!tabSelectMy) {
      setLoading(true);
      setShowToastQuestion(false);
      if (
        refreshing ||
        undefined === groupProps.listGroup ||
        null === groupProps.listGroup ||
        groupProps.listGroup.length === 0
      )
        dispatch(actionGetGroups(session.account.key, search));
      getGroupNearMe(nType);
    }
  };

  const getGroupNearMe = (nType) => {
    var sFilter = search,
      sDistance = null,
      nLatitude = null,
      nLongitude = null;
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          if (
            null !== session.account &&
            position &&
            undefined !== position.coords
          ) {
            nLatitude = position.coords.latitude;
            nLongitude = position.coords.longitude;
          }
          dispatch(
            actionGetGroupsNearMe(
              sFilter,
              nType,
              sDistance,
              nLatitude,
              nLongitude
            )
          );
        },
        () => {
          dispatch(
            actionGetGroupsNearMe(
              sFilter,
              nType,
              sDistance,
              nLatitude,
              nLongitude
            )
          );
        },
        OPTIONS_GEOLOCATION_GET_POSITION
      );
    } catch (oError) {
      dispatch(
        actionGetGroupsNearMe(sFilter, nType, sDistance, nLatitude, nLongitude)
      );
    }
  };

  const addParticipant = (oElement) => {
    if (
      newParticipants.filter((element) => element.key === oElement.key)
        .length == 0
    ) {
      setNewParticipants([...newParticipants, oElement]);
    } else {
      var aParticipants = [];
      newParticipants.forEach((oParticipant) => {
        oParticipant.key !== oElement.key && aParticipants.push(oParticipant);
      });
      setNewParticipants(aParticipants);
    }
  };

  const addMember = () => {
    setIsAddParticipant(!isAddParticipant);
    setNewParticipants([]);
    setSearch("");
    setSearchMember("");
    setFriends(friendsBack);
  };

  const confirmAddMember = () => {
    // TODO: Look at the group blocked users
    if (newParticipants.length > 0) {
      let nGroupId = group.id,
        sGroupKey = group.key,
        sGroupName = group.name,
        sGroupImage = group.image,
        aMembers = newParticipants;
      setIsAddParticipant(!isAddParticipant);
      setNewParticipants([]);
      dispatch(
        actionAddMember(nGroupId, sGroupKey, sGroupName, sGroupImage, aMembers)
      );
      prdispatch(actionGetMyFriends(session.account.key));
    }
  };

  const acceptRequest = (oRequest) => {
    setLoading(true);
    let sGroupKey = group.key,
      sCapitanKey = session.account.key,
      sUserKey = oRequest.key,
      sUserName = oRequest.name;
    dispatch(actionAcceptRequest(sGroupKey, sCapitanKey, sUserKey, sUserName));
  };

  const cancelRequest = (oRequest) => {
    setLoading(true);
    let data = {
      groupId: group.key,
      accountId: session.account.key,
      userId: oRequest.key,
    };
    dispatch(actionRejectRequest(data));
  };

  const changeTabSelect = (bValueSelect) => {
    setTabSelectMy(bValueSelect);
    navigation.setParams({ tabSelectMy: bValueSelect });
  };

  const openOptions = () => {
    Keyboard.dismiss();
    setShowToastQuestion(!showToastQuestion);
  };

  const openRequestModal = (oGroup) => {
    setShowUserRequestGroupDetails(true);
    setUsersRequest(oGroup.usersRequest);
    setGroup(oGroup);
  };

  const requestJoinGroup = (oGroup) => {
    if (!loading) {
      setLoading(true);
      var sGroupKey = oGroup.key,
        sUserKey = session.account.key,
        sUserId = session.account.id,
        sUserImage = session.account.image,
        sUserName = session.account.name,
        sUserUsername = session.account.username,
        nGroupId = oGroup.id,
        sGroupName = oGroup.name;
      dispatch(
        actionRequestJoinGroup(
          sGroupKey,
          nGroupId,
          sGroupName,
          sUserKey,
          sUserId,
          sUserImage,
          sUserName,
          sUserUsername
        )
      );
    }
  };

  const viewProfile = (oUser) => {
    if (oUser.sender !== undefined) {
      if (oUser.sender === lastUserViewProfile.key) {
        dispatch(actionGetProfile(lastUserViewProfile.id));
      } else {
        GetUserAccount(oUser.sender).then((userAccountSnapshot) => {
          var oUserAccount = userAccountSnapshot.val();
          setLastUserViewProfile({
            id: oUserAccount.id,
            key: oUser.sender,
          });
          dispatch(actionGetProfile(oUserAccount.id));
        });
      }
    } else {
      dispatch(actionGetProfile(oUser.id));
    }
    navigation.navigate("ProfileViewDetails");
  };

  const acceptAllRequest = (oGroup) => {
    // TODO: Take the erreglo within the 'UsersreQuest' group and generate a function in the action where itere on it and sends to accept the applications, with a single function that Itere will be made a single descent of the group and a single update of the group
    showToast("Function not yet implemented");
  };

  const showToast = (text) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const rejectInvitation = (groupKey) => {
    setLoading(true);
    let data = {
      accountId: session.account.key,
      groupId: groupKey,
    };
    dispatch(actionRejectInvitationGroup(data));
  };

  const acceptInvitation = (sGroupKey, nGroupId) => {
    setLoading(true);
    let nUserId = session.account.id,
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

  const searchUsers = (sSearch) => {
    if ("" === sSearch) {
      setFriends(friendsBack);
      setSearchPeople("");
    } else {
      dispatch(actionGetPeopleGroup(sSearch));
      setLoading(true);
      setSearchPeople(sSearch);
    }
  };

  const getMyGroups = () => {
    const { listGroup: aGroups } = groupProps;
    if (aGroups && aGroups.length > 0) {
      if (search)
        return aGroups.filter((oGroup) =>
          oGroup.name.toUpperCase().includes(sSearch.toUpperCase())
        );
      return aGroups;
    }
    return null;
  };

  return (
    <ImageBackground
      source={require("../../assets/bk.png")}
      resizeMode="cover"
      style={GlobalStyles.fullImageGroups}>
      <View style={GlobalTabs.viewTabs}>
        <Pressable
          onPress={() => changeTabSelect(true)}
          style={[GlobalTabs.tabLeft, tabSelectMy && GlobalTabs.tabActive]}>
          <View>
            <Text
              style={
                tabSelectMy ? GlobalTabs.tabsTextActive : GlobalTabs.tabsText
              }>
              My
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => changeTabSelect(false)}
          style={[GlobalTabs.tabRight, !tabSelectMy && GlobalTabs.tabActive]}>
          <View>
            <Text
              style={
                !tabSelectMy ? GlobalTabs.tabsTextActive : GlobalTabs.tabsText
              }>
              Near me
            </Text>
          </View>
        </Pressable>
      </View>
      {tabSelectMy ? (
        //MY
        <View style={{ flex: 1 }}>
          {session.groupInvitations.length > 0 && (
            <View style={styles.viewButton}>
              <Pressable
                onPress={() => setShowGroupInvitations(true)}
                style={styles.button}>
                <Icon name="md-notifications" size={16} color={WhiteColor} />
                <Text style={styles.textButton}>Group Invitations</Text>
              </Pressable>
            </View>
          )}
          <SearchUsername
            ph={"Search by group name"}
            value={search}
            change={(text) => {
              setSearch(text);
              listGroup();
            }}
            blur={() => listGroup()}
            clean={() => setSearch("")}
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={GreenFitrecColor}
                title="Pull to refresh..."
              />
            }>
            {getMyGroups() ? (
              <FlatList
                data={getMyGroups()}
                keyExtractor={(item, index) => index.toString()}
                extraData={refresh}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.viewNotificaton}>
                      <Pressable
                        onPress={() => openGroup(item.key)}
                        style={{ flexDirection: "row", width: "100%" }}>
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
                          }}>
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
                              onPress={() => openRequestModal(item)}
                              style={styles.viewIconAddMemberRight}>
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
                            ]}>
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
                ]}>
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
            value={search}
            change={(text) => {
              setSearch(text);
              "" === text && listGroup();
            }}
            blur={() => listGroup()}
            clean={() => setSearch("")}
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={GreenFitrecColor}
                title="Pull to refresh..."
              />
            }>
            {null !== groupProps.listGroupNearMe &&
            undefined !== groupProps.listGroupNearMe &&
            groupProps.listGroupNearMe.length > 0 ? (
              <FlatList
                data={groupProps.listGroupNearMe}
                keyExtractor={(item, index) => index.toString()}
                extraData={refresh}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.viewNotificaton}>
                      <Pressable
                        onPress={() => openGroup(item.key)}
                        style={{ flexDirection: "row", width: "100%" }}>
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
                          style={{ justifyContent: "center", marginLeft: 10 }}>
                          <Text style={styles.textUserReference}>
                            {item.name}
                          </Text>
                          <Text>
                            {item.type == GROUP_PRIVATE ? "Private" : "Public"}
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
                ]}>
                No nearby groups found
              </Text>
            )}
          </ScrollView>
        </View>
      )}
      <ToastQuestionGeneric
        visible={showToastQuestion}
        title="Select filter"
        options={
          <View style={{ padding: 10 }}>
            <Pressable onPress={() => listGroup(0)}>
              <View style={ToastQuestionGenericStyles.viewButtonOption}>
                <Icon name="lock-open" size={22} color={WhiteColor} />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Public Groups
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => listGroup(1)}>
              <View style={ToastQuestionGenericStyles.viewButtonOption}>
                <Icon name="lock-closed" size={22} color={WhiteColor} />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Private Groups
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => listGroup()}>
              <View
                style={[
                  ToastQuestionGenericStyles.viewButtonOption,
                  { marginBottom: 0 },
                ]}>
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
        visible={showUserRequestGroupDetails}
        users={groupProps.usersRequest}
        close={() => setShowUserRequestGroupDetails(false)}
        viewProfile={viewProfile}
        acceptAll={() => {
          acceptAllRequest(group);
        }}
        acceptRequest={(item) => {
          acceptRequest(item);
        }}
        cancelRequest={(item) => {
          cancelRequest(item);
        }}
      />
      <LoadingSpinner visible={loading || loadingUsers} />
      <Toast toastText={toastText} />
      {showGroupInvitations && session.groupInvitations.length > 0 ? (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            <Text style={GlobalModal.headTitle}>Group Invitations</Text>
            <Pressable
              style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
              onPress={() => setShowGroupInvitations(false)}>
              <Icon name="md-close" color={SignUpColor} size={22} />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                Close
              </Text>
            </Pressable>
          </View>
          <ScrollView>
            <FlatList
              data={session.groupInvitations}
              renderItem={({ item }) => (
                <View>
                  {item.group !== null ? (
                    <View style={styles.viewNotificaton}>
                      <View
                        style={{
                          width: "20%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
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
                      <View style={{ justifyContent: "center", width: "60%" }}>
                        <Text
                          style={styles.textUserReference}
                          numberOfLines={1}>
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
                        }}>
                        <Pressable
                          onPress={() => rejectInvitation(item.id)}
                          style={{ marginRight: 10 }}>
                          <Icon name="md-close" size={35} color={SignUpColor} />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            acceptInvitation(item.id, item.group.id)
                          }>
                          <Icon name="md-checkmark" size={35} color="green" />
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.viewNotificaton}>
                      <View style={{ justifyContent: "center", width: "85%" }}>
                        <Text
                          style={{
                            textAlign: "center",
                            marginBottom: 5,
                            fontSize: 18,
                            color: GreenFitrecColor,
                          }}
                          numberOfLines={1}>
                          The group has been removed
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "15%",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          flexDirection: "row",
                        }}>
                        <Pressable
                          onPress={() => rejectInvitation(item.id)}
                          style={{ marginRight: 10 }}>
                          <Icon name="md-close" size={35} color={SignUpColor} />
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
};

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

export default Groups;
