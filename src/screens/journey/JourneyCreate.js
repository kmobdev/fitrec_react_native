import React, { Component } from "react";
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
  ScrollView
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
import { connect } from "react-redux";
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

let RNFS = require("react-native-fs");

class JourneyCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhoto: true,
      text: "",
      loading: false,
      top: 0,
      left: 0,
      refresh: false,
      showFriends: false,
      search: "",
      player: null,
      files: [],
      index: 0,
      muted: false,
      keyboardOffset: 0,
      showJourneyList: true,
    };

    this.getKeyboardOffsetStyle = this.getKeyboardOffsetStyle.bind(this);

    Keyboard.addListener("keyboardDidShow", ({ endCoordinates: { height } }) =>
      this.keyboardShow(height)
    );
    Keyboard.addListener("keyboardWillShow", ({ endCoordinates: { height } }) =>
      this.keyboardShow(height)
    );
    Keyboard.addListener("keyboardWillHide", () =>
      this.setState({ keyboardOffset: 0 })
    );
    Keyboard.addListener("keyboardDidHide", () =>
      this.setState({ keyboardOffset: 0 })
    );
  }

  keyboardShow = (nHeight) => {
    const { showFriends } = this.state;
    this.setState({ keyboardOffset: nHeight });
    if (
      null !== this.oScrollRef &&
      undefined !== this.oScrollRef &&
      !showFriends
    )
      this.oScrollRef.scrollToEnd({ animated: true });
  };

  getKeyboardOffsetStyle() {
    const { keyboardOffset } = this.state;
    return Platform.select({
      ios: () => ({ paddingBottom: keyboardOffset }),
      android: () => ({}),
    })();
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ navigateBack: this.navigateBack });
    this.props.getFriends(this.props.session.account.key);
    if (this.props.journeyProps.journeys.length == 0)
      this.props.getJourneyList();
  };

  navigateBack = () => {
    this.setState({
      showPhoto: true,
      files: [],
      text: "",
      loading: false,
      player: null,
      index: 0,
      showJourneyList: true,
    });
    if (null !== this.oInputRef && undefined !== this.oInputRef)
      this.oInputRef.blur();
    this.props.navigation.navigate("JourneyList");
  };

  addImage = (sType) => {
    this.setState({
      showPhoto: false,
      loading: true,
    });
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
                this.setState({
                  files: aFiles,
                  showPhoto: false,
                  loading: false,
                  showJourneyList: false,
                });
              })
              .catch((oError) => {
                this.setState({
                  showPhoto: true,
                  loading: false,
                });
              });
          })
          .catch((cancel) => {
            this.setState({
              showPhoto: true,
              loading: false,
            });
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
                    this.setState({
                      files: aFiles,
                      showPhoto: false,
                      loading: false,
                      showJourneyList: false,
                    });
                  })
                  .catch((oError) => {
                    this.setState({
                      showPhoto: true,
                      loading: false,
                    });
                    this.props.message(
                      "There was a problem selecting the video"
                    );
                  });
              } else {
                this.setState({
                  showPhoto: true,
                  loading: false,
                });
                this.props.message("There was a problem selecting the video");
              }
            } else {
              if (oResponse.error) this.props.message(Constants.MESSAGE_ERROR);
              this.setState({
                showPhoto: true,
                loading: false,
              });
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
                      this.setState({
                        files: aFiles,
                        showPhoto: false,
                        loading: false,
                        showJourneyList: false,
                      });
                    }
                  })
                  .catch((oError) => {
                    this.props.message(
                      "There was a problem resizing the video"
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
                this.setState({
                  files: aFiles,
                  showPhoto: false,
                  loading: false,
                  showJourneyList: false,
                });
              }
            });
          })
          .catch((cancel) => {
            this.setState({
              showPhoto: true,
              loading: false,
            });
          });
        break;
    }
  };

  createJourney = () => {
    let nLongitude = null,
      nLatitude = null,
      nUserId = this.props.session.account.id,
      sUserName = this.props.session.account.username,
      sDescription = this.state.text,
      aFiles = this.state.files;
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          if (position && undefined !== position.coords) {
            nLongitude = position.coords.longitude;
            nLatitude = position.coords.latitude;
          }
          this.props.createJourney(
            nUserId,
            sUserName,
            sDescription,
            nLatitude,
            nLongitude,
            aFiles
          );
        },
        () => {
          this.props.createJourney(
            nUserId,
            sUserName,
            sDescription,
            nLatitude,
            nLongitude,
            aFiles
          );
        },
        OPTIONS_GEOLOCATION_GET_POSITION
      );
    } catch (oError) {
      this.props.createJourney(
        nUserId,
        sUserName,
        sDescription,
        nLatitude,
        nLongitude,
        aFiles
      );
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (
      nextProps.journeyProps !== this.props.journeyProps &&
      null !== nextProps.journeyProps.statusCreated &&
      nextProps.journeyProps.statusCreated
    ) {
      this.navigateBack();
    }
    this.setState({
      loading: false,
    });
  };

  handlePress = (evt) => {
    this.setState({
      top: (evt.nativeEvent.locationY * 100) / screenHeight,
      left: (evt.nativeEvent.locationX * 100) / screenWidth,
    });
    setTimeout(() => {
      this.setState({
        showFriends: true,
      });
    }, 200);
  };

  setTagUser = (lItem) => {
    if (
      this.state.files[this.state.index].tags.filter(
        (element) => element.key === lItem.key
      ).length > 0
    ) {
      this.removeUser(lItem);
    }
    let oTag = {
      x: this.state.left,
      y: this.state.top,
      name: lItem.name,
      key: lItem.key,
      id_user: lItem.id,
    };
    let aFiles = this.state.files;
    aFiles[this.state.index].tags.push(oTag);
    this.setState({
      showFriends: false,
      files: aFiles,
    });
  };

  dynamicStyle(data) {
    let left = (screenWidth * data.x) / 100;
    let top = (screenHeight * data.y) / 100;
    return {
      position: "absolute",
      top: top,
      left: left - 22,
      justifyContent: "center",
    };
  }

  removeUser = (user) => {
    let aTags = this.state.files[this.state.index].tags;
    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].key === user.key) {
        aTags.splice(i, 1);
      }
    }
    let aFiles = this.state.files;
    let oFileItem = aFiles[this.state.index];
    oFileItem.tags = aTags;
    aFiles[this.state.index] = oFileItem;
    this.setState({ files: aFiles });
  };

  resize = (oImage) => {
    this.setState({ loading: true });
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
        aFiles = this.state.files;
        aFiles[this.state.index] = oFileItem;
        this.setState({
          aFiles: aFiles,
          loading: false,
        });
      })
      .catch((oError) => {
        this.setState({
          loading: false,
        });
      });
  };

  renderItem = (oItem) => {
    return (
      <View style={CarouselStyle.itemContainer}>
        {oItem.type == POST_TYPE_VIDEO ? (
          <Pressable
            activeOpacity={1}
            onPress={() => {
              this.setState({ muted: !this.state.muted });
            }}
          >
            <Video
              paused={this.state.index != oItem.order - 1}
              muted={this.state.muted}
              repeat={true}
              controls={false}
              disableFocus={false}
              key={"video_" + oItem.order.toString()}
              resizeMode={"cover"}
              source={{ uri: oItem.uri, cache: true }}
              style={GlobalStyles.fullImage}
              ref={(ref) => {
                this.state.player = ref;
              }}
            />
            {this.state.muted && (
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
                this.resize(oItem);
              }}
              style={styles.containerResizeIcon}
              activeOpacity={1}
            >
              <Icon name="expand-outline" size={24} color={WhiteColor} />
            </Pressable>
            {this.getImage(oItem)}
            {oItem.tags.map((list) => (
              <View key={list.id} style={this.dynamicStyle(list)}>
                <View style={styles.tagTriangle}></View>
                <Pressable
                  onPress={() => {
                    this.removeUser(list);
                  }}
                  style={styles.tagUserView}
                >
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

  getImage = (oImage) => {
    return (
      <TouchableWithoutFeedback onPress={(evt) => this.handlePress(evt)}>
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

  render = () => {
    return (
      <View style={{ flex: 1, backgroundColor: WhiteColor }}>
        {this.state.showJourneyList ? (
          <>
            <ToastQuestion
              visible={this.state.showPhoto}
              functionVideo={() => this.addImage("video")}
              functionCamera={() => this.addImage("camera")}
              functionGallery={() => this.addImage("gallery")}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              {this.renderBackground()}
            </View>
          </>
        ) : (
          <ScrollView ref={(oRef) => (this.oScrollRef = oRef)}>
            <View style={{ flex: 1, marginBottom: 30 }}>
              {this.state.showFriends && (
                <View style={[GlobalModal.viewContent, { zIndex: 999 }]}>
                  <View style={GlobalModal.viewHead}>
                    <Text style={GlobalModal.headTitle}>Add User Tag</Text>
                    <Pressable
                      style={GlobalModal.buttonClose}
                      onPress={() => this.setState({ showFriends: false })}
                    >
                      <Text style={GlobalModal.titleClose}>Close</Text>
                    </Pressable>
                  </View>
                  <SearchUsername
                    ph="Search for people or username"
                    value={this.state.search}
                    change={(text) => this.setState({ search: text })}
                    clean={() => this.setState({ search: "" })}
                  />
                  {this.props.myPals.myFriends.length > 0 && (
                    <FlatList
                      data={this.props.myPals.myFriends.filter(
                        (element) =>
                          element.name.includes(this.state.search) ||
                          element.username.includes(this.state.search)
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state.refresh}
                      renderItem={({ item }) => (
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: PlaceholderColor,
                          }}
                        >
                          <Pressable
                            onPress={() => this.setTagUser(item)}
                            style={{
                              flexDirection: "row",
                              width: "100%",
                              padding: 10,
                            }}
                          >
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
                              }}
                            >
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
              <View style={this.getKeyboardOffsetStyle()}>
                <View style={styles.viewImage}>
                  {this.state.files.length > 0 ? (
                    <>
                      <Carousel
                        ref={(oRef) => {
                          this.crousel = oRef;
                        }}
                        data={this.state.files}
                        renderItem={(oItem) => this.renderItem(oItem.item)}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        lockScrollWhileSnapping={true}
                        autoplay={false}
                        style={CarouselStyle.carouselContainer}
                        loop={false}
                        onSnapToItem={(index) => {
                          this.setState({
                            index: index,
                            refresh: !this.state.refresh,
                          });
                        }}
                      />
                      {this.state.files[this.state.index].type ==
                        POST_TYPE_IMAGE && (
                          <View style={styles.footerPhoto}>
                            <Text style={styles.footerContent}>
                              TAP PHOTO to tag people
                            </Text>
                          </View>
                        )}
                      {this.state.files.length > 1 && (
                        <Pagination
                          dotsLength={this.state.files.length}
                          activeDotIndex={this.state.index}
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
                    ref={(oRef) => (this.oInputRef = oRef)}
                    placeholderTextColor={PlaceholderColor}
                    onChangeText={(text) => this.setState({ text: text })}
                    value={this.state.text}
                  />
                </View>
                <View style={styles.viewButtons}>
                  <Pressable
                    onPress={() => this.createJourney()}
                    style={styles.button}
                  >
                    <Text style={styles.text}>Create</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        <LoadingSpinner visible={this.state.loading} />
      </View>
    );
  };

  renderBackground = () => {
    return (
      <>
        {this.props.journeyProps.journeys.length > 0 ? (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.props.journeyProps.journeys}
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
                        this.redirectionViewProfile(item.user.id)
                      }
                      options={() => {
                        this.setState({
                          showToastQuestion: true,
                          journey: item,
                        });
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
                      pressAddLike={() => this.addUnLike(item.id, true)}
                      existTags={false}
                      pressUnLike={() => this.addUnLike(item.id, false)}
                      showLikes={() => this.showLikes(item.id)}
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
            }}
          >
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
}

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

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  journeyProps: state.reducerJourney,
  myPals: state.reducerMyPals,
});

const mapDispatchToProps = (dispatch) => ({
  createJourney: (
    nUserId,
    sUsername,
    sDescription,
    nLatitude,
    nLongitude,
    oVideo
  ) => {
    dispatch(
      actionCreateJourney(
        nUserId,
        sUsername,
        sDescription,
        nLatitude,
        nLongitude,
        oVideo
      )
    );
  },
  getFriends: (sUserKey) => {
    actionGetMyFriends(sUserKey);
  },
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  getJourneyList: () => {
    dispatch(actionGetJourneyList());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JourneyCreate);
