import React, { Component } from "react";
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
  FlatList
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
import { connect } from "react-redux";
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
import { OPTIONS_GEOLOCATION_GET_POSITION } from "../../Constants";
import { actionCleanNavigation } from "../../redux/actions/NavigationActions";

class MyPalsList extends Component {
  constructor(props) {
    super(props);
    this.pickerGym = React.createRef();
    this.pickerAge = React.createRef();
    this.state = {
      tabSelectPals: true,
      loading: false,
      refresh: false,
      search: "",
      searchPals: "",
      filterRequests: "",
      toastText: "",
      refreshing: false,
      showFilters: false,
      nearMe: false,
      distance: 5,
      gym: null,
      ageRange: null,
      showSelectActivities: false,
      activities: [],
      gyms: [],
      gymsName: [],
    };
  }

  componentDidMount = () => {
    const { key: sUserKey } = this.props.session.account;
    this.props.getMyFriendsListener(sUserKey);
    this.getRequests();
    this.props.navigation.getParam("request", false) &&
      this.setState({
        tabSelectPals: false,
      });
    this.props.getAllActivities();
    this.props.getGyms();
  };

  componentWillUnmount = () => {
    this.props.getMyFriendsListener();
  };

  openOptions = () => {
    Keyboard.dismiss();
    this.setState({ showFilters: !this.state.showFilters });
  };

  getMyFriends = async () => {
    await this.setState({
      loading: true,
    });
    this.props.getMyFriends();
  };

  getRequests = async () => {
    await this.setState({
      loading: true,
    });
    this.props.getRequests(this.props.session.account.key);
  };

  componentWillReceiveProps = async (nextProps) => {
    if (
      null !== nextProps.myPalsRequest.statusSend &&
      nextProps.myPalsRequest.statusSend
    ) {
      this.props.resetStateRequest();
      await this.setState({ search: "", filterRequests: "" });
      this.searchPeople();
      this.showToast("Your request has been sent");
    } else if (
      null !== nextProps.myPalsRequest.statusSend &&
      !nextProps.myPalsRequest.statusSend
    ) {
      await this.setState({ search: "", filterRequests: "" });
      this.searchPeople();
      this.showToast(nextProps.myPalsRequest.messageError);
      this.props.resetStateRequest();
    }
    if (
      null !== nextProps.myPalsRequest.statusAccept &&
      nextProps.myPalsRequest.statusAccept === true
    ) {
      this.props.resetStateRequest();
      this.showToast("Successfully accepted");
    } else if (
      null !== nextProps.myPalsRequest.statusAccept &&
      !nextProps.myPalsRequest.statusAccept &&
      "" !== nextProps.myPalsRequest.messageError
    ) {
      this.showToast(nextProps.myPalsRequest.messageError);
      this.props.resetStateRequest();
    }
    if (
      null !== nextProps.myPalsRequest.statusCancel &&
      nextProps.myPalsRequest.statusCancel === true
    ) {
      this.props.resetStateRequest();
      this.showToast("Successfully cancel");
    }
    if (nextProps.activity.activities.length > 0) {
      await this.setState({
        activities: nextProps.activity.activities,
      });
    }
    if (nextProps.activity.gyms.length > 0) {
      var aGymsName = ["None"];
      nextProps.activity.gyms.forEach((oGym) => {
        aGymsName.push(oGym.name);
      });
      await this.setState({
        gyms: nextProps.activity.gyms,
        gymsName: aGymsName,
      });
    }

    if (nextProps.myPals.bRequestNavigation) {
      await this.setState({ tabSelectPals: false });
      this.props.cleanNavigation();
    }

    await this.setState({
      refresh: !this.state.refresh,
      loading: false,
      refreshing: false,
    });
  };

  searchPeople = async () => {
    await this.setState({
      filterRequests: this.state.search,
    });
    var aActivitiesSelected =
      this.state.activities.filter((item) => item.selected).length > 0 &&
        this.state.activities.filter((item) => item.selected).length <
        this.state.activities.length
        ? this.state.activities.filter((item) => item.selected)
        : null;

    var nGymId = null;
    if (null !== this.state.gym)
      this.state.gyms.forEach((oGym) => {
        if (oGym.name === this.state.gym) nGymId = oGym.id;
      });
    var sFilter = this.state.search,
      aActivities = aActivitiesSelected,
      nMaxAge = this.state.ageRange !== null ? this.state.ageMax : null,
      nMinAge = this.state.ageRange !== null ? this.state.ageMin : null,
      nDistance = this.state.distance,
      nLongitude = null,
      nLatitude = null;
    if (this.state.nearMe)
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            if (position && undefined !== position.coords) {
              nLongitude = position.coords.longitude;
              nLatitude = position.coords.latitude;
            }
            this.props.getPeople(
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
            this.props.getPeople(
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
        this.props.getPeople(
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
      this.props.getPeople(
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

  notOtherArray = (nIdFitrec) => {
    if (nIdFitrec === this.props.session.account.id) {
      return false;
    }
    if (
      this.props.myPalsRequest.requestsRecived !== undefined &&
      this.props.myPalsRequest.requestsRecived.length > 0
    ) {
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
    if (this.props.myPals.myFriends.length > 0) {
      if (
        this.props.myPals.myFriends.filter(
          (element) => nIdFitrec === element.id
        ).length > 0
      ) {
        return false;
      }
    }
    return true;
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

  sendRequest = async (sUserPalKey) => {
    await this.setState({
      loading: true,
    });
    this.props.sendRequest(
      sUserPalKey,
      this.props.session.account.key,
      this.props.session.account.name,
      false
    );
  };

  acceptRequest = async (oPal) => {
    this.props.acceptRequest(oPal.id, oPal.key, this.props.session.account.key);
  };

  cancelRequest = async (lFriendItem, sType) => {
    await this.setState({
      loading: true,
    });
    this.props.cancelRequest({
      accountId: this.props.session.account.key,
      friendKey: lFriendItem.key,
      type: sType,
    });
  };

  refreshFriends = async () => {
    await this.setState({
      refreshing: true,
    });
    this.getMyFriends();
  };

  refreshRequest = async () => {
    await this.setState({
      refreshing: true,
    });
    this.getRequests();
  };

  changeTab = async (bValue) => {
    if (bValue) {
      await this.setState({ search: "", searchPals: "" });
      this.searchPeople();
    }
    await this.setState({ tabSelectPals: bValue });
  };

  redirectionViewProfile = (nIdFitrec) => {
    this.props.getProfile(nIdFitrec);
    this.props.navigation.navigate("ProfileViewDetails");
  };

  getAgeValue = (sValue) => {
    if (sValue === "Under 18 years old")
      this.setState({
        ageRange: sValue,
        ageMin: 0,
        ageMax: 18,
      });
    else if (sValue === "Between 18 and 30 years")
      this.setState({
        ageRange: sValue,
        ageMin: 18,
        ageMax: 30,
      });
    else if (sValue === "Over 30 years old")
      this.setState({
        ageRange: sValue,
        ageMin: 30,
        ageMax: 100,
      });
    else
      this.setState({
        ageRange: null,
      });
  };

  resetFilters = async () => {
    undefined !== this.state.activities &&
      this.state.activities.map((oActivity) => {
        oActivity.selected = false;
      });
    await this.setState({
      ageRange: null,
      ageMax: null,
      ageMin: null,
      gym: null,
      nearMe: false,
      distance: 5,
      refresh: !this.state.refresh,
    });
    this.searchPeople();
  };

  selectGym = (sValue) => {
    this.setState({
      gym: "None" === sValue ? null : sValue,
    });
  };

  render = () => {
    return (
      <ImageBackground
        source={require("../../assets/bk.png")}
        resizeMode="stretch"
        style={GlobalStyles.fullImage}
      >
        <View style={GlobalTabs.viewTabs}>
          <Pressable
            onPress={() => this.changeTab(true)}
            style={[
              GlobalTabs.tabLeft,
              this.state.tabSelectPals && GlobalTabs.tabActive,
            ]}
          >
            <View>
              <Text
                style={
                  this.state.tabSelectPals
                    ? GlobalTabs.tabsTextActive
                    : GlobalTabs.tabsText
                }
              >
                Pals
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => this.changeTab(false)}
            style={[
              GlobalTabs.tabRight,
              !this.state.tabSelectPals && GlobalTabs.tabActive,
            ]}
          >
            <View>
              <Text
                style={
                  !this.state.tabSelectPals
                    ? GlobalTabs.tabsTextActive
                    : GlobalTabs.tabsText
                }
              >
                Requests
              </Text>
            </View>
          </Pressable>
        </View>
        {this.state.tabSelectPals ? (
          <View style={styles.viewPals}>
            <View style={styles.viewPalsWidth}>
              <SearchUsername
                ph="Search for people or username"
                value={this.state.searchPals}
                change={(text) => this.setState({ searchPals: text })}
                clean={() => {
                  this.setState({ searchPals: "" });
                }}
              />
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshFriends()}
                    tintColor={GreenFitrecColor}
                    title="Pull to refresh..."
                  />
                }
              >
                {this.props.myPals.myFriends.length > 0 && (
                  <FlatList
                    data={this.props.myPals.myFriends.filter(
                      (element) =>
                        element.name
                          .toUpperCase()
                          .includes(this.state.searchPals.toUpperCase()) ||
                        element.username
                          .toUpperCase()
                          .includes(this.state.searchPals.toUpperCase())
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.refresh}
                    renderItem={({ item }) => (
                      <Pressable
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          padding: 10,
                        }}
                        onPress={() => this.redirectionViewProfile(item.id)}
                      >
                        {undefined === item.image || null === item.image ? (
                          <Image
                            style={{ height: 80, width: 80 }}
                            source={require("../../assets/imgProfileReadOnly2.png")}
                          />
                        ) : (
                          <FastImage
                            style={{ height: 80, width: 80, borderRadius: 100 }}
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
                {/*These letters are supposed to order the names of friends
                                        Is commented for future version
                                    <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                                        <Text style={{ fontWeight: 'bold', color: PlaceholderColor }}>F</Text>
                                    </View>*/}
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
              value={this.state.search}
              change={(text) => {
                this.setState({ search: text });
                "" === text && this.searchPeople();
              }}
              blur={() => this.searchPeople()}
              clean={() => {
                this.setState({ search: "" });
                this.searchPeople();
              }}
            />
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.refreshRequest()}
                  tintColor={GreenFitrecColor}
                  title="Pull to refresh..."
                />
              }
            >
              {this.props.myPalsRequest.requestsRecived !== undefined &&
                this.props.myPalsRequest.requestsRecived instanceof Array &&
                this.props.myPalsRequest.requestsRecived !== null && (
                  <FlatList
                    data={this.props.myPalsRequest.requestsRecived.filter(
                      (element) =>
                        element.name
                          .toUpperCase()
                          .includes(this.state.filterRequests.toUpperCase()) ||
                        element.username
                          .toUpperCase()
                          .includes(this.state.filterRequests.toUpperCase())
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.refresh}
                    renderItem={({ item }) => (
                      <View style={styles.viewNotificaton}>
                        <Pressable
                          onPress={() => this.redirectionViewProfile(item.id)}
                          style={{ flexDirection: "row", width: "100%" }}
                        >
                          {null === item.image || undefined === item.image ? (
                            <Image
                              style={{ height: 80, width: 80 }}
                              source={require("../../assets/imgProfileReadOnly2.png")}
                            />
                          ) : (
                            <FastImage
                              style={{
                                height: 80,
                                width: 80,
                                borderRadius: 100,
                              }}
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
                              marginRight: 160,
                            }}
                          >
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
                          onPress={() => this.acceptRequest(item)}
                        >
                          <Icon
                            name="md-checkmark"
                            size={32}
                            color="yellowgreen"
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => this.cancelRequest(item, "reject")}
                          style={[styles.viewIconRight, { right: 50 }]}
                        >
                          <Icon name="md-close" size={32} color={SignUpColor} />
                        </Pressable>
                      </View>
                    )}
                  />
                )}
              {undefined !== this.props.myPalsRequest.requestsSent && (
                <FlatList
                  data={this.props.myPalsRequest.requestsSent.filter(
                    (element) =>
                      element.name.includes(this.state.filterRequests) ||
                      element.username.includes(this.state.filterRequests)
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state.refresh}
                  renderItem={({ item }) => (
                    <View style={styles.viewNotificaton}>
                      <Pressable
                        onPress={() => this.redirectionViewProfile(item.id)}
                        style={{ flexDirection: "row", width: "100%" }}
                      >
                        {undefined === item.image ||
                          null === item.image ||
                          "" === item.image ? (
                          <Image
                            style={{ height: 80, width: 80 }}
                            source={require("../../assets/imgProfileReadOnly2.png")}
                          />
                        ) : (
                          <FastImage
                            style={{ height: 80, width: 80, borderRadius: 100 }}
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
                            marginRight: 120,
                          }}
                        >
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
                        onPress={() => this.cancelRequest(item, "cancel")}
                        style={styles.viewIconRight}
                      >
                        <Icon name="md-close" size={32} color={SignUpColor} />
                      </Pressable>
                    </View>
                  )}
                />
              )}
              <FlatList
                data={this.props.myPalsRequest.peopleFitrec.filter((element) =>
                  this.notOtherArray(element.id)
                )}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state.refresh}
                renderItem={({ item }) => (
                  <View style={styles.viewNotificaton}>
                    <Pressable
                      onPress={() => this.redirectionViewProfile(item.id)}
                      style={{ flexDirection: "row", width: "100%" }}
                    >
                      {null === item.image ? (
                        <Image
                          style={{ height: 80, width: 80 }}
                          source={require("../../assets/imgProfileReadOnly2.png")}
                        />
                      ) : (
                        <FastImage
                          style={{ height: 80, width: 80, borderRadius: 100 }}
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
                        <Text>@{item.username}</Text>
                      </View>
                      <Pressable
                        onPress={() => this.sendRequest(item.key)}
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
                  onPress={() => this.openOptions()}
                >
                  <Text style={GlobalBubble.text}>FILTER</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {this.state.showFilters && (
          <View style={GlobalModal.viewContent}>
            <View style={GlobalModal.viewHead}>
              {this.state.ageRange !== null ||
                this.state.gym !== null ||
                this.state.activities.filter((item) => item.selected).length >
                0 ||
                this.state.nearMe !== false ? (
                <Pressable
                  style={[GlobalModal.buttonLeft, { flexDirection: "row" }]}
                  onPress={() => this.resetFilters()}
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
                onPress={() => this.setState({ showFilters: false })}
              >
                <Icon name="close" color={SignUpColor} size={22} />
                <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                  Close
                </Text>
              </Pressable>
            </View>
            <View style={{ padding: 20 }}>
              {this.state.gymsName !== undefined && (
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
                      onPress={() => this.pickerGym.current.show()}
                      style={{ flexDirection: "row" }}
                    >
                      <Text>
                        {null !== this.state.gym ? this.state.gym : "None"}
                      </Text>
                      <Icon
                        name="chevron-down"
                        size={22}
                        style={styles.iconSelect}
                      />
                    </Pressable>
                  </View>
                  <ReactNativePickerModule
                    pickerRef={this.pickerGym}
                    title={"Gym"}
                    items={this.state.gymsName}
                    onValueChange={(value) => this.selectGym(value)}
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
                    onPress={() => this.pickerAge.current.show()}
                    style={{ flexDirection: "row" }}
                  >
                    <Text>
                      {null !== this.state.ageRange
                        ? this.state.ageRange
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
                  pickerRef={this.pickerAge}
                  title={"Gym"}
                  items={[
                    "Select here",
                    "Under 18 years old",
                    "Between 18 and 30 years",
                    "Over 30 years old",
                  ]}
                  onValueChange={(value) => {
                    this.getAgeValue(value);
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
                    onPress={() => {
                      this.setState({
                        nearMe: !this.state.nearMe,
                      });
                    }}
                    isCheck={this.state.nearMe}
                    title={null}
                  />
                </View>
              </View>
              {this.state.nearMe && (
                <View style={{ width: "100%" }}>
                  <Slider
                    step={1}
                    minimumValue={1}
                    maximumValue={30}
                    onValueChange={(value) =>
                      this.setState({ distance: value })
                    }
                    value={this.state.distance}
                    minimumTrackTintColor={SignUpColor}
                    thumbTintColor={SignUpColor}
                  />
                  <View style={{ width: "100%", flexDirection: "row" }}>
                    <Text style={[GlobalStyles.textMuted, { width: "50%" }]}>
                      1 Mile
                    </Text>
                    <Text
                      style={[
                        GlobalStyles.textMuted,
                        { width: "50%", textAlign: "right" },
                      ]}
                    >
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
                    onPress={() =>
                      this.setState({ showSelectActivities: true })
                    }
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
                {this.state.activities !== undefined &&
                  this.state.activities.filter((item) => item.selected) !==
                  undefined &&
                  this.state.activities.filter((item) => item.selected).length >
                  0 &&
                  this.state.activities.filter((item) => item.selected).length <
                  this.state.activities.length ? (
                  this.state.activities
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
                this.searchPeople();
                this.setState({
                  showSelectActivities: false,
                  showFilters: false,
                });
              }}
              style={[styles.buttonContent, GlobalStyles.buttonCancel]}
            >
              <Text style={styles.buttonText}>APPLY FILTERS</Text>
            </Pressable>
          </View>
        )}
        <SelectActivities
          visible={this.state.showSelectActivities}
          activities={this.state.activities}
          close={() => this.setState({ showSelectActivities: false })}
        />
        <LoadingSpinner visible={this.state.loading} />
        <Toast toastText={this.state.toastText} />
      </ImageBackground>
    );
  };
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
});

const lABC = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

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
