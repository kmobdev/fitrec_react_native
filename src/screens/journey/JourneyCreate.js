import React, { Component, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import {
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
  GreenFitrecColor,
  GlobalModal,
  CarouselStyle,
  GlobalStyles,
  JourneyStyles,
  ToastQuestionStyles,
} from "../../Styles";
import { Pressable } from "react-native";
// This is used because it has a selector and cut in square
import ImagePicker from "react-native-image-crop-picker";
import ImagePickerVideo from "react-native-image-picker";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  actionCreateJourney,
  actionGetJourneyList,
} from "../../redux/actions/JourneyActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import { SearchUsername } from "../../components/chat/SearchUsername";
import { actionGetMyFriends } from "../../redux/actions/ProfileActions";
import FastImage from "react-native-fast-image";
import Geolocation from "@react-native-community/geolocation";
import Video from "react-native-video";
import { actionMessage } from "../../redux/actions/SharedActions";
import {
  Constants,
  OPTIONS_GEOLOCATION_GET_POSITION,
  POST_TYPE_IMAGE,
  POST_TYPE_VIDEO,
} from "../../Constants";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Icon from "react-native-vector-icons/Ionicons";
//import { RNFFmpeg } from 'react-native-ffmpeg';
import { RNFFmpeg } from "ffmpeg-kit-react-native";
import { ShowHead } from "../../components/journey/ShowHead";
import { ShowFooter } from "../../components/journey/ShowFooter";
import moment from "moment/min/moment-with-locales";
``;
let RNFS = require("react-native-fs");

const JourneyCreate = (props) => {
  const oInputRef = useRef();

  const session = useSelector((state) => state.reducerSession);
  const journeyProps = useSelector((state) => state.reducerJourney);
  const myPals = useSelector((state) => state.reducerMyPals);

  const dispatch = useDispatch();

  const [showPhoto, setShowPhoto] = useState(true);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [search, setSearch] = useState("");
  const [player, setPlayer] = useState(null);
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showJourneyList, setShowJourneyList] = useState(true);

  useEffect(() => {
    props.navigation.setParams({ navigateBack: navigateBack });
    actionGetMyFriends(session.account.key);
    if (journeyProps.journeys.length == 0) dispatch(actionGetJourneyList());
  }, []);

  useEffect(() => {
    props.navigation.setParams({ navigateBack: navigateBack });
    actionGetMyFriends(session.account.key);
    if (journeyProps.journeys.length == 0) dispatch(actionGetJourneyList());
    if (
      journeyProps !== journeyProps &&
      null !== journeyProps.statusCreated &&
      journeyProps.statusCreated
    ) {
      navigateBack();
    }
    setLoading(false);
  }, [journeyProps]);

  const navigateBack = () => {
    setShowPhoto(true);
    setFiles([]);
    setText("");
    setLoading(false);
    setPlayer(null);
    setIndex(0);
    setShowJourneyList(true);
    if (null !== oInputRef && undefined !== oInputRef) oInputRef.current.blur();
    props.navigation.navigate("JourneyList");
  };

  const addImage = (sType) => {
    setShowPhoto(false);
    setLoading(true);
    let oOptions = {
      width: 800,
      height: 800,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    switch (sType) {
      case "camera":
        oOptions.mediaType = "image";
        ImagePicker.openCamera(oOptions)
          .then((oFile) => {
            ImagePicker.openCropper({
              path: oFile.path,
              width: 800,
              height: 800,
            })
              .then((oImage) => {
                let oFileItem = {
                    type: "",
                    uri: oImage.path,
                    name: "",
                    realPath: oFile.path,
                    order: 1,
                    mediaType: "image/jpeg",
                    tags: [],
                  },
                  aFiles = [];
                oFileItem.type = POST_TYPE_IMAGE;
                oFileItem.name = "fitrec_photo.jpeg";
                aFiles.push(oFileItem);
                setFiles(aFiles);
                setShowJourneyList(false);
                setShowPhoto(false);
                setLoading(false);
              })
              .catch((oError) => {
                setShowPhoto(true);
                setLoading(false);
              });
          })
          .catch((cancel) => {
            setShowPhoto(true);
            setLoading(false);
          });
        break;
      case "video":
        ImagePickerVideo.launchCamera(
          { mediaType: "video", videoQuality: "high", durationLimit: 60 },
          (oResponse) => {
            if (!oResponse.didCancel && !oResponse.error) {
              let sPath = oResponse.path ? oResponse.path : oResponse.uri,
                sName,
                nIndex,
                aFiles = [];
              nIndex = oResponse.path
                ? oResponse.path.lastIndexOf("/")
                : oResponse.uri.lastIndexOf("/");
              if (nIndex > 0) {
                sName = oResponse.path
                  ? oResponse.path.slice(nIndex + 1)
                  : oResponse.uri.slice(nIndex + 1);
                let sTemporalPath = RNFS.TemporaryDirectoryPath,
                  nIndexName = sName.lastIndexOf(".");
                sName =
                  sName.slice(0, nIndexName) + "_" + Date.now() + "_fitrec.mp4";
                RNFFmpeg.execute(
                  "-i " +
                    sPath +
                    ' -ss 00:00 -to 01:00 -preset superfast -movflags +faststart -vf "scale=480:-2" -b:v 1800k ' +
                    sTemporalPath +
                    sName
                )
                  .then((result) => {
                    let oFileItem = {
                      type: POST_TYPE_VIDEO,
                      uri: sTemporalPath + sName,
                      name: sName,
                      realPath: sTemporalPath + sName,
                      order: 1,
                      mediaType: "video/mp4",
                      tags: [],
                    };
                    aFiles.push(oFileItem);
                    setFiles(aFiles);
                    setShowPhoto(false);
                    setLoading(false);
                    setShowJourneyList(false);
                  })
                  .catch((oError) => {
                    setShowPhoto(true);
                    setLoading(false);
                    dispatch(
                      actionMessage("There was a problem selecting the video")
                    );
                  });
              } else {
                setShowPhoto(true);
                setLoading(false);
                dispatch(
                  actionMessage("There was a problem selecting the video")
                );
              }
            } else {
              if (oResponse.error) {
                dispatch(actionMessage(Constants.MESSAGE_ERROR));
              }
              setShowPhoto(true);
              setLoading(false);
            }
          }
        );
        break;
      case "gallery":
        oOptions.multiple = true;
        oOptions.maxFiles = 4;
        ImagePicker.openPicker(oOptions)
          .then((oFiles) => {
            let aFiles = [],
              nCount = 0,
              nOrder = 1;
            oFiles.forEach((oFile) => {
              let oFileItem = {
                type: "",
                uri: "",
                name: "",
                realPath: "",
                order: nOrder++,
                mediaType: "",
                tags: [],
              };
              if (oFile.mime.indexOf("image") === -1) {
                let sPath = oFile.sourceURL ? oFile.sourceURL : oFile.uri,
                  sName,
                  nIndex;
                nIndex = oFile.path
                  ? oFile.path.lastIndexOf("/")
                  : oFile.uri.lastIndexOf("/");
                sName = oFile.path
                  ? oFile.path.slice(nIndex + 1)
                  : oFile.uri.slice(nIndex + 1);
                let sTemporalPath = RNFS.TemporaryDirectoryPath,
                  nIndexName = sName.lastIndexOf(".");
                sName =
                  sName.slice(0, nIndexName) +
                  "_" +
                  Date.now() +
                  "_" +
                  oFileItem.order +
                  "_fitrec.mp4";
                RNFFmpeg.execute(
                  "-i " +
                    sPath +
                    ' -ss 00:00 -to 01:00 -preset superfast -movflags +faststart -vf "scale=480:-2" -b:v 1800k ' +
                    sTemporalPath +
                    sName
                )
                  .then((result) => {
                    oFileItem.type = POST_TYPE_VIDEO;
                    oFileItem.uri = sTemporalPath + sName;
                    oFileItem.realPath = sTemporalPath + sName;
                    oFileItem.name = sName;
                    oFileItem.mediaType = "video/mp4";
                    aFiles.push(oFileItem);
                    nCount++;
                    if (nCount == oFiles.length) {
                      aFiles.sort((oFileA, oFileB) => {
                        if (oFileA.order > oFileB.order) return 1;
                        return -1;
                      });
                      setFiles(aFiles);
                      setShowPhoto(false);
                      setLoading(false);
                      setShowJourneyList(false);
                    }
                  })
                  .catch((oError) => {
                    dispatch(
                      actionMessage("There was a problem resizing the video")
                    );
                  });
              } else {
                let sName, nIndex;
                nIndex = oFile.path.lastIndexOf("/");
                sName = oFile.path.slice(nIndex + 1);
                oFileItem.type = POST_TYPE_IMAGE;
                oFileItem.uri = oFile.path;
                oFileItem.realPath = oFile.path;
                oFileItem.name = sName;
                oFileItem.mediaType = "image/jpeg";
                nCount++;
                aFiles.push(oFileItem);
              }
              if (nCount == oFiles.length) {
                aFiles.sort((oFileA, oFileB) => {
                  if (oFileA.order > oFileB.order) return 1;
                  return -1;
                });
                setFiles(aFiles);
                setShowPhoto(false);
                setLoading(false);
                setShowJourneyList(false);
              }
            });
          })
          .catch((cancel) => {
            setShowPhoto(true);
            setLoading(false);
          });
        break;
    }
  };

  const createJourney = () => {
    let nLongitude = null,
      nLatitude = null,
      nUserId = session.account.id,
      sUserName = session.account.username,
      sDescription = text,
      aFiles = files;
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          if (position && undefined !== position.coords) {
            nLongitude = position.coords.longitude;
            nLatitude = position.coords.latitude;
          }
          dispatch(
            actionCreateJourney(
              nUserId,
              sUserName,
              sDescription,
              nLatitude,
              nLongitude,
              aFiles
            )
          );
        },
        () => {
          dispatch(
            actionCreateJourney(
              nUserId,
              sUserName,
              sDescription,
              nLatitude,
              nLongitude,
              aFiles
            )
          );
        },
        OPTIONS_GEOLOCATION_GET_POSITION
      );
    } catch (oError) {
      dispatch(
        actionCreateJourney(
          nUserId,
          sUserName,
          sDescription,
          nLatitude,
          nLongitude,
          aFiles
        )
      );
    }
  };

  const handlePress = (evt) => {
    setTop((evt.nativeEvent.locationY * 100) / screenHeight);
    setLeft((evt.nativeEvent.locationX * 100) / screenWidth);
    setTimeout(() => {
      setShowFriends(true);
    }, 200);
  };

  const setTagUser = (lItem) => {
    if (
      files[index].tags.filter((element) => element.key === lItem.key).length >
      0
    ) {
      removeUser(lItem);
    }
    let oTag = {
      x: left,
      y: top,
      name: lItem.name,
      key: lItem.key,
      id_user: lItem.id,
    };
    let aFiles = files;
    aFiles[index].tags.push(oTag);
    setShowFriends(false);
    setFiles(aFiles);
  };

  const dynamicStyle = (data) => {
    let left = (screenWidth * data.x) / 100;
    let top = (screenHeight * data.y) / 100;
    return {
      position: "absolute",
      top: top,
      left: left - 22,
      justifyContent: "center",
    };
  };

  const removeUser = (user) => {
    let aTags = files[index].tags;
    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].key === user.key) {
        aTags.splice(i, 1);
      }
    }
    let aFiles = files;
    let oFileItem = aFiles[index];
    oFileItem.tags = aTags;
    aFiles[index] = oFileItem;
    setFiles(aFiles);
  };

  const resize = (oImage) => {
    setLoading(true);
    ImagePicker.openCropper({
      path: oImage.realPath,
      width: 800,
      height: 800,
    })
      .then((oFile) => {
        let oFileItem = oImage,
          aFiles = [];
        oFileItem.type = POST_TYPE_IMAGE;
        oFileItem.uri = oFile.path;
        aFiles = files;
        aFiles[index] = oFileItem;
        setFiles(aFiles);
        setLoading(false);
      })
      .catch((oError) => {
        setLoading(false);
      });
  };

  const renderItem = (oItem) => {
    return (
      <View style={CarouselStyle.itemContainer}>
        {oItem.type == POST_TYPE_VIDEO ? (
          <Pressable
            activeOpacity={1}
            onPress={() => {
              setMuted(!muted);
            }}>
            <Video
              paused={index != oItem.order - 1}
              muted={muted}
              repeat={true}
              controls={false}
              disableFocus={false}
              key={"video_" + oItem.order.toString()}
              resizeMode={"cover"}
              source={{ uri: oItem.uri, cache: true }}
              style={GlobalStyles.fullImage}
              ref={(ref) => {
                player = ref;
              }}
            />
            {muted && (
              <View style={JourneyStyles.containerMutedIcon}>
                <Icon
                  name="volume-mute"
                  size={24}
                  color={WhiteColor}
                  style={JourneyStyles.mutedIcon}
                />
              </View>
            )}
          </Pressable>
        ) : (
          <View style={GlobalStyles.fullImage}>
            <Pressable
              onPress={() => {
                resize(oItem);
              }}
              style={styles.containerResizeIcon}
              activeOpacity={1}>
              <Icon name="expand-outline" size={24} color={WhiteColor} />
            </Pressable>
            {getImage(oItem)}
            {oItem.tags.map((list) => (
              <View key={list.id} style={dynamicStyle(list)}>
                <View style={styles.tagTriangle}></View>
                <Pressable
                  onPress={() => {
                    removeUser(list);
                  }}
                  style={styles.tagUserView}>
                  <Text style={styles.tagListText}> {list.name} </Text>
                  <View style={styles.removeTagUser}>
                    <Image
                      style={styles.removeIcon}
                      source={require("../../assets/remove.png")}
                    />
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getImage = (oImage) => {
    return (
      <TouchableWithoutFeedback onPress={(evt) => handlePress(evt)}>
        <FastImage
          style={GlobalStyles.fullImage}
          source={{
            uri: oImage.uri,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
    );
  };

  const renderBackground = () => {
    return (
      <>
        {journeyProps.journeys.length > 0 ? (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={journeyProps.journeys}
            renderItem={({ item }) => (
              <>
                {item.images[0].type != POST_TYPE_VIDEO && (
                  <View style={styles.viewPost}>
                    <ShowHead
                      date={moment(
                        item.created_at,
                        "YYYY-MM-DD H:m:s"
                      ).fromNow()}
                      level={item.user.level}
                      username={item.user.username}
                      image={item.user.image}
                      redirectionViewProfile={() =>
                        redirectionViewProfile(item.user.id)
                      }
                      options={() => {
                        setShowToastQuestion(true);
                        setJourney(item);
                      }}
                    />
                    <View style={{ aspectRatio: 1 }}>
                      <FastImage
                        style={ToastQuestionStyles.image}
                        source={{
                          uri: item.image,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                    <ShowFooter
                      isLiked={item.isLiked}
                      likes={item.likes}
                      text={item.description}
                      pressAddLike={() => addUnLike(item.id, true)}
                      existTags={false}
                      pressUnLike={() => addUnLike(item.id, false)}
                      showLikes={() => showLikes(item.id)}
                    />
                  </View>
                )}
              </>
            )}
          />
        ) : (
          <View
            style={{
              flex: 1,
              marginTop: "25%",
              alignContent: "center",
              width: "100%",
              padding: 10,
            }}>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              There are no publications.
            </Text>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              You can be the first to make a Journey post
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: WhiteColor }}>
      {showJourneyList ? (
        <>
          <ToastQuestion
            visible={showPhoto}
            functionVideo={() => addImage("video")}
            functionCamera={() => addImage("camera")}
            functionGallery={() => addImage("gallery")}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            {renderBackground()}
          </View>
        </>
      ) : (
        <ScrollView ref={(oRef) => (oScrollRef = oRef)}>
          <View style={{ flex: 1, marginBottom: 30 }}>
            {showFriends && (
              <View style={[GlobalModal.viewContent, { zIndex: 999 }]}>
                <View style={GlobalModal.viewHead}>
                  <Text style={GlobalModal.headTitle}>Add User Tag</Text>
                  <Pressable
                    style={GlobalModal.buttonClose}
                    onPress={() => setShowFriends(false)}>
                    <Text style={GlobalModal.titleClose}>Close</Text>
                  </Pressable>
                </View>
                <SearchUsername
                  ph="Search for people or username"
                  value={search}
                  change={(text) => setSearch(text)}
                  clean={() => setSearch("")}
                />
                {myPals.myFriends.length > 0 && (
                  <FlatList
                    data={myPals.myFriends.filter(
                      (element) =>
                        element.name.includes(search) ||
                        element.username.includes(search)
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={refresh}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: PlaceholderColor,
                        }}>
                        <Pressable
                          onPress={() => setTagUser(item)}
                          style={{
                            flexDirection: "row",
                            width: "100%",
                            padding: 10,
                          }}>
                          {null === item.image || undefined === item.image ? (
                            <Image
                              style={{ height: 80, width: 80 }}
                              source={require("../../assets/imgProfileReadOnly.png")}
                            />
                          ) : (
                            <FastImage
                              style={{
                                height: 60,
                                width: 60,
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
                            }}>
                            <Text style={styles.textUserReference}>
                              {item.name}
                            </Text>
                            <Text style={{ fontSize: 14 }}>
                              {item.fitnesLevel}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  />
                )}
              </View>
            )}
            <View style={getKeyboardOffsetStyle()}>
              <View style={styles.viewImage}>
                {files.length > 0 ? (
                  <>
                    <Carousel
                      ref={(oRef) => {
                        crousel = oRef;
                      }}
                      data={files}
                      renderItem={(oItem) => renderItem(oItem.item)}
                      sliderWidth={screenWidth}
                      itemWidth={screenWidth}
                      lockScrollWhileSnapping={true}
                      autoplay={false}
                      style={CarouselStyle.carouselContainer}
                      loop={false}
                      onSnapToItem={(index) => {
                        setIndex(index);
                        setRefresh(!refresh);
                      }}
                    />
                    {files[index].type == POST_TYPE_IMAGE && (
                      <View style={styles.footerPhoto}>
                        <Text style={styles.footerContent}>
                          TAP PHOTO to tag people
                        </Text>
                      </View>
                    )}
                    {files.length > 1 && (
                      <Pagination
                        dotsLength={files.length}
                        activeDotIndex={index}
                        containerStyle={[
                          CarouselStyle.paginationContainer,
                          { bottom: -45 },
                        ]}
                        dotStyle={CarouselStyle.paginationActive}
                        inactiveDotStyle={CarouselStyle.paginationInactive}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={1}
                      />
                    )}
                  </>
                ) : (
                  <Image
                    resizeMode="center"
                    style={{ width: 250, height: 250, opacity: 0.1 }}
                    source={require("../../assets/photoIcon.png")}
                  />
                )}
              </View>
              <View style={styles.viewSection}>
                <TextInput
                  style={[styles.textInput, styles.inputTextArea]}
                  multiline={true}
                  numberOfLines={4}
                  textAlign="left"
                  placeholder="Your message"
                  ref={oInputRef}
                  placeholderTextColor={PlaceholderColor}
                  onChangeText={(text) => setText(text)}
                  value={text}
                />
              </View>
              <View style={styles.viewButtons}>
                <Pressable
                  onPress={() => createJourney()}
                  style={styles.button}>
                  <Text style={styles.text}>Create</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <LoadingSpinner visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewImage: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButtons: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "80%",
    alignItems: "center",
    height: 40,
    backgroundColor: SignUpColor,
    borderRadius: 5,
    justifyContent: "center",
  },
  text: {
    color: WhiteColor,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  inputTextArea: {
    paddingStart: 10,
    paddingEnd: 10,
    height: 100,
    marginTop: 10,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  textLabel: {
    position: "absolute",
    left: 10,
    bottom: 10,
    color: PlaceholderColor,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: 10,
    color: "#000000",
  },
  tagTriangle: {
    height: 0,
    width: 0,
    left: 15,
    borderLeftColor: "transparent",
    borderLeftWidth: 7,
    borderRightColor: "transparent",
    borderRightWidth: 7,
    borderBottomColor: "rgba(0,0,0,1.30)",
    borderBottomWidth: 7,
  },
  tagUserView: {
    backgroundColor: "rgba(0,0,0,1.30)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,1.30)",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: "row",
  },
  tagListText: {
    color: "white",
    fontWeight: "800",
  },
  removeTagUser: {
    backgroundColor: "white",
    height: 15,
    width: 15,
    marginLeft: 5,
    borderRadius: 15,
  },
  removeIcon: {
    height: 8,
    width: 8,
    marginTop: 3,
    marginLeft: 3.5,
  },
  footerPhoto: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "black",
    opacity: 0.7,
  },
  footerContent: {
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    color: WhiteColor,
    padding: 10,
    fontSize: 16,
    opacity: 1,
  },
  imageSelected: {
    width: "100%",
    height: "100%",
  },
  containerResizeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 3,
    padding: 3,
    borderRadius: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
  viewPost: {
    borderBottomColor: PlaceholderColor,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});

export default JourneyCreate;
