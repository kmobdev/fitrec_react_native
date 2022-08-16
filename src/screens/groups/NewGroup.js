import React, { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import { Toast } from "../../components/shared/Toast";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import Icon from "react-native-vector-icons/Ionicons";
import { actionCreateGroup, actionResetCreateGroup } from "../../redux/actions/GroupActions";
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

const NewGroup = (props) => {

  const pickerSex = useRef();

  const session = useSelector((state) => state.reducerSession);
  const grupProps = useSelector((state) => state.reducerGroup);
  const myPalsRequest = useSelector((state) => state.reducerRequests);
  const friendsProps = useSelector((state) => state.reducerMyPals);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [toastText, setToastText] = useState("");
  const [participants, setParticipants] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groupType, setGroupType] = useState(null);
  const [capitans, setCapitans] = useState(null);
  const [friendsBack, setFriendsBack] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [selectCapitan, setSelectCapitan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersFilter, setUsersFilter] = useState(null);
  const [showGroupPhoto, setShowGroupPhoto] = useState(false);
  const [imgGroup, setImgGroup] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    setLoading(false);
    props.navigation.setParams({ createGroup: createGroup });
  }, [])

  useEffect(() => {
    if (grupProps.status) {
      setSearch("");
      setGroupName("");
      setGroupDescription("");
      setGroupType(null);
      setParticipants([]);
      setCapitans(null);
      setRefresh(true);
      setSelectCapitan(false);
      setToastText("");
      setLoading(false);
      setShowGroupPhoto(false);
      setImgGroup(null);
      setUsersFilter([]);
      dispatch(actionResetCreateGroup());
      grupProps
        ? props.navigation.navigate("Groups", {
          firebaseId: grupProps.firebaseId,
        })
        : props.navigation.navigate("Groups");
    } else
      setLoading(false);
    if (
      search !== "" &&
      myPalsRequest.peopleFitrec !== props.usersFilter
    ) {
      setFriends(myPalsRequest.peopleFitrec);
      setUsersFilter(myPalsRequest.peopleFitrec);
      setLoading(false);
    }
    if (
      friendsProps.status !== true &&
      (null === friendsProps.myFriends ||
        friendsProps.myFriends.length === 0)
    )
      dispatch(actionGetMyFriends(session.account.key));
    else if (null === friendsBack)
      setFriendsBack(friendsProps.myFriends);
    setFriends(friendsProps.myFriends);
  }, [grupProps, myPalsRequest, myPalsRequest, friendsProps])

  const searchUsers = () => {
    setFriends([]);
    setLoading(true);
    if ("" === search) {
      friendsBack.forEach((oUser) => {
        if (
          participants.filter((element) => element.key === oUser.key)
            .length == 0
        ) {
          setFriends([...friends, oUser]);
        }
      });
      setLoading(false);
    } else {
      let aUsersKeys = [];
      participants.forEach((oUser) => {
        aUsersKeys.push(oUser.key);
      });
      dispatch(actionGetPeopleGroup(search, aUsersKeys));
    }
  };

  const createGroup = () => {
    if (!loadingCreate) {
      setLoadingCreate(true);
      if (null === groupName || "" === groupName.trim()) {
        setLoadingCreate(false);
        return showToast("Group name is required");
      }
      if (null === groupDescription || "" === groupDescription.trim()) {
        setLoadingCreate(false);
        return showToast("Group description is required");
      }
      if (null === groupType) {
        setLoadingCreate(false);
        return showToast("Group type is required");
      }
      let aCreator = {
        key: session.account.key,
        name: session.account.name,
        username: session.account.username,
        id: session.account.id,
        is_capitan: true,
      };
      let aUsers = [aCreator];
      participants.forEach((user) => {
        aUsers.push(user);
      });
      let sUserKey = session.account.key,
        sName = groupName.trim(),
        sDescription = groupDescription.trim(),
        sImage = imgGroup,
        nType = groupType === "Private" ? 1 : 0,
        nLatitude = null,
        nLongitude = null;
      try {
        Geolocation.getCurrentPosition(
          (oPosition) => {
            if (oPosition && undefined !== oPosition.coords) {
              nLatitude = oPosition.coords.latitude;
              nLongitude = oPosition.coords.longitude;
            }
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
            setLoadingCreate(false);
          },
          (oError) => {
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
            setLoadingCreate(false);
          },
          OPTIONS_GEOLOCATION_GET_POSITION
        );
      } catch (oError) {
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
        setLoadingCreate(false);
      }
    }
  };

  const addImageGroup = (sType) => {
    setShowGroupPhoto(false);
    setLoadingImage(true);
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_PROFILE)
        .then((oResponse) => {
          let sImageB64 = oResponse.data;
          setImgGroup(sImageB64);
          setLoadingImage(false);
        })
        .catch((error) => {
          setLoadingImage(false);
          showToast(String(error));
        })
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_PROFILE)
        .then((oResponse) => {
          let sImageB64 = oResponse.data;
          setImgGroup(sImageB64);
          setLoadingImage(false);
        })
        .catch((error) => {
          setLoadingImage(false);
          showToast(String(error));
        })
    }
  };

  const addParticipant = (participant) => {
    setParticipants([...participants, participant]);
    let array = [];
    friends.forEach((friend) => {
      if (friend.key !== participant.key) array.push(friend);
    });
    setFriends(array);
    setRefresh(!refresh);
  };

  const removeParticipant = (participant) => {
    participant.is_capitan = false;
    setFriends([...friends, participant]);
    let array = [];
    participants.forEach((friend) => {
      if (friend.key !== participant.key) array.push(friend);
    });
    setFriends(array);
    setRefresh(!refresh);
  };

  const selectOtherCapitan = () => {
    setSelectCapitan(true);
    setRefresh(!refresh);
  };

  const dissmissSelectedCapitans = () => {
    setSelectCapitan(false);
    setRefresh(!refresh);
  };

  const selectCapitanHandler = (user) => {
    let participants = [],
      nCount = 0;
    participants.map(function (participant) {
      if (participant.is_capitan) nCount++;
    });
    if (nCount < 2) {
      participants.forEach((participant) => {
        if (participant.key === user.key) participant.is_capitan = true;
        participants.push(participant);
      });
      setParticipants(participants);
      setRefresh(!refresh);
    } else showToast("Only two captains can be added in addition to you");
  };

  const removeCapitanSelected = (user) => {
    let participants = [];
    participants.forEach((participant) => {
      if (participant.key === user.key) participant.is_capitan = false;
      participants.push(participant);
    });
    setParticipants(participants);
    setRefresh(!refresh);
  };

  const changeTextName = (text) => {
    setGroupName(text);
  };

  const changeTextDescription = (text) => {
    setGroupDescription(text);
  };

  const showToast = (text) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const showGroupPhotoHandler = () => {
    Keyboard.dismiss();
    setShowGroupPhoto(true);
  };

  return (
    <ImageBackground
      source={require("../../assets/bk.png")}
      resizeMode="stretch"
      style={GlobalStyles.fullImage}
    >
      <ScrollView>
        {search === "" && (
          <>
            <View style={{ flexDirection: "row", padding: 10 }}>
              <View style={{ width: "40%", alignItems: "center" }}>
                {null !== imgGroup &&
                  "" !== imgGroup ? (
                  <View>
                    <Pressable onPress={showGroupPhotoHandler}>
                      <Image
                        style={GlobalStyles.photoProfileProfilePreviewPhoto}
                        source={{
                          uri: "data:image/png;base64," + imgGroup,
                        }}
                      />
                      <Text style={styles.textPhoto}>Change Group Photo</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={showGroupPhotoHandler}>
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
                    value={groupName}
                    onChangeText={(text) => changeTextName(text)}
                    style={{ color: BlackColor }}
                  />
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <TextInput
                    placeholder="Description for this group..."
                    placeholderTextColor={PlaceholderColor}
                    value={groupDescription}
                    onChangeText={(text) => changeTextDescription(text)}
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
                  onPress={() => pickerSex.current.show()}
                  style={{ flexDirection: "row" }}
                >
                  <Text style={{ paddingRight: 20, fontSize: 15 }}>
                    {groupType != null
                      ? groupType
                      : "Select here"}
                  </Text>
                  <Icon name="chevron-down" size={22} />
                </Pressable>
              </View>
              <ReactNativePickerModule
                pickerRef={pickerSex}
                title={"Group Type"}
                items={["Public", "Private"]}
                onValueChange={(value) => setGroupType(value)}
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
              PARTICIPANTS: {participants.length}
            </Text>
          </View>
          {search === "" && (
            <>
              <View style={[styles.viewActivitiesSelected, styles.margin]}>
                {participants.map((item) =>
                  null !== selectCapitan &&
                    selectCapitan ? (
                    item.is_capitan ? (
                      <Pressable
                        key={item.key}
                        onPress={() => {
                          removeCapitanSelected(item);
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
                              {null !== selectCapitan &&
                                selectCapitan ? (
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
                          selectCapitanHandler(item);
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
                              {null !== selectCapitan &&
                                selectCapitan ? (
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
                        removeParticipant(item);
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
              {participants.length > 0 ? (
                <View style={styles.margin}>
                  {null !== selectCapitan &&
                    selectCapitan == true ? (
                    <Button
                      title="Save captains selected"
                      color={SignUpColor}
                      onPress={() => dissmissSelectedCapitans()}
                    />
                  ) : (
                    <Button
                      title="Select others captains"
                      color={GreenFitrecColor}
                      onPress={() => selectOtherCapitan()}
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
            value={search}
            change={(text) => {
              setSearch(text);
              "" === text && searchUsers();
            }}
            blur={() => searchUsers()}
            clean={() => {
              setSearch("");
              searchUsers();
            }}
          />
        </View>
        <View>
          {friends.length > 0 ? (
            <FlatList
              data={friends}
              keyExtractor={(item, index) => index.toString()}
              extraData={refresh}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    onPress={() => {
                      addParticipant(item);
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
        visible={showGroupPhoto}
        functionCamera={() => addImageGroup("camera")}
        functionGallery={() => addImageGroup("gallery")}
      />
      <Toast toastText={toastText} />
      <LoadingSpinner
        visible={loadingImage || loadingCreate}
      />
    </ImageBackground>
  );
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

export default NewGroup;
