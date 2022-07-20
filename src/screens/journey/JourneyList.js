import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TextInput,
  Platform,
} from "react-native";
import {
  GreenFitrecColor,
  PlaceholderColor,
  ToastQuestionGenericStyles,
  WhiteColor,
  GlobalModal,
  SignUpColor,
  ToastQuestionStyles,
  CarouselStyle,
  GlobalStyles,
  JourneyStyles,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { connect } from "react-redux";
import {
  actionGetJourneyList,
  actionAddUnLike,
  actionGetLikes,
  actionDeleteJourney,
  actionEditJourney,
} from "../../redux/actions/JourneyActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { ShowFooter } from "../../components/journey/ShowFooter";
import { ShowHead } from "../../components/journey/ShowHead";
import ShowLikes from "../../components/journey/ShowLikes";
import FastImage from "react-native-fast-image";
import { ListPeople } from "../../components/shared/ListPeople";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import ImagePicker from "react-native-image-crop-picker";
import ImagePickerVideo from "react-native-image-picker";
import ModalReport from "../../components/report/ModalReport";
import {
  MESSAGE_ERROR,
  POST_TYPE_IMAGE,
  POST_TYPE_VIDEO,
  REPORT_JOURNEY_TYPE,
} from "../../Constants";
import { actionMessage } from "../../redux/actions/SharedActions";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import moment from "moment/min/moment-with-locales";
import Stories from "../../components/stories/Stories";
import {
  actionGetStories,
  actionPreviewStory,
  actionViewStoryAction,
} from "../../redux/actions/StoryActions";
import Video from "react-native-video";
import Home from "../home/Home";
import Swiper from "react-native-swiper";
import Carousel, { Pagination } from "react-native-snap-carousel";
//import { RNFFmpeg } from 'react-native-ffmpeg';
import { RNFFmpeg } from "ffmpeg-kit-react-native";
import { SafeAreaView } from "react-native";
import { actionCleanNavigation } from "../../redux/actions/NavigationActions";

let RNFS = require("react-native-fs");

class JourneyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      showToastQuestion: false,
      refreshing: false,
      loading: false,
      showLikes: false,
      statusGetLikesResponse: false,
      journey: null,
      showQuestionDeleteJourney: false,
      showToastEdit: false,
      newDescription: "",
      changePhoto: false,
      newImage: null,
      showQuestionChangeImage: false,
      showReport: false,
      newStory: false,
      muted: true,
      viewMeStory: false,
      index: 1,
    };
  }

  componentDidMount = () => {
    this.props.swiperHome === undefined &&
      this.props.navigation.setParams({ index: 1 });
    this.getJourneyList();
    this.setState({ muted: true });
  };

  getJourneyList = async () => {
    this.props.getJourneyList();
    this.props.getStories();
  };

  onRefresh = async () => {
    await this.setState({
      refreshing: true,
      muted: true,
    });
    this.getJourneyList();
  };

  componentWillReceiveProps = async (nextProps) => {
    if (this.props.journeyProps.journeys.length > 0)
      await this.setState({
        loadingListJourney: false,
      });
    if (nextProps.journeyProps.bNavigationJourney) {
      this.props.cleanNavigation();
      if (this.state.index !== 1) {
        this.oSwiperRef.scrollTo(1, false);
        this.setState({ index: 1 });
      }
    }
    await this.setState({
      loading: false,
      refreshing: false,
      refresh: !this.state.refresh,
    });
  };

  addUnLike = async (oJourney, bAddLike) => {
    let oDataNotification =
      this.props.session.account.id !== oJourney.user.id
        ? {
          sHeader: this.props.session.account.username,
          sDescription: `${this.props.session.account.name} likes your post`,
          sPushId: oJourney.user.id_push,
        }
        : null;
    this.props.addLike(oJourney.id, bAddLike, oDataNotification);
  };

  redirectionViewProfile = (nIdFitrec) => {
    this.props.getProfile(nIdFitrec);
    this.props.navigation.navigate("ProfileViewDetails");
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

  showLikes = async (nJourneyId) => {
    this.props.showLikes(nJourneyId);
    await this.setState({
      showLikes: true,
    });
  };

  deleteJourney = async () => {
    await this.setState({
      loading: true,
      showQuestionDeleteJourney: false,
    });
    this.props.deleteJourney(
      this.state.journey.id,
      this.props.session.account.id
    );
  };

  redirectionViewProfile = (nIdFitrec) => {
    this.props.getProfile(nIdFitrec);
    if (this.props.closeModal) {
      setTimeout(() => {
        this.props.close();
        this.props.closeModal();
      }, 1000);
    }
    this.props.navigation.navigate("ProfileViewDetails");
  };

  changeDescription = () => {
    this.props.editJourney(
      this.state.journey.id,
      this.props.session.account.id,
      this.state.newDescription,
      null
    );
    this.setState({
      changeDescription: false,
      journey: null,
    });
  };

  addImage = async (sType) => {
    await this.setState({
      showPhoto: false,
      loading: true,
    });
    let oOptions = {
      cropping: true,
      width: 800,
      height: 800,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    if (this.state.newStory) {
      oOptions.cropping = false;
      oOptions.duration = 5000;
    } else oOptions.mediaType = "image";
    switch (sType) {
      case "camera":
        ImagePicker.openCamera(oOptions).then(
          async (image) => {
            if (this.state.newStory) {
              await this.setState({
                newStory: false,
                loading: false,
              });
              if (image.mime.indexOf("image") === -1) {
                this.props.previewStory(
                  POST_TYPE_VIDEO,
                  image.path,
                  image.filename
                );
              } else {
                ImagePicker.openCropper({
                  path: image.path,
                  width: 800,
                  height: 1024,
                  includeBase64: true,
                })
                  .then((oImage) => {
                    this.props.previewStory(
                      POST_TYPE_IMAGE,
                      `data:image/jpg;base64,` + oImage.data
                    );
                  })
                  .catch((oError) => {
                    this.setState({
                      loading: false,
                      changePhoto: false,
                      journey: null,
                      newStory: false,
                    });
                  });
              }
            } else
              await this.setState({
                newImage: image.data,
                loading: false,
                showQuestionChangeImage: true,
                changePhoto: false,
              });
          },
          async (cancel) => {
            await this.setState({
              loading: false,
              changePhoto: false,
              journey: null,
              newStory: false,
            });
          }
        );
        break;
      case "video":
        ImagePickerVideo.launchCamera(
          { mediaType: "video", videoQuality: "high", durationLimit: 30 },
          async (oResponse) => {
            if (!oResponse.didCancel && !oResponse.error) {
              let sPath = oResponse.path ? oResponse.path : oResponse.uri,
                sName,
                nIndex;
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
                  ' -ss 00:00 -to 00:30 -preset superfast -movflags +faststart -vf "scale=480:-2" -b:v 1800k ' +
                  sTemporalPath +
                  sName
                )
                  .then(async (result) => {
                    await this.setState({
                      newStory: false,
                      loading: false,
                    });
                    this.props.previewStory(
                      POST_TYPE_VIDEO,
                      sTemporalPath + sName,
                      sName
                    );
                  })
                  .catch((oError) => {
                    this.props.message(
                      "There was a problem resizing the video"
                    );
                  });
              } else {
                await this.setState({
                  loading: false,
                  changePhoto: false,
                  journey: null,
                  newStory: false,
                });
                this.props.message("There was a problem selecting the video");
              }
            } else {
              if (oResponse.error) this.showToast(MESSAGE_ERROR);
              await this.setState({
                loading: false,
                changePhoto: false,
                journey: null,
                newStory: false,
              });
            }
          }
        );
        break;
      case "gallery":
        ImagePicker.openPicker(oOptions).then(
          async (image) => {
            if (this.state.newStory) {
              if (image.mime.indexOf("video") !== -1) {
                let sName = "",
                  sPath = image.sourceURL ? image.sourceURL : image.path,
                  nIndex = image.path.lastIndexOf("/"),
                  sTemporalPath = RNFS.TemporaryDirectoryPath;
                if (Platform.OS == "ios") sName = image.filename;
                else sName = image.path.slice(nIndex + 1);
                let nIndexName = sName.lastIndexOf(".");
                sName =
                  sName.slice(0, nIndexName) + "_" + Date.now() + "_fitrec.mp4";
                RNFFmpeg.execute(
                  "-i " +
                  sPath +
                  ' -ss 00:00 -to 00:30 -preset superfast -movflags +faststart -vf "scale=480:-2" -b:v 1800k ' +
                  sTemporalPath +
                  sName
                )
                  .then(async (result) => {
                    await this.setState({
                      newStory: false,
                      loading: false,
                    });
                    if (Platform.OS == "ios") {
                      this.props.previewStory(
                        POST_TYPE_VIDEO,
                        sTemporalPath + sName,
                        sName
                      );
                    } else {
                      if (nIndex > 0) {
                        this.props.previewStory(
                          POST_TYPE_VIDEO,
                          sTemporalPath + sName,
                          sName
                        );
                      } else {
                        this.props.message(
                          "There was a problem selecting the video"
                        );
                        await this.setState({
                          loading: false,
                          changePhoto: false,
                          journey: null,
                          newStory: false,
                        });
                      }
                    }
                  })
                  .catch((oError) => {
                    this.props.message(
                      "There was a problem resizing the video"
                    );
                  });
              } else if (image.mime.indexOf("image") !== -1) {
                await this.setState({
                  newStory: false,
                  loading: false,
                });
                ImagePicker.openCropper({
                  path: image.path,
                  width: 800,
                  height: 1024,
                  includeBase64: true,
                })
                  .then((oImage) => {
                    this.props.previewStory(
                      POST_TYPE_IMAGE,
                      `data:image/jpg;base64,` + oImage.data
                    );
                  })
                  .catch((oError) => {
                    this.setState({
                      loading: false,
                      changePhoto: false,
                      journey: null,
                      newStory: false,
                    });
                  });
              } else this.props.message("Unsupported file type");
            } else
              await this.setState({
                newImage: image.data,
                loading: false,
                showQuestionChangeImage: true,
                changePhoto: false,
              });
          },
          async (cancel) => {
            await this.setState({
              loading: false,
              changePhoto: false,
              journey: null,
              newStory: false,
            });
          }
        );
        break;
    }
  };

  changePhoto = () => {
    this.props.editJourney(
      this.state.journey.id,
      this.props.session.account.id,
      this.state.journey.description,
      this.state.newImage
    );
    this.setState({
      changeDescription: false,
      journey: null,
      showQuestionChangeImage: false,
      newImage: null,
      journey: null,
    });
  };

  swipe = (nIndex) => {
    this.props.navigation.setParams({
      index: nIndex,
    });
    this.setState({ index: nIndex });
  };

  actionChangePhoto = () => {
    if (this.state.journey.likes < 1)
      this.setState({ changePhoto: true, showToastEdit: false });
    else this.props.message("You cannot change a photo that has likes");
  };

  handleScrollView = (event) => {
    let nScrollY = event.nativeEvent.contentOffset.y,
      nIndex = Math.round(nScrollY / (612 - 60));
    if (nIndex > 0 && this.props.journeyProps.journeys[nIndex] !== undefined)
      this.props.journeyProps.journeys[nIndex - 1].paused = true;
    if (
      nIndex + 1 < this.props.journeyProps.journeys.length - 1 &&
      this.props.journeyProps.journeys[nIndex + 1] !== undefined
    )
      this.props.journeyProps.journeys[nIndex + 1].paused = true;
    if (this.props.journeyProps.journeys[nIndex] !== undefined)
      this.props.journeyProps.journeys[nIndex].paused = false;
    this.setState({
      refresh: !this.state.refresh,
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.swiperHome === undefined ? (
          <Swiper
            loop={false}
            showsPagination={false}
            onIndexChanged={(nIndex) => this.swipe(nIndex)}
            scrollEnabled={true}
            horizontal={true}
            index={1}
            ref={(oRef) => (this.oSwiperRef = oRef)}
          >
            <View style={styles.contentSwipe}>
              <Home swiperHome={true} navigation={this.props.navigation} />
            </View>
            <View style={styles.contentSwipe}>{this.renderContent()}</View>
          </Swiper>
        ) : (
          this.renderContent()
        )}
      </View>
    );
  }

  renderItem = (oItem, nIndex, bPaused) => {
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
              paused={
                this.props.swiperHome === undefined
                  ? this.state.index === 1
                    ? bPaused == undefined
                      ? true
                      : bPaused
                    : true
                  : this.props.indexHome === 1 ||
                    this.props.indexHome === undefined
                    ? bPaused == undefined
                      ? true
                      : bPaused
                    : true
              }
              muted={
                this.props.swiperHome !== undefined
                  ? this.state.muted
                  : this.state.muted || this.props.indexHome === 1
              }
              repeat={true}
              controls={false}
              disableFocus={false}
              key={"video_" + oItem.id.toString() + oItem.id_user}
              resizeMode={"cover"}
              source={{ uri: oItem.image }}
              style={GlobalStyles.fullImage}
              ref={(ref) => {
                this.state.player = ref;
              }}
              onLoadStart={async () => {
                await this.setState({
                  muted: !this.state.muted,
                });
                await this.setState({
                  muted: !this.state.muted,
                });
              }}
            />
            {this.state.muted && !bPaused && (
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
        ) : oItem.tags.length > 0 ? (
          <>
            <Pressable
              onPress={() => {
                oItem.showTag = !oItem.showTag;
                this.setState({ refresh: !this.state.refresh });
              }}
              activeOpacity={1}
            >
              {this.getImage(oItem)}
            </Pressable>
            {oItem.showTag &&
              oItem.tags.map((oTag) => (
                <Pressable
                  onPress={() => this.redirectionViewProfile(oTag.id_user)}
                  key={oTag.id.toString()}
                  style={this.dynamicStyle(oTag)}
                >
                  <View style={styles.tagTriangle}></View>
                  <View style={styles.tagUserView}>
                    <Text style={styles.tagListText}>{oTag.name}</Text>
                  </View>
                </Pressable>
              ))}
          </>
        ) : (
          this.getImage(oItem)
        )}
      </View>
    );
  };

  getImage = (oItem) => {
    return (
      <FastImage
        style={ToastQuestionStyles.image}
        source={{
          uri: oItem.image,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  renderContent = () => {
    return (
      <View style={{ backgroundColor: WhiteColor, flex: 1 }}>
        <ScrollView
          scrollEventThrottle={1}
          onScroll={this.handleScrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          <View
            style={{ borderBottomColor: "#A6A7A8", borderBottomWidth: 0.5 }}
          >
            <Stories
              new={() => this.setState({ newStory: true })}
              options={() => this.setState({ viewMyStory: true })}
            />
          </View>
          {this.props.journeyProps.journeys.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={this.props.journeyProps.journeys}
              extraData={this.state.refresh}
              scrollEnabled={false}
              refreshing={this.state.refresh}
              getItemLayout={(data, index) => {
                if (index === -1) return { index, length: 0, offset: 0 };
                data[index].scroll = 540 * index + 60;
                return {
                  index: index,
                  length: 540,
                  offset: 540 * index + 60,
                };
              }}
              renderItem={({ item }) => (
                <View style={styles.viewPost}>
                  <ShowHead
                    date={moment(item.created_at, "YYYY-MM-DD H:m:s").fromNow()}
                    level={item.user.level}
                    username={item.user.username}
                    image={item.user.image}
                    redirectionViewProfile={() =>
                      this.redirectionViewProfile(item.user.id)
                    }
                    options={() => {
                      this.setState({ showToastQuestion: true, journey: item });
                    }}
                  />
                  <View style={{ aspectRatio: 1 }}>
                    <SafeAreaView>
                      <Carousel
                        ref={(oRef) => {
                          this.crousel = oRef;
                        }}
                        data={item.images}
                        renderItem={(oItem) =>
                          this.renderItem(oItem.item, oItem.index, item.paused)
                        }
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        lockScrollWhileSnapping={true}
                        autoplay={false}
                        style={CarouselStyle.carouselContainer}
                        loop={false}
                        onSnapToItem={(index) => {
                          item.nIndex = index;
                          this.setState({ refresh: !this.state.refresh });
                        }}
                      />
                      {item.images.length > 1 && (
                        <Pagination
                          dotsLength={item.images.length}
                          activeDotIndex={item.nIndex}
                          containerStyle={CarouselStyle.paginationContainer}
                          dotStyle={CarouselStyle.paginationActive}
                          inactiveDotStyle={CarouselStyle.paginationInactive}
                          inactiveDotOpacity={0.4}
                          inactiveDotScale={1}
                        />
                      )}
                    </SafeAreaView>
                  </View>
                  {item.images[item.nIndex] && (
                    <ShowFooter
                      isLiked={item.isLiked}
                      likes={item.likes}
                      text={item.description}
                      pressAddLike={() => this.addUnLike(item, true)}
                      existTags={item.images[item.nIndex].tags.length > 0}
                      showTags={() =>
                        this.setState({
                          showTagsList: true,
                          tags: item.images[item.nIndex].tags,
                        })
                      }
                      pressUnLike={() => this.addUnLike(item, false)}
                      showLikes={() => this.showLikes(item.id)}
                    />
                  )}
                </View>
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
        </ScrollView>
        <ToastQuestionGeneric
          maxWidth={180}
          visible={this.state.showToastQuestion}
          options={
            <View style={{ padding: 10 }}>
              {null !== this.state.journey &&
                this.state.journey.user.id !==
                this.props.session.account.id && (
                  <Pressable
                    onPress={() => {
                      this.setState({
                        showReport: true,
                        showToastQuestion: false,
                      });
                    }}
                  >
                    <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                      <Icon name="close-circle" size={22} color={WhiteColor} />
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Report Post
                      </Text>
                    </View>
                  </Pressable>
                )}
              {null !== this.state.journey &&
                this.state.journey.user.id ===
                this.props.session.account.id && (
                  <Pressable
                    onPress={() =>
                      this.setState({
                        showToastQuestion: false,
                        showToastEdit: true,
                      })
                    }
                  >
                    <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                      <Icon
                        name="create-outline"
                        size={22}
                        color={WhiteColor}
                      />
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Edit
                      </Text>
                    </View>
                  </Pressable>
                )}
              {null !== this.state.journey &&
                this.state.journey.user.id ===
                this.props.session.account.id && (
                  <Pressable
                    onPress={() =>
                      this.setState({
                        showToastQuestion: false,
                        showQuestionDeleteJourney: true,
                      })
                    }
                  >
                    <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                      <Icon name="trash-outline" size={22} color={WhiteColor} />
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Delete
                      </Text>
                    </View>
                  </Pressable>
                )}
              <Pressable
                onPress={() =>
                  this.setState({ showToastQuestion: false, journey: null })
                }
              >
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Icon name="md-close" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Close
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        />
        <ToastQuestionGeneric
          visible={this.state.showToastEdit}
          options={
            <View style={{ padding: 10 }}>
              <Pressable
                onPress={() =>
                  this.setState({
                    changeDescription: true,
                    showToastEdit: false,
                    newDescription: this.state.journey.description,
                  })
                }
              >
                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                  <Icon name="create-outline" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Description
                  </Text>
                </View>
              </Pressable>
              {/*
                        // TODO: Commented since now with multiple images you should not be able to change - Leandro Curbelo
                            <Pressable onPress={() => this.actionChangePhoto()}>
                                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                                    <Icon name="images" size={22} color={WhiteColor} />
                                    <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                                        New Image
                                    </Text>
                                </View>
                            </Pressable> 
                        */}
              <Pressable
                onPress={() =>
                  this.setState({
                    showToastQuestion: true,
                    showToastEdit: false,
                  })
                }
              >
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Icon name="arrow-back" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Back
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        />
        {this.state.changeDescription && (
          <View style={ToastQuestionGenericStyles.contentToast}>
            <View style={ToastQuestionGenericStyles.viewToast}>
              <TextInput
                numberOfLines={4}
                multiline={true}
                style={ToastQuestionGenericStyles.inputLarge}
                value={this.state.newDescription}
                onChangeText={(text) => this.setState({ newDescription: text })}
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() =>
                      this.setState({
                        showToastEdit: true,
                        changeDescription: false,
                      })
                    }
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => this.changeDescription()}
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
        {this.state.newStory ? (
          <ToastQuestion
            visible={this.state.changePhoto || this.state.newStory}
            close={() => this.setState({ changePhoto: false, newStory: false })}
            functionCamera={() => this.addImage("camera")}
            functionGallery={() => this.addImage("gallery")}
            functionVideo={() => this.addImage("video")}
          />
        ) : (
          <ToastQuestion
            visible={this.state.changePhoto || this.state.newStory}
            close={() => this.setState({ changePhoto: false, newStory: false })}
            functionCamera={() => this.addImage("camera")}
            functionGallery={() => this.addImage("gallery")}
          />
        )}
        {null !== this.state.journey && (
          <ToastQuestionGeneric
            visible={this.state.showQuestionChangeImage}
            titleBig="Change Photo Journey"
            maxWidth={250}
            title="Are you sure you want to change journey photo?"
            options={
              <View>
                <View style={ToastQuestionStyles.container}>
                  <View style={ToastQuestionStyles.containerImage}>
                    <FastImage
                      style={ToastQuestionStyles.image}
                      source={{
                        uri: this.state.journey.image,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  <View style={ToastQuestionStyles.iconContainer}>
                    <Icon
                      name="arrow-forward-circle-outline"
                      color={SignUpColor}
                      size={34}
                    />
                  </View>
                  <View style={ToastQuestionStyles.containerImage}>
                    <Image
                      style={ToastQuestionStyles.image}
                      resizeMode="cover"
                      source={{
                        uri: `data:image/jpg;base64,` + this.state.newImage,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={[ToastQuestionStyles.viewButtons, { width: "100%" }]}
                >
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonCancel}
                      onPress={() =>
                        this.setState({
                          showQuestionChangeImage: false,
                          newImage: null,
                          journey: null,
                        })
                      }
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonConfirm}
                      onPress={() => this.changePhoto()}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Confirm
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            }
          />
        )}
        <LoadingSpinner visible={this.state.loading} />
        <ShowLikes
          visible={this.state.showLikes}
          close={() => this.setState({ showLikes: false })}
          navigation={this.props.navigation}
          redirectionViewProfile={(nIdFitrec) =>
            this.redirectionViewProfile(nIdFitrec)
          }
        />
        {this.state.showTagsList && (
          <View style={GlobalModal.viewContent}>
            <View style={GlobalModal.viewHead}>
              <Text style={GlobalModal.headTitle}>Tags in this Photo</Text>
              <Pressable
                style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
                onPress={() =>
                  this.setState({ showTagsList: false, tags: null })
                }
              >
                <Icon name="close" color={SignUpColor} size={22} />
                <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                  Close
                </Text>
              </Pressable>
            </View>
            <ListPeople
              people={this.state.tags}
              refresh={this.state.refresh}
              action={(item) => this.redirectionViewProfile(item.id_user)}
              grid={false}
            />
          </View>
        )}
        <ToastQuestionGeneric
          visible={this.state.showQuestionDeleteJourney}
          titleBig="Delete journey"
          title="Are you sure you want to delete journey?"
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() =>
                  this.setState({ showQuestionDeleteJourney: false })
                }
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.deleteJourney()}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: SignUpColor },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Ok</Text>
              </Pressable>
            </View>
          }
        />
        {this.state.showReport && this.state.journey !== null && (
          <ModalReport
            visible={this.state.showReport}
            close={() => this.setState({ showReport: false })}
            send={() => this.setState({ showReport: false })}
            type={REPORT_JOURNEY_TYPE}
            id={this.state.journey.id}
          />
        )}
        <ToastQuestionGeneric
          visible={this.state.viewMyStory}
          options={
            <View style={{ padding: 10 }}>
              <Pressable
                onPress={() => {
                  this.props.viewMeStory();
                  this.setState({ viewMyStory: false });
                }}
              >
                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    View
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() =>
                  this.setState({ viewMyStory: false, newStory: true })
                }
              >
                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Upload
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => this.setState({ viewMyStory: false })}
              >
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Close
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  viewPost: {
    borderBottomColor: PlaceholderColor,
    borderBottomWidth: 1,
    paddingBottom: 10,
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
    padding: 3,
  },
  containerTagIcon: {
    backgroundColor: WhiteColor,
    borderRadius: 100,
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    left: 15,
    height: 30,
    width: 30,
  },
  contentSwipe: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  journeyProps: state.reducerJourney,
});

const mapDispatchToProps = (dispatch) => ({
  getJourneyList: () => {
    dispatch(actionGetJourneyList());
  },
  addLike: (nJourneyId, bAddLike, aDataNotification) => {
    dispatch(actionAddUnLike(nJourneyId, bAddLike, aDataNotification));
  },
  getProfile: (nUserId) => {
    dispatch(actionGetProfile(nUserId, true));
  },
  showLikes: (nJourneyId) => {
    dispatch(actionGetLikes(nJourneyId));
  },
  deleteJourney: (nJourneyId, nUserId) => {
    dispatch(actionDeleteJourney(nJourneyId, nUserId));
  },
  editJourney: (nJourneyId, nUserId, sDescription, sImage) => {
    dispatch(actionEditJourney(nJourneyId, nUserId, sDescription, sImage));
  },
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  getStories: () => {
    dispatch(actionGetStories());
  },
  previewStory: (nType, sImage, sVideoName = null) => {
    dispatch(actionPreviewStory(nType, sImage, sVideoName));
  },
  viewMeStory: () => {
    dispatch(actionViewStoryAction());
  },
  cleanNavigation: () => {
    dispatch(actionCleanNavigation());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JourneyList);
