import React, { Component } from "react";
import { connect } from "react-redux";
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
  BlackColor,
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

class ProfileViewHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
      allowRefresh: true,
      toastText: "",
      showMoreActivities: false,
      showToastQuestion: false,
      showConversation: false,
      conversationSelect: null,
      journeySelect: null,
      showJourney: false,
      showAddOptions: false,
      showGroups: false,
      showReport: false,
      showBlock: false,
    };
  }

  getConversation = () => {
    this.props.getConversation({
      friendKey: this.state.user.key,
      accountId: this.props.session.account.key,
    });
  };

  showConversation = async () => {
    await this.setState({
      conversationSelect: this.state.user.conversation,
      showConversation: true,
    });
  };

  componentWillReceiveProps = async (nextProps) => {
    if (
      nextProps.profile.profileHome !== this.state.user &&
      nextProps.profile.statusHome &&
      null !== nextProps.profile.profileHome &&
      undefined !== nextProps.profile.profileHome
    ) {
      await this.setState({
        user: {
          ...nextProps.profile.profileHome,
          conversation: null,
        },
      });
      if (
        !nextProps.profile.getConversation &&
        null === this.state.user.conversation &&
        !this.state.user.isMe
      ) {
        this.getConversation();
      }
    } else if (nextProps.profile.error) {
      this.props.navigation.goBack();
    }
    if (
      null !== this.state.user &&
      null !== nextProps.profile.conversation &&
      nextProps.profile.conversation &&
      nextProps.profile.conversation !== this.state.user.conversation
    ) {
      await this.setState({
        user: {
          ...this.state.user,
          conversation: nextProps.profile.conversation,
        },
      });
      if (null !== this.state.conversationSelect) {
        await this.setState({
          conversationSelect: nextProps.profile.conversation,
        });
      }
    }
    if (
      nextProps.chatProps.statusSend &&
      this.props.chatProps !== nextProps.chatProps
    ) {
      await this.setState({
        user: {
          ...this.state.user,
          conversation: null,
        },
      });
      this.getConversation();
    }
    if (
      null !== nextProps.myPalsRequest.statusUnfollowHome &&
      nextProps.myPalsRequest.statusUnfollowHome
    ) {
      this.props.resetStateRequestHome();
      this.showToast("Successfully remove pal");
    }
    if (
      null !== nextProps.myPalsRequest.statusSendHome &&
      nextProps.myPalsRequest.statusSendHome
    ) {
      this.props.resetStateRequestHome();
      this.showToast("Your request has been sent");
    } else if (
      null !== nextProps.myPalsRequest.statusSendHome &&
      !nextProps.myPalsRequest.statusSendHome
    ) {
      this.props.resetStateRequestHome();
      if (nextProps.myPalsRequest.messageError !== "") {
        this.showToast(nextProps.myPalsRequest.messageError);
      }
    }
    if (
      undefined !== this.props.propsProfilePal.message &&
      "" !== this.props.propsProfilePal.message
    ) {
      this.showToast(this.props.propsProfilePal.message);
      this.props.setEmptyMessage();
    }
    if (this.props.blockProps.status) {
      this.props.navigation.goBack();
      setTimeout(() => {
        this.props.cleanBlock();
      }, 500);
    }
    await this.setState({
      loading: false,
    });
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

  unfollowPal = async () => {
    await this.setState({ showToastQuestion: false, showAddOptions: false });
    this.props.unfollowPal(
      this.state.user.id,
      this.state.user.key,
      this.props.session.account.key,
      true
    );
  };

  sendRequest = async () => {
    await this.setState({
      loading: true,
      showAddOptions: false,
    });
    this.props.sendRequest(
      this.state.user.key,
      this.props.session.account.key,
      this.props.session.account.username,
      true
    );
  };

  allowSendRequest = (nIdFitrec) => {
    if (this.props.myPalsRequest.requestsRecived.length > 0) {
      if (
        this.props.myPalsRequest.requestsRecived.filter(
          (element) => nIdFitrec === element.id
        ).length > 0
      ) {
        return false;
      }
    }
    if (this.props.myPalsRequest.requestsSent.length > 0) {
      if (
        this.props.myPalsRequest.requestsSent.filter(
          (element) => nIdFitrec === element.id
        ).length > 0
      ) {
        return false;
      }
    }
    return true;
  };

  sendInvitations = async (data) => {
    await this.setState({
      loading: true,
      showGroups: false,
    });
    this.props.sendInvitations(data);
  };

  getInvitationsGroup = async () => {
    this.state.user !== null &&
      this.props.getInvitationsGroup(this.state.user.key);
  };

  openGroups = () => {
    this.setState({ showGroups: true, showAddOptions: false });
    this.getInvitationsGroup();
  };

  expandImage = async (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  showJourney = (oJourney) => {
    if (this.props.navigation.state.routeName === "ProfileViewDetailsUser") {
      this.props.getJourney(oJourney.id);
      this.props.navigation.navigate("ShowJourneyMyProfile", {
        id: oJourney.id,
      });
    } else this.props.navigation.navigate("ShowJourney", { id: oJourney.id });
  };

  blockUser = () => {
    this.setState({ showBlock: false });
    this.props.blockUser(
      this.state.user.id,
      this.state.user.key,
      this.state.user.conversation.conversation
    );
  };

  follow = () => {
    let oDataNotification = {
      sHeader: this.props.session.account.username,
      sDescription: `${this.props.session.account.name} started to follow you`,
      sPushId: this.state.user.id_push,
    };
    this.props.follow(
      this.state.user.id,
      this.props.session.account.id,
      oDataNotification
    );
    this.setState({ showAddOptions: false });
  };

  unfollow = () => {
    this.props.unfollow(
      this.state.user.id_follow,
      this.state.user.id,
      this.props.session.account.id
    );
    this.setState({ showAddOptions: false });
  };

  render() {
    return (
      <View style={ProfileStyles.content}>
        {null !== this.state.user && undefined !== this.state.user && (
          <ScrollView>
            <View
              style={[
                GlobalStyles.photoProfileViewSection,
                GlobalStyles.photoProfileViewSectionPhotos,
              ]}
            >
              {null !== this.state.user &&
                null !== this.state.user.background ? (
                <>
                  <FastImage
                    style={GlobalStyles.photoProfileCoverPreviewPhoto}
                    source={{
                      uri: this.state.user.background,
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
                {null !== this.state.user && null !== this.state.user.image ? (
                  <Pressable
                    onPress={() => this.expandImage(this.state.user.image)}
                    style={GlobalStyles.photoProfileProfilePreviewPhoto}
                  >
                    <FastImage
                      style={GlobalStyles.photoProfileProfilePreviewPhotoPicker}
                      source={{
                        uri: this.state.user.image,
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
                    {this.state.user.name}
                  </Text>
                  <Text style={ProfileStyles.viewDetailsUserTextTitle}>
                    {getFitnnesLevel(this.state.user.level)}
                  </Text>
                  <Text style={ProfileStyles.viewDetailsUserText}>
                    {this.state.user.display_age &&
                      // Line commented since it will be used later - Leandro Curbelo 01/22/2021
                      // ('AGE: ' + moment().diff(this.state.user.age, 'years') + ' | ')
                      "AGE: " + this.state.user.age + " | "}
                    {this.state.user.height &&
                      "HEIGHT: " + this.state.user.height}
                    {this.state.user.display_weight &&
                      " | WEIGHT: " + this.state.user.weight + " lbs"}
                  </Text>
                  {this.props.session.account.key !== this.state.user.key && (
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
                          }}
                        >
                          Last Activity:{" "}
                          {moment(this.state.user.last_connection)
                            .local()
                            .fromNow()}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginTop: 5,
                          flexDirection: "row",
                          alignContent: "center",
                        }}
                      >
                        <View>
                          <Pressable
                            onPress={() =>
                              this.setState({ showAddOptions: true })
                            }
                          >
                            <Icon
                              name="add-circle"
                              size={34}
                              color={WhiteColor}
                            />
                          </Pressable>
                        </View>
                        <Pressable
                          onPress={() => this.showConversation()}
                        >
                          <Icon
                            name="chatbubbles"
                            size={32}
                            color={WhiteColor}
                            style={{ marginLeft: 15 }}
                          />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            this.setState({ showReportOptions: true })
                          }
                        >
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
                      }}
                    >
                      Fitness Facility:
                      <Text
                        style={{
                          color: GreenFitrecColor,
                          flex: 1,
                          flexWrap: "wrap",
                          fontWeight: "normal",
                        }}
                      >
                        {this.state.user.gym !== null
                          ? " " + this.state.user.gym.name
                          : " None"}
                      </Text>
                    </Text>
                  </View>
                  <View style={FollowersStyles.column}>
                    <Text style={FollowersStyles.counterProfileHome}>
                      {this.state.user.followers}
                    </Text>
                    <View style={FollowersStyles.line}></View>
                    <Text style={FollowersStyles.label}>Followers</Text>
                  </View>
                  <View style={FollowersStyles.column}>
                    <Text style={FollowersStyles.counterProfileHome}>
                      {this.state.user.following}
                    </Text>
                    <View style={FollowersStyles.line}></View>
                    <Text style={FollowersStyles.label}>Following</Text>
                  </View>
                </View>
                {null !== this.state.user.goals &&
                  "" !== this.state.user.goals && (
                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: GreenFitrecColor,
                          marginRight: 5,
                          marginBottom: 10,
                        }}
                      >
                        About Me/Goals:
                        <Text
                          style={{
                            color: GreenFitrecColor,
                            flex: 1,
                            flexWrap: "wrap",
                            fontWeight: "normal",
                          }}
                        >
                          {" " + validateCharacters(this.state.user.goals)}
                        </Text>
                      </Text>
                    </View>
                  )}
                {!this.state.showMoreActivities ? (
                  <View style={ProfileStyles.viewActivitiesSelected}>
                    {this.state.user.activities.slice(0, 3).map((element) => (
                      <View
                        style={GlobalShowActivity.viewActivity}
                        key={element.id}
                      >
                        <Text style={GlobalShowActivity.textActivity}>
                          {element.name}
                        </Text>
                      </View>
                    ))}
                    {this.state.user.activities.length > 3 && (
                      <View
                        style={[
                          GlobalShowActivity.viewActivity,
                          { borderWidth: 0 },
                        ]}
                      >
                        <Pressable
                          onPress={() =>
                            this.setState({ showMoreActivities: true })
                          }
                        >
                          <Icon
                            name="add-circle"
                            size={22}
                            color={SignUpColor}
                          />
                        </Pressable>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={ProfileStyles.viewActivitiesSelected}>
                    {this.state.user.activities
                      .sort(function (a, b) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                      })
                      .map((element) => (
                        <View
                          style={GlobalShowActivity.viewActivity}
                          key={element.id}
                        >
                          <Text style={GlobalShowActivity.textActivity}>
                            {element.name}
                          </Text>
                        </View>
                      ))}
                    {this.state.user.activities.length > 3 && (
                      <View
                        style={[
                          GlobalShowActivity.viewActivity,
                          { borderWidth: 0 },
                        ]}
                      >
                        <Pressable
                          onPress={() =>
                            this.setState({ showMoreActivities: false })
                          }
                        >
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
                      data={this.state.user.journeys}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state.refresh}
                      numColumns={3}
                      renderItem={({ item }) => (
                        <View style={{ flex: 1 / 3 }}>
                          <Pressable
                            style={ProfileStyles.touchableJourney}
                            onPress={() => this.showJourney(item)}
                          >
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
                                      "video_" +
                                      item.id.toString() +
                                      item.id_user
                                    }
                                    resizeMode={"cover"}
                                    source={{ uri: item.image }}
                                    style={GlobalStyles.fullImage}
                                    ref={(ref) => {
                                      this.state.player = ref;
                                    }}
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
        <LoadingSpinner visible={this.state.loading} />
        <Toast toastText={this.state.toastText} />
        <ToastQuestionGeneric
          visible={this.state.showAddOptions}
          options={
            <View style={{ padding: 10 }}>
              {null !== this.state.user &&
                undefined !== this.state.user &&
                !this.state.user.isPal ? (
                this.allowSendRequest(this.state.user.id) ? (
                  <Pressable onPress={() => this.sendRequest()}>
                    <View style={ToastQuestionGenericStyles.viewButtonOption}>
                      <Icon name="person-add" size={22} color={WhiteColor} />
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Add Pals
                      </Text>
                    </View>
                  </Pressable>
                ) : (
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Icon name="hourglass" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Request Sent
                    </Text>
                  </View>
                )
              ) : (
                <Pressable onPress={() => this.unfollowPal()}>
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Icon
                      name="md-remove-circle-outline"
                      size={22}
                      color={WhiteColor}
                    />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Remove pal
                    </Text>
                  </View>
                </Pressable>
              )}
              <Pressable onPress={() => this.openGroups()}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="people-circle" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Add To Group(s)
                  </Text>
                </View>
              </Pressable>
              {null !== this.state.user && this.state.user.id_follow != null ? (
                <Pressable onPress={() => this.unfollow()}>
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Icon name="eye-off-outline" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Unfollow
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <Pressable onPress={() => this.follow()}>
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Icon name="eye-outline" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Follow
                    </Text>
                  </View>
                </Pressable>
              )}
              <Pressable
                onPress={() => this.setState({ showAddOptions: false })}
              >
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Icon name="close" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Close
                  </Text>
                </View>
              </Pressable>
            </View>
          }
          close={() => this.setState({ showAddOptions: false })}
        />
        <ToastQuestionGeneric
          visible={this.state.showReportOptions}
          options={
            <View style={{ padding: 10 }}>
              <Pressable
                onPress={() =>
                  this.setState({ showReportOptions: false, showReport: true })
                }
              >
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
                onPress={() =>
                  this.setState({ showReportOptions: false, showBlock: true })
                }
              >
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
              <Pressable
                onPress={() => this.setState({ showReportOptions: false })}
              >
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Icon name="close" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Close
                  </Text>
                </View>
              </Pressable>
            </View>
          }
          close={() => this.setState({ showReportOptions: false })}
        />
        <GroupsList
          visible={this.state.showGroups}
          close={() =>
            this.setState({ showGroups: false, showAddOptions: true })
          }
          pal={this.state.user}
          sendInvitations={(data) => this.sendInvitations(data)}
          invitations={this.props.propsProfilePal.groupInvitations}
          groupsPal={this.props.propsProfilePal.groupsPals}
          groups={this.props.groupsProps.listGroup}
        />
        <Conversation
          visible={this.state.showConversation}
          conversation={this.state.conversationSelect}
          refreshConversation={true}
          close={() => this.setState({ showConversation: false })}
          viewProfile={() => this.setState({ showConversation: false })}
        />
        {this.state.showReport && this.state.journey !== null && (
          <ModalReport
            visible={this.state.showReport}
            close={() => this.setState({ showReport: false })}
            send={() => this.setState({ showReport: false })}
            type={REPORT_USER_TYPE}
            id={this.state.user.id}
          />
        )}
        {this.state.showBlock && (
          <View style={ToastQuestionGenericStyles.contentToastConfirm}>
            <View style={ToastQuestionGenericStyles.viewToast}>
              <Text style={ToastQuestionGenericStyles.textToast}>
                Are you sure you want to block {this.state.user.name}?
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() => this.setState({ showBlock: false })}
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => this.blockUser()}
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
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  profile: state.reducerProfile,
  chatProps: state.reducerChat,
  myPalsRequest: state.reducerRequests,
  propsProfilePal: state.reducerProfilePal,
  groupsProps: state.reducerGroup,
  blockProps: state.reducerBlock,
});

const mapDispatchToProps = (dispatch) => ({
  getConversation: (data) => {
    dispatch(actionGetConversationFriend(data));
  },
  resetStateRequestHome: () => {
    dispatch(actionResetStateRequestHome());
  },
  unfollowPal: (nPalId, sPalKey, sUserKey, bIsHome) => {
    dispatch(actionUnfollowPal(nPalId, sPalKey, sUserKey, bIsHome));
  },
  sendRequest: (sUserPalKey, sUserKey, sUsername, bIsHome) => {
    dispatch(actionSendRequest(sUserPalKey, sUserKey, sUsername, bIsHome));
  },
  sendInvitations: (data) => {
    dispatch(actionAddMemberAllGroups(data));
  },
  getInvitationsGroup: (sUserKey) => {
    dispatch(actionGetGroupInvitationsPals(sUserKey));
  },
  setEmptyMessage: () => {
    dispatch(setEmptyMessage());
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
  getJourney: (nJourneyId = null) => {
    dispatch(actionGetJourney(nJourneyId));
  },
  blockUser: (nUserId, sAccountKey, sConversationKey) => {
    dispatch(actionBlockUser(nUserId, sAccountKey, sConversationKey));
  },
  cleanBlock: () => {
    dispatch(actionCleanBlock());
  },
  follow: (nFollowId, nUserId, oDataNotification) => {
    dispatch(actionFollow(nFollowId, nUserId, oDataNotification));
  },
  unfollow: (nFollowId, nUserUnfollowId, nUserId) => {
    dispatch(actionUnFollow(nFollowId, nUserId, true, nUserUnfollowId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileViewHome);
