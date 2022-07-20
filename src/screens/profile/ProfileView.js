import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  ScrollView,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import {
  GlobalStyles,
  GreenFitrecColor,
  SignUpColor,
  GlobalShowActivity,
  ProfileStyles,
  FollowersStyles,
} from "../../Styles";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import Icon from "react-native-vector-icons/Ionicons";
import { Toast } from "../../components/shared/Toast";
import {
  getFitnnesLevel,
  validateCharacters,
} from "../../components/shared/SharedFunctions";
import FastImage from "react-native-fast-image";
import { actionExpandImage } from "../../redux/actions/SharedActions";
import Video from "react-native-video";

class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
      allowRefresh: true,
      toastText: "",
      showMoreActivities: false,
      journeySelect: null,
      showJourney: false,
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({
      redirectEdit: () => this.redirectEdit(),
    });
    this.getProfile();
  };

  redirectEdit = () => {
    if (null !== this.state.user) {
      if (this.state.user.gym !== null) {
        this.state.user.gym_name = this.state.user.gym.name;
        this.state.user.gym_id = this.state.user.gym.id;
      } else {
        this.state.user.gym_name = null;
        this.state.user.gym_id = 0;
      }
      this.props.navigation.navigate("ProfileEditDetails", {
        user: this.state.user,
      });
    }
  };

  getProfile = async () => {
    await this.setState({
      loading: true,
    });
    this.props.getProfile(this.props.session.account.id);
  };

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.profile.status && null !== nextProps.profile.profile) {
      await this.setState({
        user: nextProps.profile.profile,
      });
      if (
        null !== this.state.journeySelect &&
        null !== this.state.user.journeys &&
        this.state.user.journeys.length > 0
      ) {
        for (var i = 0; i < this.state.user.journeys.length; i++) {
          if (this.state.user.journeys[i].id === this.state.journeySelect.id) {
            await this.setState({
              journeySelect: this.state.user.journeys[i],
            });
          }
        }
      }
    } else if (
      !nextProps.profile.status &&
      "" !== nextProps.profile.messageError
    ) {
    }
    await this.setState({
      loading: false,
      refresh: !this.state.refresh,
      refreshing: false,
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

  onRefresh = async () => {
    await this.setState({
      refreshing: true,
    });
    this.getProfile();
  };

  expandImage = async (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  showJourney = (oJourney) => {
    this.props.navigation.navigate("ShowJourneyMyProfile", { id: oJourney.id });
  };

  render = () => {
    return (
      <View style={ProfileStyles.content}>
        {null !== this.state.user && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh(this.webViewRef)}
                tintColor={GreenFitrecColor}
                title="Pull to refresh..."
              />
            }
          >
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
                  <Pressable
                    style={FollowersStyles.column}
                    activeOpacity={1}
                    onPress={() => this.props.navigation.navigate("Followers")}
                  >
                    <Text style={FollowersStyles.counterProfileHome}>
                      {this.state.user.followers}
                    </Text>
                    <View style={FollowersStyles.line}></View>
                    <Text style={FollowersStyles.label}>Followers</Text>
                  </Pressable>
                  <Pressable
                    style={FollowersStyles.column}
                    activeOpacity={1}
                    onPress={() =>
                      this.props.navigation.navigate("Followers", {
                        tab: false,
                      })
                    }
                  >
                    <Text style={FollowersStyles.counterProfileHome}>
                      {this.state.user.following}
                    </Text>
                    <View style={FollowersStyles.line}></View>
                    <Text style={FollowersStyles.label}>Following</Text>
                  </Pressable>
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
                            name="ios-add-circle"
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
                          name="ios-remove-circle"
                          size={22}
                          color={SignUpColor}
                        />
                      </Pressable>
                    </View>
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
        <Toast toastText={this.state.toastText} />
      </View>
    );
  };
}

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  profile: state.reducerProfile,
});

const mapDispatchToProps = (dispatch) => ({
  getProfile: (data) => {
    dispatch(actionGetProfile(data));
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
