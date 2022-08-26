import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Image,
  ScrollView,
  Text,
  FlatList,
  Pressable,
} from "react-native";
import {
  GlobalStyles,
  GreenFitrecColor,
  SignUpColor,
  WhiteColor,
  GlobalShowActivity,
  ToastQuestionGenericStyles,
  ProfileStyles,
  FollowersStyles,
} from "../../Styles";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment/min/moment-with-locales";
import { Toast } from "../../components/shared/Toast";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { actionGetConversationFriend } from "../../redux/actions/ChatActions";
import Conversation from "../../components/chat/Conversation";
import {
  actionResetStateRequestHome,
  actionUnfollowPal,
  actionSendRequest,
} from "../../redux/actions/MyPalsActions";
import {
  getFitnnesLevel,
  validateCharacters,
} from "../../components/shared/SharedFunctions";
import GroupsList from "../../components/groups/GroupsList";
import {
  actionAddMemberAllGroups,
  actionGetGroupInvitationsPals,
  setEmptyMessage,
} from "../../redux/actions/GroupActions";
import FastImage from "react-native-fast-image";
import { actionExpandImage } from "../../redux/actions/SharedActions";
import ModalReport from "../../components/report/ModalReport";
import { REPORT_USER_TYPE } from "../../Constants";
import { actionGetJourney } from "../../redux/actions/JourneyActions";
import Video from "react-native-video";
import {
  actionBlockUser,
  actionCleanBlock,
} from "../../redux/actions/BlockActions";
import {
  actionFollow,
  actionUnFollow,
} from "../../redux/actions/FollowerActions";

const ProfileViewHome = (props) => {
  const player = useRef();

  const profile = useSelector((state) => state.reducerProfile);
  const session = useSelector((state) => state.reducerSession);
  const chatProps = useSelector((state) => state.reducerChat);
  const myPalsRequest = useSelector((state) => state.reducerRequests);
  const propsProfilePal = useSelector((state) => state.reducerProfilePal);
  const groupsProps = useSelector((state) => state.reducerGroup);
  const blockProps = useSelector((state) => state.reducerBlock);

  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [allowRefresh, setAllowRefresh] = useState(true);
  const [toastText, setToastText] = useState("");
  const [showMoreActivities, setShowMoreActivities] = useState(false);
  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [conversationSelect, setConversationSelect] = useState(null);
  const [journeySelect, setJourneySelect] = useState(null);
  const [showJourney, setShowJourney] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (
      profile.profileHome !== user &&
      profile.statusHome &&
      null !== profile.profileHome &&
      undefined !== profile.profileHome
    ) {
      setUser({
        ...profile.profileHome,
        conversation: null,
      });
      if (
        !profile.getConversation &&
        null === user.conversation &&
        !user.isMe
      ) {
        getConversation();
      }
    } else if (profile.error) {
      props.navigation.goBack();
    }
    if (
      null !== user &&
      null !== profile.conversation &&
      profile.conversation &&
      profile.conversation !== user.conversation
    ) {
      setUser({
        ...user,
        conversation: profile.conversation,
      });
      if (null !== conversationSelect) {
        setConversationSelect(profile.conversation);
      }
      console.log("profile.conversation ==============>>>>> ", profile);
    }
  }, [profile]);

  // useEffect(() => {
  //   if (
  //     null !== user &&
  //     null !== profile.conversation &&
  //     profile.conversation &&
  //     profile.conversation !== user.conversation
  //   ) {
  //     setUser({
  //       ...user,
  //       conversation: profile.conversation,
  //     });
  //     if (null !== conversationSelect) {
  //       setConversationSelect(profile.conversation);
  //     }
  //   }
  //   if (
  //     chatProps.statusSend &&
  //     props.chatProps !== chatProps
  //   ) {
  //     setUser({
  //       ...user,
  //       conversation: null,
  //     });
  //     getConversation();
  //   }
  //   if (
  //     null !== myPalsRequest.statusUnfollowHome &&
  //     myPalsRequest.statusUnfollowHome
  //   ) {
  //     dispatch(actionResetStateRequestHome());
  //     showToast("Successfully remove pal");
  //   }
  //   if (
  //     null !== myPalsRequest.statusSendHome &&
  //     myPalsRequest.statusSendHome
  //   ) {
  //     dispatch(actionResetStateRequestHome());
  //     showToast("Your request has been sent");
  //   } else if (
  //     null !== myPalsRequest.statusSendHome &&
  //     !myPalsRequest.statusSendHome
  //   ) {
  //     dispatch(actionResetStateRequestHome());
  //     if (myPalsRequest.messageError !== "") {
  //       showToast(myPalsRequest.messageError);
  //     }
  //   }
  //   if (
  //     undefined !== propsProfilePal.message &&
  //     "" !== propsProfilePal.message
  //   ) {
  //     showToast(propsProfilePal.message);
  //     dispatch(setEmptyMessage());
  //   }
  //   if (blockProps.status) {
  //     props.navigation.goBack();
  //     setTimeout(() => {
  //       dispatch(actionCleanBlock());
  //     }, 500);
  //   }
  //   setLoading(false);
  // }, [profile,  chatProps, myPalsRequest, propsProfilePal, blockProps])

  useEffect(() => {
    if (chatProps.statusSend && props.chatProps !== chatProps) {
      setUser({
        ...user,
        conversation: null,
      });
      getConversation();
    }
    setLoading(false);
  }, [chatProps]);

  useEffect(() => {
    if (
      null !== myPalsRequest.statusUnfollowHome &&
      myPalsRequest.statusUnfollowHome
    ) {
      dispatch(actionResetStateRequestHome());
      showToast("Successfully remove pal");
    }
    if (null !== myPalsRequest.statusSendHome && myPalsRequest.statusSendHome) {
      dispatch(actionResetStateRequestHome());
      showToast("Your request has been sent");
    } else if (
      null !== myPalsRequest.statusSendHome &&
      !myPalsRequest.statusSendHome
    ) {
      dispatch(actionResetStateRequestHome());
      if (myPalsRequest.messageError !== "") {
        showToast(myPalsRequest.messageError);
      }
    }
    setLoading(false);
  }, [myPalsRequest]);

  useEffect(() => {
    if (
      undefined !== propsProfilePal.message &&
      "" !== propsProfilePal.message
    ) {
      showToast(propsProfilePal.message);
      dispatch(setEmptyMessage());
    }
    setLoading(false);
  }, [propsProfilePal]);

  useEffect(() => {
    if (blockProps.status) {
      props.navigation.goBack();
      setTimeout(() => {
        dispatch(actionCleanBlock());
      }, 500);
    }
    setLoading(false);
  }, [blockProps]);

  const getConversation = () => {
    let data = {
      friendKey: user.key,
      accountId: session.account.key,
    };
    dispatch(actionGetConversationFriend(data));
  };

  const showConversationHandler = () => {
    console.log(
      "showConversationHandler ======== showConversationHandler ======== showConversationHandler ===>>> ",
      user.conversation
    );
    setShowConversation(true);
    // setConversationSelect(user.conversation);
  };

  const showToast = (text) => {
    setToastText(text);
    setLoading(true);
    setTimeout(() => {
      setToastText("");
      setLoading(false);
    }, 2000);
  };

  const unfollowPal = () => {
    setShowToastQuestion(false);
    setShowAddOptions(false);
    dispatch(actionUnfollowPal(user.id, user.key, session.account.key, true));
  };

  const sendRequest = () => {
    setLoading(true);
    setShowAddOptions(false);
    dispatch(
      actionSendRequest(
        user.key,
        session.account.key,
        session.account.username,
        true
      )
    );
  };

  const allowSendRequest = (nIdFitrec) => {
    if (myPalsRequest.requestsRecived.length > 0) {
      if (
        myPalsRequest.requestsRecived.filter(
          (element) => nIdFitrec === element.id
        ).length > 0
      ) {
        return false;
      }
    }
    if (myPalsRequest.requestsSent.length > 0) {
      if (
        myPalsRequest.requestsSent.filter((element) => nIdFitrec === element.id)
          .length > 0
      ) {
        return false;
      }
    }
    return true;
  };

  const sendInvitations = (data) => {
    setLoading(true);
    setShowGroups(false);
    dispatch(actionAddMemberAllGroups(data));
  };

  const getInvitationsGroup = () => {
    user !== null && dispatch(actionGetGroupInvitationsPals(user.key));
  };

  const openGroups = () => {
    setShowGroups(true);
    setShowAddOptions(false);
    getInvitationsGroup();
  };

  const expandImage = (urlToImage) => {
    dispatch(actionExpandImage(urlToImage));
  };

  const showJourneyHandler = (oJourney) => {
    if (props.navigation.state.routeName === "ProfileViewDetailsUser") {
      dispatch(actionGetJourney(oJourney.id));
      props.navigation.navigate("ShowJourneyMyProfile", {
        id: oJourney.id,
      });
    } else props.navigation.navigate("ShowJourney", { id: oJourney.id });
  };

  const blockUser = () => {
    setShowBlock(false);
    dispatch(
      actionBlockUser(user.id, user.key, user.conversation.conversation)
    );
  };

  const follow = () => {
    let oDataNotification = {
      sHeader: session.account.username,
      sDescription: `${session.account.name} started to follow you`,
      sPushId: user.id_push,
    };
    dispatch(actionFollow(user.id, session.account.id, oDataNotification));
    setShowAddOptions(false);
  };

  const unfollow = () => {
    dispatch(
      actionUnFollow(
        user.id_follow,
        user.id
        // session.account.id
      )
    );
    setShowAddOptions(false);
  };

  return (
    <View style={ProfileStyles.content}>
      {null !== user && undefined !== user && (
        <ScrollView>
          <View
            style={[
              GlobalStyles.photoProfileViewSection,
              GlobalStyles.photoProfileViewSectionPhotos,
            ]}>
            {null !== user && null !== user.background ? (
              <>
                <FastImage
                  style={GlobalStyles.photoProfileCoverPreviewPhoto}
                  source={{
                    uri: user.background,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View style={ProfileStyles.shadowImage}></View>
              </>
            ) : (
              <View
                style={[
                  GlobalStyles.photoProfileCoverPreviewPhoto,
                  { backgroundColor: "grey" },
                ]}
              />
            )}
            <View style={ProfileStyles.containerDetails}>
              {null !== user && null !== user.image ? (
                <Pressable
                  onPress={() => expandImage(user.image)}
                  style={GlobalStyles.photoProfileProfilePreviewPhoto}>
                  <FastImage
                    style={GlobalStyles.photoProfileProfilePreviewPhotoPicker}
                    source={{
                      uri: user.image,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </Pressable>
              ) : (
                <View style={GlobalStyles.photoProfileProfilePreviewPhoto}>
                  <Image
                    resizeMode="cover"
                    style={GlobalStyles.photoProfileProfilePreviewPhotoPicker}
                    source={require("../../assets/imgProfileReadOnly2.png")}
                  />
                </View>
              )}
              <View style={ProfileStyles.viewDetailsUser}>
                <Text style={ProfileStyles.viewDetailsUserTextUserName}>
                  {user.name}
                </Text>
                <Text style={ProfileStyles.viewDetailsUserTextTitle}>
                  {getFitnnesLevel(user.level)}
                </Text>
                <Text style={ProfileStyles.viewDetailsUserText}>
                  {user.display_age &&
                    // Line commented since it will be used later - Leandro Curbelo 01/22/2021
                    // ('AGE: ' + moment().diff(user.age, 'years') + ' | ')
                    "AGE: " + user.age + " | "}
                  {user.height && "HEIGHT: " + user.height}
                  {user.display_weight && " | WEIGHT: " + user.weight + " lbs"}
                </Text>
                {session.account.key !== user.key && (
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ marginTop: 5, flexDirection: "row" }}>
                      <Text
                        style={{
                          flex: 1,
                          flexWrap: "wrap",
                          fontWeight: "bold",
                          alignItems: "center",
                          color: WhiteColor,
                          fontSize: 14,
                        }}>
                        Last Activity:{" "}
                        {moment(user.last_connection).local().fromNow()}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: "row",
                        alignContent: "center",
                      }}>
                      <View>
                        <Pressable onPress={() => setShowAddOptions(true)}>
                          <Icon
                            name="add-circle"
                            size={34}
                            color={WhiteColor}
                          />
                        </Pressable>
                      </View>
                      <Pressable onPress={showConversationHandler}>
                        <Icon
                          name="chatbubbles"
                          size={32}
                          color={WhiteColor}
                          style={{ marginLeft: 15 }}
                        />
                      </Pressable>
                      <Pressable onPress={() => setShowReportOptions(true)}>
                        <Icon
                          name="ellipsis-vertical"
                          size={32}
                          color={WhiteColor}
                          style={{ marginLeft: 15 }}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={[GlobalStyles.viewSection, { borderBottomWidth: 0 }]}>
            <View style={[ProfileStyles.viewMoreDetails, { paddingTop: 0 }]}>
              <View style={FollowersStyles.container}>
                <View style={FollowersStyles.sectionInformation}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: GreenFitrecColor,
                      marginRight: 5,
                    }}>
                    Fitness Facility:
                    <Text
                      style={{
                        color: GreenFitrecColor,
                        flex: 1,
                        flexWrap: "wrap",
                        fontWeight: "normal",
                      }}>
                      {user.gym !== null
                        ? " " //+  user.gym.name
                        : " None"}
                    </Text>
                  </Text>
                </View>
                <View style={FollowersStyles.column}>
                  <Text style={FollowersStyles.counterProfileHome}>
                    {user.followers}
                  </Text>
                  <View style={FollowersStyles.line}></View>
                  <Text style={FollowersStyles.label}>Followers</Text>
                </View>
                <View style={FollowersStyles.column}>
                  <Text style={FollowersStyles.counterProfileHome}>
                    {user.following}
                  </Text>
                  <View style={FollowersStyles.line}></View>
                  <Text style={FollowersStyles.label}>Following</Text>
                </View>
              </View>
              {null !== user.goals && "" !== user.goals && (
                <View style={{ flexDirection: "row", paddingTop: 5 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: GreenFitrecColor,
                      marginRight: 5,
                      marginBottom: 10,
                    }}>
                    About Me/Goals:
                    <Text
                      style={{
                        color: GreenFitrecColor,
                        flex: 1,
                        flexWrap: "wrap",
                        fontWeight: "normal",
                      }}>
                      {" " + validateCharacters(user.goals)}
                    </Text>
                  </Text>
                </View>
              )}
              {!showMoreActivities ? (
                <View style={ProfileStyles.viewActivitiesSelected}>
                  {user.activities &&
                    user.activities.slice(0, 3).map((element) => (
                      <View
                        style={GlobalShowActivity.viewActivity}
                        key={element.id}>
                        <Text style={GlobalShowActivity.textActivity}>
                          {element.name}
                        </Text>
                      </View>
                    ))}
                  {user.activities && user.activities.length > 3 && (
                    <View
                      style={[
                        GlobalShowActivity.viewActivity,
                        { borderWidth: 0 },
                      ]}>
                      <Pressable onPress={() => setShowMoreActivities(true)}>
                        <Icon name="add-circle" size={22} color={SignUpColor} />
                      </Pressable>
                    </View>
                  )}
                </View>
              ) : (
                <View style={ProfileStyles.viewActivitiesSelected}>
                  {user.activities
                    .sort(function (a, b) {
                      if (a.name < b.name) return -1;
                      if (a.name > b.name) return 1;
                      return 0;
                    })
                    .map((element) => (
                      <View
                        style={GlobalShowActivity.viewActivity}
                        key={element.id}>
                        <Text style={GlobalShowActivity.textActivity}>
                          {element.name}
                        </Text>
                      </View>
                    ))}
                  {user.activities.length > 3 && (
                    <View
                      style={[
                        GlobalShowActivity.viewActivity,
                        { borderWidth: 0 },
                      ]}>
                      <Pressable onPress={() => setShowMoreActivities(false)}>
                        <Icon
                          name="remove-circle"
                          size={22}
                          color={SignUpColor}
                        />
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
              <View style={{ alignItems: "center" }}>
                <View style={ProfileStyles.journeyContainer}>
                  <Text style={ProfileStyles.fitnessLabel}>
                    MY FITNESS JOURNEY
                  </Text>
                </View>
                <View style={ProfileStyles.viewJourney}>
                  <FlatList
                    data={user.journeys}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={refresh}
                    numColumns={3}
                    renderItem={({ item }) => (
                      <View style={{ flex: 1 / 3 }}>
                        <Pressable
                          style={ProfileStyles.touchableJourney}
                          onPress={() => showJourneyHandler(item)}>
                          {item.image.indexOf("mp4") >= 0 ? (
                            <View style={ProfileStyles.journeyImage}>
                              {Platform.OS === "ios" ? (
                                <Video
                                  paused={true}
                                  muted={true}
                                  repeat={false}
                                  controls={false}
                                  disableFocus={false}
                                  key={
                                    "video_" + item.id.toString() + item.id_user
                                  }
                                  resizeMode={"cover"}
                                  source={{ uri: item.image }}
                                  style={GlobalStyles.fullImage}
                                  ref={player}
                                />
                              ) : (
                                <FastImage
                                  style={ProfileStyles.journeyImage}
                                  source={{
                                    uri: item.image,
                                    priority: FastImage.priority.high,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              )}
                              <Icon
                                name="play"
                                size={24}
                                color={SignUpColor}
                                style={{
                                  position: "absolute",
                                  top: 5,
                                  right: 5,
                                }}
                              />
                            </View>
                          ) : (
                            <FastImage
                              style={ProfileStyles.journeyImage}
                              source={{
                                uri: item.image,
                                priority: FastImage.priority.high,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          )}
                          {item.liked > 0 && (
                            <View style={ProfileStyles.viewLikes}>
                              <Icon
                                name="ios-heart"
                                size={20}
                                color={SignUpColor}
                              />
                              <Text style={ProfileStyles.textLiked}>
                                {item.liked}
                              </Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <LoadingSpinner visible={loading} />
      <Toast toastText={toastText} />
      <ToastQuestionGeneric
        visible={showAddOptions}
        options={
          <View style={{ padding: 10 }}>
            {null !== user && undefined !== user && !user.isPal ? (
              allowSendRequest(user.id) ? (
                <Pressable onPress={() => sendRequest()}>
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Icon name="person-add" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}>
                      Add Pals
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="hourglass" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Request Sent
                  </Text>
                </View>
              )
            ) : (
              <Pressable onPress={() => unfollowPal()}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon
                    name="md-remove-circle-outline"
                    size={22}
                    color={WhiteColor}
                  />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Remove pal
                  </Text>
                </View>
              </Pressable>
            )}
            <Pressable onPress={() => openGroups()}>
              <View style={ToastQuestionGenericStyles.viewButtonOption}>
                <Icon name="people-circle" size={22} color={WhiteColor} />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Add To Group(s)
                </Text>
              </View>
            </Pressable>
            {null !== user && user.id_follow != null ? (
              <Pressable onPress={() => unfollow()}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="eye-off-outline" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Unfollow
                  </Text>
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={() => follow()}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="eye-outline" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Follow
                  </Text>
                </View>
              </Pressable>
            )}
            <Pressable onPress={() => setShowAddOptions(false)}>
              <View
                style={[
                  ToastQuestionGenericStyles.viewButtonOption,
                  { marginBottom: 0 },
                ]}>
                <Icon name="close" size={22} color={WhiteColor} />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Close
                </Text>
              </View>
            </Pressable>
          </View>
        }
        close={() => setShowAddOptions(false)}
      />
      <ToastQuestionGeneric
        visible={showReportOptions}
        options={
          <View style={{ padding: 10 }}>
            <Pressable
              onPress={() => {
                setShowReportOptions(false);
                setShowReport(true);
              }}>
              <View style={ToastQuestionGenericStyles.viewButtonOption}>
                <Icon
                  name="close-circle-outline"
                  size={22}
                  color={WhiteColor}
                />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Report User
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowReportOptions(false);
                setShowBlock(true);
              }}>
              <View style={ToastQuestionGenericStyles.viewButtonOption}>
                <Icon
                  name="remove-circle-outline"
                  size={22}
                  color={WhiteColor}
                />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Block User
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowReportOptions(false)}>
              <View
                style={[
                  ToastQuestionGenericStyles.viewButtonOption,
                  { marginBottom: 0 },
                ]}>
                <Icon name="close" size={22} color={WhiteColor} />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Close
                </Text>
              </View>
            </Pressable>
          </View>
        }
        close={() => setShowReportOptions(false)}
      />
      <GroupsList
        visible={showGroups}
        close={() => {
          setShowGroups(false);
          setShowAddOptions(true);
        }}
        pal={user}
        sendInvitations={(data) => sendInvitations(data)}
        invitations={propsProfilePal.groupInvitations}
        groupsPal={propsProfilePal.groupsPals}
        groups={groupsProps.listGroup}
      />
      <Conversation
        visible={showConversation}
        conversation={conversationSelect}
        refreshConversation={true}
        close={() => setShowConversation(false)}
        viewProfile={() => setShowConversation(false)}
      />
      {showReport && props.journey !== null && (
        <ModalReport
          visible={showReport}
          close={() => setShowReport(false)}
          send={() => setShowReport(false)}
          type={REPORT_USER_TYPE}
          id={user.id}
        />
      )}
      {showBlock && (
        <View style={ToastQuestionGenericStyles.contentToastConfirm}>
          <View style={ToastQuestionGenericStyles.viewToast}>
            <Text style={ToastQuestionGenericStyles.textToast}>
              Are you sure you want to block {user.name}?
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonCancel}
                  onPress={() => setShowBlock(false)}>
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
              <View style={{ width: "50%" }}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonConfirm}
                  onPress={() => blockUser()}>
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileViewHome;
