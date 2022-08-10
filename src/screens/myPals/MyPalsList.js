import React, { Component, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Slider,
  Keyboard,
  FlatList,
} from "react-native";
import {
  GlobalStyles,
  SignUpColor,
  WhiteColor,
  PlaceholderColor,
  GreenFitrecColor,
  GlobalTabs,
  ToastQuestionGenericStyles,
  GlobalModal,
  GlobalBubble,
} from "../../Styles";
import { SearchUsername } from "../../components/chat/SearchUsername";
import Icon from "react-native-vector-icons/Ionicons";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  actionGetMyFriends,
  actionGetMyFriendsListener,
  actionGetProfile,
} from "../../redux/actions/ProfileActions";
import {
  actionGetRequests,
  actionGetPeople,
  actionResetStateRequest,
  actionSendRequest,
  actionAcceptRequest,
  actionCancelRequest,
} from "../../redux/actions/MyPalsActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Toast } from "../../components/shared/Toast";
import { RefreshControl } from "react-native";
import FastImage from "react-native-fast-image";
import ReactNativePickerModule from "react-native-picker-module";
import { GlobalCheckBox } from "../../components/shared/GlobalCheckBox";
import SelectActivities from "../../components/register/SelectActivities";
import {
  actionGetAllActivities,
  actionGetGyms,
} from "../../redux/actions/ActivityActions";
import Geolocation from "@react-native-community/geolocation";
import moment from "moment/min/moment-with-locales";
import { lABC, OPTIONS_GEOLOCATION_GET_POSITION } from "../../Constants";
import { actionCleanNavigation } from "../../redux/actions/NavigationActions";

const MyPalsList = (props) => {

  const pickerGym = useRef();
  const pickerAge = useRef();

  const session = useSelector((state) => state.reducerSession);
  const myPals = useSelector((state) => state.reducerMyPals);
  const myPalsRequest = useSelector((state) => state.reducerRequests);
  const activity = useSelector((state) => state.reducerActivity);

  const dispatch = useDispatch();

  const [tabSelectPals, setTabSelectPals] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [searchPals, setSearchPals] = useState("");
  const [filterRequests, setFilterRequests] = useState("");
  const [toastText, setToastText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [distance, setDistance] = useState(5);
  const [gym, setGym] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [ageMin, setAgeMin] = useState(null);
  const [ageMax, setAgeMax] = useState(null);
  const [showSelectActivities, setShowSelectActivities] = useState(false);
  const [activities, setActivities] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [gymsName, setGymsName] = useState([]);

  // componentWillUnmount = () => {
  //   props.getMyFriendsListener();
  // };

  useEffect(() => {
    const { key: sUserKey } = session.account;
    dispatch(actionGetMyFriendsListener(sUserKey));
    getRequests();
    props.navigation.getParam("request", false) && setTabSelectPals(false);
    dispatch(actionGetAllActivities());
    dispatch(actionGetGyms());
  }, [])



  const openOptions = () => {
    Keyboard.dismiss();
    setShowFilters(!showFilters);
  };

  const getMyFriends = () => {
    setLoading(true);
    dispatch(actionGetMyFriends());
  };

  const getRequests = () => {
    setLoading(true);
    dispatch(actionGetRequests(session.account.key));
  };

  // componentWillReceiveProps = (nextProps) => {
  //   if (
  //     null !== nextProps.myPalsRequest.statusSend &&
  //     nextProps.myPalsRequest.statusSend
  //   ) {
  //     props.resetStateRequest();
  //     setState({ search: "", filterRequests: "" });
  //     searchPeople();
  //     showToast("Your request has been sent");
  //   } else if (
  //     null !== nextProps.myPalsRequest.statusSend &&
  //     !nextProps.myPalsRequest.statusSend
  //   ) {
  //     setState({ search: "", filterRequests: "" });
  //     searchPeople();
  //     showToast(nextProps.myPalsRequest.messageError);
  //     props.resetStateRequest();
  //   }
  //   if (
  //     null !== nextProps.myPalsRequest.statusAccept &&
  //     nextProps.myPalsRequest.statusAccept === true
  //   ) {
  //     props.resetStateRequest();
  //     showToast("Successfully accepted");
  //   } else if (
  //     null !== nextProps.myPalsRequest.statusAccept &&
  //     !nextProps.myPalsRequest.statusAccept &&
  //     "" !== nextProps.myPalsRequest.messageError
  //   ) {
  //     showToast(nextProps.myPalsRequest.messageError);
  //     props.resetStateRequest();
  //   }
  //   if (
  //     null !== nextProps.myPalsRequest.statusCancel &&
  //     nextProps.myPalsRequest.statusCancel === true
  //   ) {
  //     props.resetStateRequest();
  //     showToast("Successfully cancel");
  //   }
  //   if (activity.activities.length > 0) {
  //     setState({
  //       activities: activity.activities,
  //     });
  //   }
  //   if (activity.gyms.length > 0) {
  //     var aGymsName = ["None"];
  //     activity.gyms.forEach((oGym) => {
  //       aGymsName.push(oGym.name);
  //     });
  //     setState({
  //       gyms: activity.gyms,
  //       gymsName: aGymsName,
  //     });
  //   }

  //   if (nextProps.myPals.bRequestNavigation) {
  //     setState({ tabSelectPals: false });
  //     props.cleanNavigation();
  //   }

  //   setState({
  //     refresh: !refresh,
  //     loading: false,
  //     refreshing: false,
  //   });
  // };

  const searchPeople = () => {
    setFilterRequests(search);
    var aActivitiesSelected =
      activities.filter((item) => item.selected).length > 0 &&
        activities.filter((item) => item.selected).length <
        activities.length
        ? activities.filter((item) => item.selected)
        : null;

    var nGymId = null;
    if (null !== gym)
      gyms.forEach((oGym) => {
        if (oGym.name === gym) nGymId = oGym.id;
      });
    var sFilter = search,
      aActivities = aActivitiesSelected,
      nMaxAge = ageRange !== null ? ageMax : null,
      nMinAge = ageRange !== null ? ageMin : null,
      nDistance = distance,
      nLongitude = null,
      nLatitude = null;
    if (nearMe)
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            if (position && undefined !== position.coords) {
              nLongitude = position.coords.longitude;
              nLatitude = position.coords.latitude;
            }
            props.getPeople(
              sFilter,
              nMinAge,
              nMaxAge,
              nLatitude,
              nLongitude,
              nDistance,
              nGymId,
              aActivities
            );
          },
          () => {
            props.getPeople(
              sFilter,
              nMinAge,
              nMaxAge,
              nLatitude,
              nLongitude,
              nDistance,
              nGymId,
              aActivities
            );
          },
          OPTIONS_GEOLOCATION_GET_POSITION
        );
      } catch (oError) {
        props.getPeople(
          sFilter,
          nMinAge,
          nMaxAge,
          nLatitude,
          nLongitude,
          nDistance,
          nGymId,
          aActivities
        );
      }
    else
      props.getPeople(
        sFilter,
        nMinAge,
        nMaxAge,
        nLatitude,
        nLongitude,
        null,
        nGymId,
        aActivities
      );
  };

  const notOtherArray = (nIdFitrec) => {
    if (nIdFitrec === session.account.id) {
      return false;
    }
    if (
      myPalsRequest.requestsRecived !== undefined &&
      myPalsRequest.requestsRecived.length > 0
    ) {
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
        myPalsRequest.requestsSent.filter(
          (element) => nIdFitrec === element.id
        ).length > 0
      ) {
        return false;
      }
    }
    if (myPals.myFriends.length > 0) {
      if (
        myPals.myFriends.filter(
          (element) => nIdFitrec === element.id
        ).length > 0
      ) {
        return false;
      }
    }
    return true;
  };

  const showToast = (text) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const sendRequest = (sUserPalKey) => {
    setLoading(true);
    dispatch(actionSendRequest(
      sUserPalKey,
      session.account.key,
      session.account.name,
      false
    ));
  };

  const acceptRequest = (oPal) => {
    dispatch(actionAcceptRequest(oPal.id, oPal.key, session.account.key));
  };

  const cancelRequest = (lFriendItem, sType) => {
    setLoading(true);
    let data = {
      accountId: session.account.key,
      friendKey: lFriendItem.key,
      type: sType,
    };
    dispatch(actionCancelRequest(data));
  };

  const refreshFriends = () => {
    setRefreshing(true);
    getMyFriends();
  };

  const refreshRequest = () => {
    setRefreshing(true);
    getRequests();
  };

  const changeTab = (value) => {
    if (value) {
      setSearch("");
      setSearchPals("");
      searchPeople();
    }
    setTabSelectPals(value)
  };

  const redirectionViewProfile = (idFitrec) => {
    dispatch(actionGetProfile(idFitrec, true));
    props.navigation.navigate("ProfileViewDetails");
  };

  const getAgeValue = (value) => {
    if (value === "Under 18 years old") {
      setAgeRange(value);
      setAgeMin(0);
      setAgeMax(18);
    }
    else if (value === "Between 18 and 30 years") {
      setAgeRange(value);
      setAgeMin(18);
      setAgeMax(30);
    } else if (value === "Over 30 years old") {
      setAgeRange(value);
      setAgeMin(30);
      setAgeMax(100);
    } else {
      setAgeRange(null);
    }
  };

  const resetFilters = () => {
    undefined !== activities &&
      activities.map((activity) => {
        activity.selected = false;
      });
    setAgeRange(null);
    setAgeMin(null);
    setAgeMax(null);
    setGym(null);
    setNearMe(false);
    setDistance(5);
    setRefresh(!refresh)
    searchPeople();
  };

  const selectGym = (value) => {
    setGym(value === "None" ? null : value)
  };

  return (
    <ImageBackground
      source={require("../../assets/bk.png")}
      resizeMode="stretch"
      style={GlobalStyles.fullImage}
    >
      <View style={GlobalTabs.viewTabs}>
        <Pressable
          onPress={() => changeTab(true)}
          style={[
            GlobalTabs.tabLeft,
            tabSelectPals && GlobalTabs.tabActive,
          ]}
        >
          <View>
            <Text
              style={
                tabSelectPals
                  ? GlobalTabs.tabsTextActive
                  : GlobalTabs.tabsText
              }
            >
              Pals
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => changeTab(false)}
          style={[
            GlobalTabs.tabRight,
            !tabSelectPals && GlobalTabs.tabActive,
          ]}
        >
          <View>
            <Text
              style={
                !tabSelectPals
                  ? GlobalTabs.tabsTextActive
                  : GlobalTabs.tabsText
              }
            >
              Requests
            </Text>
          </View>
        </Pressable>
      </View>
      {tabSelectPals ? (
        <View style={styles.viewPals}>
          <View style={styles.viewPalsWidth}>
            <SearchUsername
              ph="Search for people or username"
              value={searchPals}
              change={(text) => setSearchPals(text)}
              clean={() => setSearchPals("")}
            />
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => refreshFriends()}
                  tintColor={GreenFitrecColor}
                  title="Pull to refresh..."
                />
              }
            >
              {myPals.myFriends.length > 0 && (
                <FlatList
                  data={myPals.myFriends.filter(
                    (element) =>
                      element.name
                        .toUpperCase()
                        .includes(searchPals.toUpperCase()) ||
                      element.username
                        .toUpperCase()
                        .includes(searchPals.toUpperCase())
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={refresh}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.imagePressable}
                      onPress={() => redirectionViewProfile(item.id)}
                    >
                      {undefined === item.image || null === item.image ? (
                        <Image
                          style={styles.dummyImage}
                          source={require("../../assets/imgProfileReadOnly2.png")}
                        />
                      ) : (
                        <FastImage
                          style={styles.userImage}
                          source={{
                            uri: item.image,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      )}
                      <View style={styles.requestMainView}>
                        <Text style={styles.textUserReference}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          {item.username} -{" "}
                          {moment(
                            item.last_connection,
                            "YYYY-MM-DD H:m:s"
                          ).fromNow()}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              )}
            </ScrollView>
          </View>
          <View style={styles.viewABC}>
            {lABC.map((element) => (
              <Text style={styles.textABC} key={element}>
                {element}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <SearchUsername
            ph="Search for people or username"
            value={search}
            change={(text) => {
              setSearch(text);
              text === "" && searchPeople();
            }}
            blur={() => searchPeople()}
            clean={() => {
              setSearch("");
              searchPeople();
            }}
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => refreshRequest()}
                tintColor={GreenFitrecColor}
                title="Pull to refresh..."
              />
            }
          >
            {myPalsRequest.requestsRecived !== undefined &&
              myPalsRequest.requestsRecived instanceof Array &&
              myPalsRequest.requestsRecived !== null && (
                <FlatList
                  data={myPalsRequest.requestsRecived.filter(
                    (element) =>
                      element.name
                        .toUpperCase()
                        .includes(filterRequests.toUpperCase()) ||
                      element.username
                        .toUpperCase()
                        .includes(filterRequests.toUpperCase())
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={refresh}
                  renderItem={({ item }) => (
                    <View style={styles.viewNotificaton}>
                      <Pressable
                        onPress={() => redirectionViewProfile(item.id)}
                        style={styles.dummyImagePressable}
                      >
                        {null === item.image || undefined === item.image ? (
                          <Image
                            style={styles.dummyImage}
                            source={require("../../assets/imgProfileReadOnly2.png")}
                          />
                        ) : (
                          <FastImage
                            style={styles.userImage}
                            source={{
                              uri: item.image,
                              priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        )}
                        <View style={styles.friendRequestsMainView}>
                          <Text
                            style={styles.textUserReference}
                            numberOfLines={1}
                          >
                            {item.name}(@{item.username})
                          </Text>
                          <Text style={{ fontSize: 14 }}>
                            Sent you a friend request.
                          </Text>
                        </View>
                      </Pressable>
                      <Pressable
                        style={styles.viewIconRight}
                        onPress={() => acceptRequest(item)}
                      >
                        <Icon
                          name="md-checkmark"
                          size={32}
                          color="yellowgreen"
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => cancelRequest(item, "reject")}
                        style={[styles.viewIconRight, { right: 50 }]}
                      >
                        <Icon name="md-close" size={32} color={SignUpColor} />
                      </Pressable>
                    </View>
                  )}
                />
              )}
            {undefined !== myPalsRequest.requestsSent && (
              <FlatList
                data={myPalsRequest.requestsSent.filter(
                  (element) =>
                    element.name.includes(filterRequests) ||
                    element.username.includes(filterRequests)
                )}
                keyExtractor={(item, index) => index.toString()}
                extraData={refresh}
                renderItem={({ item }) => (
                  <View style={styles.viewNotificaton}>
                    <Pressable
                      onPress={() => redirectionViewProfile(item.id)}
                      style={styles.dummyImagePressable}
                    >
                      {undefined === item.image ||
                        null === item.image ||
                        "" === item.image ? (
                        <Image
                          style={styles.dummyImage}
                          source={require("../../assets/imgProfileReadOnly2.png")}
                        />
                      ) : (
                        <FastImage
                          style={styles.userImage}
                          source={{
                            uri: item.image,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      )}
                      <View style={styles.friendSentRequestsMainView}>
                        <Text
                          style={styles.textUserReference}
                          numberOfLines={1}
                        >
                          {item.name}(@{item.username})
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          Friend request sent.
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => cancelRequest(item, "cancel")}
                      style={styles.viewIconRight}
                    >
                      <Icon name="md-close" size={32} color={SignUpColor} />
                    </Pressable>
                  </View>
                )}
              />
            )}
            <FlatList
              data={myPalsRequest.peopleFitrec.filter((element) =>
                notOtherArray(element.id)
              )}
              keyExtractor={(item, index) => index.toString()}
              extraData={refresh}
              renderItem={({ item }) => (
                <View style={styles.viewNotificaton}>
                  <Pressable
                    onPress={() => redirectionViewProfile(item.id)}
                    style={styles.dummyImagePressable}
                  >
                    {null === item.image ? (
                      <Image
                        style={styles.dummyImage}
                        source={require("../../assets/imgProfileReadOnly2.png")}
                      />
                    ) : (
                      <FastImage
                        style={styles.userImage}
                        source={{
                          uri: item.image,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                    <View style={styles.requestMainView}>
                      <Text style={styles.textUserReference}>
                        {item.name}
                      </Text>
                      <Text>@{item.username}</Text>
                    </View>
                    <Pressable
                      onPress={() => sendRequest(item.key)}
                      style={styles.viewIconRight}
                    >
                      <Icon
                        name="md-person-add"
                        size={30}
                        color="yellowgreen"
                      />
                    </Pressable>
                  </Pressable>
                </View>
              )}
            />
          </ScrollView>
          <View style={GlobalBubble.position}>
            <View
              style={[GlobalBubble.viewBubble, GlobalBubble.viewBubbleBig]}
            >
              <Pressable
                style={GlobalBubble.touchable}
                onPress={() => openOptions()}
              >
                <Text style={GlobalBubble.text}>FILTER</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      {showFilters && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            {ageRange !== null ||
              gym !== null ||
              activities.filter((item) => item.selected).length >
              0 ||
              nearMe !== false ? (
              <Pressable
                style={[GlobalModal.buttonLeft, { flexDirection: "row" }]}
                onPress={() => resetFilters()}
              >
                <Icon name="refresh-outline" color={SignUpColor} size={22} />
                <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                  Default
                </Text>
              </Pressable>
            ) : null}
            <Text style={GlobalModal.headTitle}>Filters</Text>
            <Pressable
              style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
              onPress={() => setShowFilters(false)}
            >
              <Icon name="close" color={SignUpColor} size={22} />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                Close
              </Text>
            </Pressable>
          </View>
          <View style={{ padding: 20 }}>
            {gymsName !== undefined && (
              <View
                style={[
                  styles.viewSection,
                  styles.checkInput,
                  { alignItems: "flex-end", marginTop: 0 },
                ]}
              >
                <Text style={styles.textLabel}>Gym</Text>
                <View style={styles.comboSelect}>
                  <Pressable
                    onPress={() => pickerGym.current.show()}
                    style={{ flexDirection: "row" }}
                  >
                    <Text>
                      {null !== gym ? gym : "None"}
                    </Text>
                    <Icon
                      name="chevron-down"
                      size={22}
                      style={styles.iconSelect}
                    />
                  </Pressable>
                </View>
                <ReactNativePickerModule
                  pickerRef={pickerGym}
                  title={"Gym"}
                  items={gymsName}
                  onValueChange={(value) => selectGym(value)}
                />
              </View>
            )}
            <View
              style={[
                styles.viewSection,
                styles.checkInput,
                { alignItems: "flex-end" },
              ]}
            >
              <Text style={styles.textLabel}>Age Range</Text>
              <View style={styles.comboSelect}>
                <Pressable
                  onPress={() => pickerAge.current.show()}
                  style={{ flexDirection: "row" }}
                >
                  <Text>
                    {null !== ageRange
                      ? ageRange
                      : "Select here"}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={22}
                    style={styles.iconSelect}
                  />
                </Pressable>
              </View>
              <ReactNativePickerModule
                pickerRef={pickerAge}
                title={"Gym"}
                items={[
                  "Select here",
                  "Under 18 years old",
                  "Between 18 and 30 years",
                  "Over 30 years old",
                ]}
                onValueChange={(value) => {
                  getAgeValue(value);
                }}
              />
            </View>
            <View
              style={[
                styles.viewSection,
                styles.checkInput,
                { alignItems: "flex-end" },
              ]}
            >
              <Text style={styles.textLabel}>Near Me</Text>
              <View style={styles.comboSelect}>
                <GlobalCheckBox
                  onPress={() => setNearMe(!nearMe)}
                  isCheck={nearMe}
                  title={null}
                />
              </View>
            </View>
            {nearMe && (
              <View style={{ width: "100%" }}>
                <Slider
                  step={1}
                  minimumValue={1}
                  maximumValue={30}
                  onValueChange={(value) => setDistance(value)}
                  value={distance}
                  minimumTrackTintColor={SignUpColor}
                  thumbTintColor={SignUpColor}
                />
                <View style={styles.dummyImagePressable}>
                  <Text style={[GlobalStyles.textMuted, { width: "50%" }]}>
                    1 Mile
                  </Text>
                  <Text style={[GlobalStyles.textMuted, styles.milesText]}>
                    30 Miles
                  </Text>
                </View>
              </View>
            )}
            <View style={[styles.viewSection, styles.checkInput]}>
              <Text style={styles.textLabel}>Activities</Text>
              <View style={[styles.comboSelect, { marginBottom: 7 }]}>
                <Pressable
                  style={{ flexDirection: "row" }}
                  onPress={() => setShowSelectActivities(true)}
                >
                  <Icon
                    name="md-create"
                    size={18}
                    style={styles.iconSelect}
                    color={SignUpColor}
                  />
                  <Text style={{ color: SignUpColor }}>
                    Choose Activities
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.viewActivitiesSelected}>
              {activities !== undefined &&
                activities.filter((item) => item.selected) !==
                undefined &&
                activities.filter((item) => item.selected).length >
                0 &&
                activities.filter((item) => item.selected).length <
                activities.length ? (
                activities
                  .filter((item) => item.selected)
                  .map((element) => (
                    <View style={styles.activityContainer} key={element.id}>
                      <Text style={styles.activityNode}>{element.name}</Text>
                    </View>
                  ))
              ) : (
                <View style={styles.activityContainer}>
                  <Text style={styles.activityNode}>All Activities</Text>
                </View>
              )}
            </View>
          </View>
          <Pressable
            onPress={() => {
              searchPeople();
              setShowSelectActivities(false);
              setShowFilters(false);
            }}
            style={[styles.buttonContent, GlobalStyles.buttonCancel]}
          >
            <Text style={styles.buttonText}>APPLY FILTERS</Text>
          </Pressable>
        </View>
      )}
      <SelectActivities
        visible={showSelectActivities}
        activities={activities}
        close={() => setShowSelectActivities(false)}
      />
      <LoadingSpinner visible={loading} />
      <Toast toastText={toastText} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textABC: {
    color: SignUpColor,
    fontSize: 16,
    marginTop: "auto",
    fontWeight: "bold",
  },
  viewPals: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  viewABC: {
    width: "10%",
    alignItems: "center",
    padding: 10,
  },
  viewPalsWidth: {
    width: "90%",
  },
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
    marginTop: 10,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    padding: 5,
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    zIndex: 0,
  },
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 15,
    color: PlaceholderColor,
  },
  checkInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: 0,
    alignItems: "flex-end",
  },
  buttonContent: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: WhiteColor,
    fontWeight: "bold",
  },
  iconSelect: {
    marginLeft: 10,
    marginTop: -2,
  },
  viewActivitiesSelected: {
    marginTop: 10,
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  activityNode: {
    color: SignUpColor,
    textAlign: "center",
    justifyContent: "center",
  },
  activityContainer: {
    borderWidth: 0.5,
    borderColor: SignUpColor,
    padding: 5,
    borderRadius: 20,
    justifyContent: "center",
    marginRight: 5,
    marginBottom: 5,
  },
  imagePressable: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
  profileImage: {
    height: 80,
    width: 80,
  },
  dummyImage: {
    height: 80,
    width: 80,
  },
  dummyImagePressable: {
    flexDirection: "row",
    width: "100%",
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 100,
  },
  friendRequestsMainView: {
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 160,
  },
  requestMainView: {
    justifyContent: "center",
    marginLeft: 10,
  },
  milesText: {
    width: "50%",
    textAlign: "right",
  },
  friendSentRequestsMainView: {
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 120,
  },
});



const mapStateToProps = (state) => ({
  session: state.reducerSession,
  myPals: state.reducerMyPals,
  myPalsRequest: state.reducerRequests,
  activity: state.reducerActivity,
});

const mapDispatchToProps = (dispatch) => ({
  getMyFriendsListener: (sUserKey = null) => {
    dispatch(actionGetMyFriendsListener(sUserKey));
  },
  getMyFriends: () => {
    dispatch(actionGetMyFriends());
  },
  getRequests: (sUserKey) => {
    dispatch(actionGetRequests(sUserKey));
  },
  getPeople: (
    sFilter,
    nMinAge,
    nMaxAge,
    nLatitude,
    nLongitude,
    nDistance,
    nGymId,
    aActivities
  ) => {
    dispatch(
      actionGetPeople(
        sFilter,
        nMinAge,
        nMaxAge,
        nLatitude,
        nLongitude,
        nDistance,
        nGymId,
        aActivities
      )
    );
  },
  resetStateRequest: () => {
    dispatch(actionResetStateRequest());
  },
  sendRequest: (sUserPalKey, sUserKey, sUsername, bIsHome) => {
    dispatch(actionSendRequest(sUserPalKey, sUserKey, sUsername, bIsHome));
  },
  acceptRequest: (nPalId, sPalKey, sUserKey) => {
    dispatch(actionAcceptRequest(nPalId, sPalKey, sUserKey));
  },
  cancelRequest: (data) => {
    dispatch(actionCancelRequest(data));
  },
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
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
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPalsList);
