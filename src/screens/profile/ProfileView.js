import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import Icon from "react-native-vector-icons/Ionicons";
import { Toast } from "../../components/shared/Toast";
import {
  getFitnnesLevel,
  validateCharacters,
} from "../../components/shared/SharedFunctions";
import FastImage from "react-native-fast-image";
import { actionExpandImage } from "../../redux/actions/SharedActions";
import Video from "react-native-video";

const ProfileView = (props) => {
  const profile = useSelector((state) => state.reducerProfile);
  const session = useSelector((state) => state.reducerSession);

  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastText, setToastText] = useState("");
  const [showMoreActivities, setShowMoreActivities] = useState(false);
  const [journeySelect, setJourneySelect] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    props.navigation.setParams({
      redirectEdit: redirectEditHandler,
    });
    getProfile();
  }, []);

  useEffect(() => {
    if (profile.status && null !== profile.profile) {
      setUser(profile.profile);
      if (
        null !== journeySelect &&
        null !== user.journeys &&
        user.journeys.length > 0
      ) {
        for (var i = 0; i < user.journeys.length; i++) {
          if (user.journeys[i].id === journeySelect.id) {
            setJourneySelect(user.journeys[i]);
          }
        }
      }
    } else if (!profile.status && "" !== profile.messageError) {
    }
    setLoading(false);
    setRefresh(!refresh);
    setRefreshing(false);
  }, [profile]);

  const redirectEditHandler = () => {
    if (null !== user) {
      if (user.gym !== null) {
        user.gym_name = user.gym.name;
        user.gym_id = user.gym.id;
      } else {
        user.gym_name = null;
        user.gym_id = 0;
      }
      props.navigation.navigate("ProfileEditDetails", {
        user: user,
      });
    }
  };

  const getProfile = () => {
    setLoading(true);
    dispatch(actionGetProfile(session.account.id));
  };

  const showToast = (text) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getProfile();
  };

  const expandImage = (urlToImage) => {
    dispatch(actionExpandImage(urlToImage));
  };

  const showJourneyHandler = (oJourney) => {
    props.navigation.navigate("ShowJourneyMyProfile", { id: oJourney.id });
  };

  return (
    <View style={ProfileStyles.content}>
      {null !== user && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }>
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
                      {user.gym !== null ? " " + user.gym.name : " None"}
                    </Text>
                  </Text>
                </View>
                <Pressable
                  style={FollowersStyles.column}
                  activeOpacity={1}
                  onPress={() => props.navigation.navigate("Followers")}>
                  <Text style={FollowersStyles.counterProfileHome}>
                    {user.followers}
                  </Text>
                  <View style={FollowersStyles.line}></View>
                  <Text style={FollowersStyles.label}>Followers</Text>
                </Pressable>
                <Pressable
                  style={FollowersStyles.column}
                  activeOpacity={1}
                  onPress={() =>
                    props.navigation.navigate("Followers", {
                      tab: false,
                    })
                  }>
                  <Text style={FollowersStyles.counterProfileHome}>
                    {user.following}
                  </Text>
                  <View style={FollowersStyles.line}></View>
                  <Text style={FollowersStyles.label}>Following</Text>
                </Pressable>
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
                  {user.activities.slice(0, 3).map((element) => (
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
                      <Pressable onPress={() => setShowMoreActivities(true)}>
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
                  <View
                    style={[
                      GlobalShowActivity.viewActivity,
                      { borderWidth: 0 },
                    ]}>
                    <Pressable onPress={() => setShowMoreActivities(false)}>
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
                                  ref={(ref) => {
                                    player = ref;
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
      <Toast toastText={toastText} />
    </View>
  );
};

export default ProfileView;
