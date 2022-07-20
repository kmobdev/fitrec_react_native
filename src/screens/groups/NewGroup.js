import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  GlobalStyles,
  SignUpColor,
  PlaceholderColor,
  GreenFitrecColor,
  BlackColor,
} from "../../Styles";
import { SearchUsername } from "../../components/chat/SearchUsername";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import { Toast } from "../../components/shared/Toast";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import Icon from "react-native-vector-icons/Ionicons";
import {
  actionCreateGroup,
  actionResetCreateGroup,
} from "../../redux/actions/GroupActions";
import ReactNativePickerModule from "react-native-picker-module";
import Geolocation from "@react-native-community/geolocation";
import { actionGetPeopleGroup } from "../../redux/actions/MyPalsActions";
import { actionGetMyFriends } from "../../redux/actions/ProfileActions";
import FastImage from "react-native-fast-image";
import {
  MESSAGE_ERROR,
  OPTIONS_GEOLOCATION_GET_POSITION,
  OPTIONS_IMAGE_CROP_PROFILE,
} from "../../Constants";

let RNFS = require("react-native-fs");

class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.pickerSex = React.createRef();
    this.state = {
      search: "",
      groupName: "",
      groupDescription: "",
      groupType: null,
      participants: [],
      capitans: null,
      friends: [],
      friendsBack: null,
      refresh: true,
      selectCapitan: false,
      toastText: "",
      loading: false,
      showGroupPhoto: false,
      imgGroup: null,
      isKeyboardShow: false,
      loadingCreate: false,
    };
    Keyboard.addListener("keyboardDidShow", () =>
      this.setState({ isKeyboardShow: true })
    );
    Keyboard.addListener("keyboardWillShow", () =>
      this.setState({ isKeyboardShow: true })
    );
    Keyboard.addListener("keyboardWillHide", () =>
      this.setState({ isKeyboardShow: false })
    );
    Keyboard.addListener("keyboardDidHide", () =>
      this.setState({ isKeyboardShow: false })
    );
  }

  componentDidMount = () => {
    this.setState({
      loading: false,
    });
    this.props.navigation.setParams({ createGroup: this.createGroup });
  };

  searchUsers = async () => {
    await this.setState({
      friends: [],
      loading: true,
    });
    if ("" === this.state.search) {
      this.state.friendsBack.forEach((oUser) => {
        if (
          this.state.participants.filter((element) => element.key === oUser.key)
            .length == 0
        ) {
          this.setState({
            friends: [...this.state.friends, oUser],
          });
        }
      });
      await this.setState({
        loading: false,
      });
    } else {
      let aUsersKeys = [];
      this.state.participants.forEach((oUser) => {
        aUsersKeys.push(oUser.key);
      });
      this.props.getPeople(this.state.search, aUsersKeys);
    }
  };

  createGroup = async () => {
    if (!this.state.loadingCreate) {
      this.setState({ loadingCreate: true });
      const {
        groupName: sGroupName,
        groupDescription: sGroupDescription,
        groupType: sGroupType,
      } = this.state;
      if (null === sGroupName || "" === sGroupName.trim()) {
        this.setState({ loadingCreate: false });
        return this.showToast("Group name is required");
      }
      if (null === sGroupDescription || "" === sGroupDescription.trim()) {
        this.setState({ loadingCreate: false });
        return this.showToast("Group description is required");
      }
      if (null === sGroupType) {
        this.setState({ loadingCreate: false });
        return this.showToast("Group type is required");
      }
      let aCreator = {
        key: this.props.session.account.key,
        name: this.props.session.account.name,
        username: this.props.session.account.username,
        id: this.props.session.account.id,
        is_capitan: true,
      };
      let aUsers = [aCreator];
      await this.state.participants.forEach((user) => {
        aUsers.push(user);
      });
      let sUserKey = this.props.session.account.key,
        sName = sGroupName.trim(),
        sDescription = sGroupDescription.trim(),
        sImage = this.state.imgGroup,
        nType = sGroupType === "Private" ? 1 : 0,
        nLatitude = null,
        nLongitude = null;
      try {
        Geolocation.getCurrentPosition(
          (oPosition) => {
            if (oPosition && undefined !== oPosition.coords) {
              nLatitude = oPosition.coords.latitude;
              nLongitude = oPosition.coords.longitude;
            }
            this.props.createGroup(
              sUserKey,
              sName,
              sDescription,
              aUsers,
              sImage,
              nType,
              nLatitude,
              nLongitude
            );
            this.setState({ loadingCreate: false });
          },
          (oError) => {
            this.props.createGroup(
              sUserKey,
              sName,
              sDescription,
              aUsers,
              sImage,
              nType,
              nLatitude,
              nLongitude
            );
            this.setState({ loadingCreate: false });
          },
          OPTIONS_GEOLOCATION_GET_POSITION
        );
      } catch (oError) {
        this.props.createGroup(
          sUserKey,
          sName,
          sDescription,
          aUsers,
          sImage,
          nType,
          nLatitude,
          nLongitude
        );
        this.setState({ loadingCreate: false });
      }
    }
  };

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.grupProps.status) {
      await this.setState({
        search: "",
        groupName: "",
        groupDescription: "",
        groupType: null,
        participants: [],
        capitans: null,
        refresh: true,
        selectCapitan: false,
        toastText: "",
        loading: false,
        showGroupPhoto: false,
        imgGroup: null,
        usersFilter: [],
      });
      this.props.resetCreateGroup();
      nextProps.grupProps
        ? this.props.navigation.navigate("Groups", {
          firebaseId: nextProps.grupProps.firebaseId,
        })
        : this.props.navigation.navigate("Groups");
    } else
      await this.setState({
        loading: false,
      });
    if (
      this.state.search !== "" &&
      nextProps.myPalsRequest.peopleFitrec !== this.state.usersFilter
    ) {
      await this.setState({
        friends: nextProps.myPalsRequest.peopleFitrec,
        loading: false,
        usersFilter: nextProps.myPalsRequest.peopleFitrec,
      });
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
  };

  addImageGroup = async (sType) => {
    await this.setState({
      showGroupPhoto: false,
      loadingImage: true,
    });
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_PROFILE)
        .then(async (oResponse) => {
          let sImageB64 = oResponse.data;
          this.setState({
            imgGroup: sImageB64,
          });
        })
        .catch(() => {
          if (oError.code !== "E_PICKER_CANCELLED")
            this.showToast(MESSAGE_ERROR);
        })
        .finally(() => {
          this.setState({
            showPhoto: false,
            loadingImage: false,
          });
        });
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_PROFILE)
        .then(async (oResponse) => {
          let sImageB64 = oResponse.data;
          this.setState({
            imgGroup: sImageB64,
          });
        })
        .catch(() => {
          if (oError.code !== "E_PICKER_CANCELLED")
            this.showToast(MESSAGE_ERROR);
        })
        .finally(() => {
          this.setState({
            showPhoto: false,
            loadingImage: false,
          });
        });
    }
  };

  addParticipant = async (participant) => {
    await this.setState({
      participants: [...this.state.participants, participant],
    });
    let array = [];
    this.state.friends.forEach((friend) => {
      if (friend.key !== participant.key) array.push(friend);
    });
    this.state.refresh = !this.state.refresh;
    await this.setState({
      friends: array,
      refresh: !this.state.refresh,
    });
  };

  removeParticipant = async (participant) => {
    participant.is_capitan = false;
    await this.setState({
      friends: [...this.state.friends, participant],
    });
    let array = [];
    this.state.participants.forEach((friend) => {
      if (friend.key !== participant.key) array.push(friend);
    });
    await this.setState({
      participants: array,
      refresh: !this.state.refresh,
    });
  };

  selectOtherCapitan = () => {
    this.setState({
      selectCapitan: true,
      refresh: !this.state.refresh,
    });
  };

  dissmissSelectedCapitans = () => {
    this.setState({
      selectCapitan: false,
      refresh: !this.state.refresh,
    });
  };

  selectCapitan = async (user) => {
    let participants = [],
      nCount = 0;
    await this.state.participants.map(function (participant) {
      if (participant.is_capitan) nCount++;
    });
    if (nCount < 2) {
      await this.state.participants.forEach((participant) => {
        if (participant.key === user.key) participant.is_capitan = true;
        participants.push(participant);
      });
      await this.setState({
        participants: participants,
        refresh: !this.state.refresh,
      });
    } else this.showToast("Only two captains can be added in addition to you");
  };

  removeCapitanSelected = async (user) => {
    let participants = [];
    await this.state.participants.forEach((participant) => {
      if (participant.key === user.key) participant.is_capitan = false;
      participants.push(participant);
    });
    await this.setState({
      participants: participants,
      refresh: !this.state.refresh,
    });
  };

  changeTextName = async (text) => {
    await this.setState({
      groupName: text,
    });
  };

  changeTextDescription = async (text) => {
    await this.setState({
      groupDescription: text,
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

  showGroupPhoto = async () => {
    Keyboard.dismiss();
    await this.setState({
      showGroupPhoto: true,
    });
  };

  render() {
    return (
      <ImageBackground
        source={require("../../assets/bk.png")}
        resizeMode="stretch"
        style={GlobalStyles.fullImage}
      >
        <ScrollView>
          {this.state.search === "" && (
            <>
              <View style={{ flexDirection: "row", padding: 10 }}>
                <View style={{ width: "40%", alignItems: "center" }}>
                  {null !== this.state.imgGroup &&
                    "" !== this.state.imgGroup ? (
                    <View>
                      <Pressable
                        onPress={() => {
                          this.showGroupPhoto();
                        }}
                      >
                        <Image
                          style={GlobalStyles.photoProfileProfilePreviewPhoto}
                          source={{
                            uri: "data:image/png;base64," + this.state.imgGroup,
                          }}
                        />
                        <Text style={styles.textPhoto}>Change Group Photo</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => {
                        this.showGroupPhoto();
                      }}
                    >
                      <Image
                        style={{ height: 150, width: 150 }}
                        source={require("../../assets/imgGroup.png")}
                      />
                      <Text style={styles.textPhoto}>Set Group Photo</Text>
                    </Pressable>
                  )}
                </View>
                <View style={{ justifyContent: "center", width: "60%" }}>
                  <View
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderBottomWidth: 0.5,
                    }}
                  >
                    <TextInput
                      placeholder="Group name"
                      placeholderTextColor={PlaceholderColor}
                      value={this.state.groupName}
                      onChangeText={(text) => this.changeTextName(text)}
                      style={{ color: BlackColor }}
                    />
                  </View>
                  <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <TextInput
                      placeholder="Description for this group..."
                      placeholderTextColor={PlaceholderColor}
                      value={this.state.groupDescription}
                      onChangeText={(text) => this.changeTextDescription(text)}
                      style={{ color: BlackColor }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.viewSection,
                  styles.textInput,
                  { alignItems: "flex-end" },
                ]}
              >
                <Text style={styles.textLabel}>Group Type</Text>
                <View style={[styles.comboSelect]}>
                  <Pressable
                    onPress={() => this.pickerSex.current.show()}
                    style={{ flexDirection: "row" }}
                  >
                    <Text style={{ paddingRight: 20, fontSize: 15 }}>
                      {this.state.groupType != null
                        ? this.state.groupType
                        : "Select here"}
                    </Text>
                    <Icon name="chevron-down" size={22} />
                  </Pressable>
                </View>
                <ReactNativePickerModule
                  pickerRef={this.pickerSex}
                  title={"Group Type"}
                  items={["Public", "Private"]}
                  onValueChange={(value) => {
                    this.setState({
                      groupType: value,
                    });
                  }}
                />
              </View>
            </>
          )}
          <View>
            <View style={[styles.view, styles.margin]}>
              <Icon name="ios-people" size={56} color={PlaceholderColor} />
              <Text
                style={{
                  fontSize: 15,
                  marginStart: 25,
                  color: GreenFitrecColor,
                }}
              >
                PARTICIPANTS: {this.state.participants.length}
              </Text>
            </View>
            {this.state.search === "" && (
              <>
                <View style={[styles.viewActivitiesSelected, styles.margin]}>
                  {this.state.participants.map((item) =>
                    null !== this.state.selectCapitan &&
                      this.state.selectCapitan ? (
                      item.is_capitan ? (
                        <Pressable
                          key={item.key}
                          onPress={() => {
                            this.removeCapitanSelected(item);
                          }}
                        >
                          <View
                            style={[
                              styles.margin,
                              { alignItems: "center", textAlign: "center" },
                            ]}
                          >
                            <View>
                              {null == item.image ||
                                undefined == item.image ||
                                "" == item.image ? (
                                <Image
                                  style={GlobalStyles.photoProfileCardList}
                                  source={require("../../assets/profile.png")}
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
                              <View style={styles.iconUser}>
                                {null !== this.state.selectCapitan &&
                                  this.state.selectCapitan ? (
                                  item.is_capitan ? (
                                    <Icon
                                      name="md-checkmark-circle"
                                      size={24}
                                      color={SignUpColor}
                                    />
                                  ) : (
                                    <Icon
                                      name="ios-add-circle-outline"
                                      size={24}
                                      color={PlaceholderColor}
                                    />
                                  )
                                ) : null}
                              </View>
                            </View>
                            <View>
                              <Text>{item.username}</Text>
                            </View>
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          key={item.key}
                          onPress={() => {
                            this.selectCapitan(item);
                          }}
                        >
                          <View
                            style={[
                              styles.margin,
                              { alignItems: "center", textAlign: "center" },
                            ]}
                          >
                            <View>
                              {null == item.image ||
                                undefined == item.image ||
                                "" == item.image ? (
                                <Image
                                  style={GlobalStyles.photoProfileCardList}
                                  source={require("../../assets/profile.png")}
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
                              <View style={styles.iconUser}>
                                {null !== this.state.selectCapitan &&
                                  this.state.selectCapitan ? (
                                  item.is_capitan ? (
                                    <Icon
                                      name="md-checkmark-circle"
                                      size={24}
                                      color={SignUpColor}
                                    />
                                  ) : (
                                    <Icon
                                      name="ios-add-circle-outline"
                                      size={24}
                                      color={PlaceholderColor}
                                    />
                                  )
                                ) : null}
                              </View>
                            </View>
                            <View>
                              <Text>{item.username}</Text>
                            </View>
                          </View>
                        </Pressable>
                      )
                    ) : (
                      <Pressable
                        key={item.key}
                        onPress={() => {
                          this.removeParticipant(item);
                        }}
                      >
                        <View
                          style={[
                            styles.margin,
                            { alignItems: "center", textAlign: "center" },
                          ]}
                        >
                          <View>
                            {null == item.image ||
                              undefined == item.image ||
                              "" == item.image ? (
                              <Image
                                style={GlobalStyles.photoProfileCardList}
                                source={require("../../assets/profile.png")}
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
                            <View style={styles.iconUser}>
                              {item.is_capitan ? (
                                <Icon
                                  name="md-checkmark-circle"
                                  size={24}
                                  color={SignUpColor}
                                />
                              ) : null}
                            </View>
                          </View>
                          <View>
                            <Text>{item.username}</Text>
                          </View>
                        </View>
                      </Pressable>
                    )
                  )}
                </View>
                {this.state.participants.length > 0 ? (
                  <View style={styles.margin}>
                    {null !== this.state.selectCapitan &&
                      this.state.selectCapitan == true ? (
                      <Button
                        title="Save captains selected"
                        color={SignUpColor}
                        onPress={() => this.dissmissSelectedCapitans()}
                      />
                    ) : (
                      <Button
                        title="Select others captains"
                        color={GreenFitrecColor}
                        onPress={() => this.selectOtherCapitan()}
                      />
                    )}
                  </View>
                ) : (
                  <View style={styles.margin}>
                    <Text style={styles.textPhoto}>
                      Add members to the list
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
          <View style={styles.margin}>
            <SearchUsername
              ph="Search for people or username"
              value={this.state.search}
              change={(text) => {
                this.setState({ search: text });
                "" === text && this.searchUsers();
              }}
              blur={() => this.searchUsers()}
              clean={() => {
                this.setState({ search: "" });
                this.searchUsers();
              }}
            />
          </View>
          <View>
            {this.state.friends.length > 0 ? (
              <FlatList
                data={this.state.friends}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state.refresh}
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      onPress={() => {
                        this.addParticipant(item);
                      }}
                    >
                      <View style={[styles.userCard, styles.margin]}>
                        <View>
                          {null == item.image ||
                            undefined == item.image ||
                            "" == item.image ? (
                            <Image
                              style={GlobalStyles.photoProfileCardList}
                              source={require("../../assets/profile.png")}
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
                        </View>
                        <View style={styles.margin}>
                          <Text style={{ fontWeight: "bold" }}>
                            {item.name}
                          </Text>
                          <Text style={{ fontWeight: "bold" }}>
                            @{item.username}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
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
                No more friends were found to add to the group
              </Text>
            )}
          </View>
        </ScrollView>
        <ToastQuestion
          visible={this.state.showGroupPhoto}
          functionCamera={() => this.addImageGroup("camera")}
          functionGallery={() => this.addImageGroup("gallery")}
        />
        <Toast toastText={this.state.toastText} />
        <LoadingSpinner
          visible={this.state.loadingImage || this.state.loadingCreate}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  textPhoto: {
    color: SignUpColor,
    fontWeight: "100",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  view: {
    width: "100%",
    alignItems: "flex-start",
    marginStart: 35,
    flexDirection: "row",
    alignItems: "center",
  },
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 10,
    color: PlaceholderColor,
    fontSize: 15,
  },
  textInput: {
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
    right: "5%",
    alignItems: "flex-end",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  margin: {
    margin: 5,
  },
  viewActivitiesSelected: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconUser: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  grupProps: state.reducerGroup,
  myPalsRequest: state.reducerRequests,
  friendsProps: state.reducerMyPals,
});

const mapDispatchToProps = (dispatch) => ({
  createGroup: (
    sUserKey,
    sName,
    sDescription,
    aUsers,
    sImage,
    nType,
    nLatitude,
    nLongitude
  ) => {
    dispatch(
      actionCreateGroup(
        sUserKey,
        sName,
        sDescription,
        aUsers,
        sImage,
        nType,
        nLatitude,
        nLongitude
      )
    );
  },
  resetCreateGroup: () => {
    dispatch(actionResetCreateGroup());
  },
  getPeople: (data) => {
    dispatch(actionGetPeopleGroup(data));
  },
  getMyFriends: (sUserKey) => {
    dispatch(actionGetMyFriends(sUserKey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewGroup);
