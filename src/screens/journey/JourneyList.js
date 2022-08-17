import React, { Component, useEffect, useRef, useState } from "react";
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
import { connect, useDispatch, useSelector } from "react-redux";
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

const JourneyList = (props) => {

  const oSwiperRef = useRef();

  const session = useSelector((state) => state.reducerSession);
  const journeyProps = useSelector((state) => state.reducerJourney);

  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(false);
  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [statusGetLikesResponse, setStatusGetLikesResponse] = useState(false);
  const [journey, setJourney] = useState(null);
  const [showQuestionDeleteJourney, setShowQuestionDeleteJourney] = useState(false);
  const [showToastEdit, setShowToastEdit] = useState(false);
  const [changePhoto, setChangePhoto] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [showQuestionChangeImage, setShowQuestionChangeImage] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [newStory, setNewStory] = useState(false);
  const [muted, setMuted] = useState(true);
  const [viewMyStory, setViewMyStory] = useState(false);
  const [showTagsList, setShowTagsList] = useState(false);
  const [index, setIndex] = useState(1);
  const [newDescription, setNewDescription] = useState("");
  const [changeDescription, setChangeDescription] = useState(false);

  useEffect(() => {
    props.swiperHome === undefined &&
      props.navigation.setParams({ index: 1 });
    getJourneyList();
    setMuted(true);
  }, []);

  useEffect(() => {
    if (journeyProps.bNavigationJourney) {
      dispatch(actionCleanNavigation());
      if (index !== 1) {
        oSwiperRef.scrollTo(1, false);
        setIndex(1);
      }
    }
    setLoading(false);
    setRefreshing(false);
    setRefresh(!refresh);
  }, [journeyProps]);

  const getJourneyList = () => {
    dispatch(actionGetJourneyList());
    dispatch(actionGetStories());
  };

  const onRefresh = () => {
    setRefreshing(true);
    setMuted(true);
    getJourneyList();
  };

  const addUnLike = (oJourney, bAddLike) => {
    let oDataNotification =
      session.account.id !== oJourney.user.id
        ? {
          sHeader: session.account.username,
          sDescription: `${session.account.name} likes your post`,
          sPushId: oJourney.user.id_push,
        }
        : null;
    dispatch(actionAddUnLike(oJourney.id, bAddLike, oDataNotification));
  };

  const redirectionViewProfile = (idFitrec) => {
    dispatch(actionGetProfile(idFitrec, true));
    props.navigation.navigate("ProfileViewDetails");
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
  }

  const showLikesHandler = (nJourneyId) => {
    dispatch(actionGetLikes(nJourneyId));
    setShowLikes(true);
  };

  const deleteJourney = () => {
    setLoading(true);
    setShowQuestionDeleteJourney(false);
    dispatch(actionDeleteJourney(journey.id, session.account.id));
  };

  const redirectionViewProfileHandler = (idFitrec) => {
    dispatch(actionGetProfile(idFitrec, true));
    if (props.closeModal) {
      setTimeout(() => {
        props.close();
        props.closeModal();
      }, 1000);
    }
    props.navigation.navigate("ProfileViewDetails");
  };

  const changeDescriptionHandler = () => {
    dispatch(
      actionEditJourney(
        journey.id,
        session.account.id,
        newDescription,
        null
      )
    );
    setChangeDescription(false);
    setJourney(null);
  };

  const addImage = (sType) => {
    setShowPhoto(false);
    setLoading(true);
    let oOptions = {
      cropping: true,
      width: 800,
      height: 800,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    if (newStory) {
      oOptions.cropping = false;
      oOptions.duration = 5000;
    } else oOptions.mediaType = "image";
    switch (sType) {
      case "camera":
        ImagePicker.openCamera(oOptions).then(
          (image) => {
            if (newStory) {
              setShowPhoto(false);
              setLoading(false);
              if (image.mime.indexOf("image") === -1) {
                dispatch(
                  actionPreviewStory(
                    POST_TYPE_VIDEO,
                    image.path,
                    image.filename
                  )
                );
              } else {
                ImagePicker.openCropper({
                  path: image.path,
                  width: 800,
                  height: 1024,
                  includeBase64: true,
                })
                  .then((oImage) => {
                    dispatch(
                      actionPreviewStory(
                        POST_TYPE_IMAGE,
                        `data:image/jpg;base64,` + oImage.data
                      )
                    );
                  })
                  .catch((oError) => {
                    setLoading(false);
                    setChangePhoto(false);
                    setJourney(null);
                    setNewStory(false);
                  });
              }
            } else {
              setNewImage(image.data);
              setLoading(false);
              setShowQuestionChangeImage(true);
              setChangePhoto(false);
            }
          },
          (cancel) => {
            setLoading(false);
            setChangePhoto(false);
            setJourney(null);
            setNewStory(false);
          }
        );
        break;
      case "video":
        ImagePickerVideo.launchCamera(
          { mediaType: "video", videoQuality: "high", durationLimit: 30 },
          (oResponse) => {
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
                  .then((result) => {
                    setNewStory(false);
                    setLoading(false);
                    dispatch(
                      actionPreviewStory(
                        POST_TYPE_VIDEO,
                        sTemporalPath + sName,
                        sName
                      )
                    );
                  })
                  .catch((oError) => {
                    dispatch(actionMessage("There was a problem resizing the video"));
                  });
              } else {
                setLoading(false);
                setChangePhoto(false);
                setJourney(null);
                setNewStory(false);
                dispatch(actionMessage("There was a problem selecting the video"));
              }
            } else {
              if (oResponse.error) {
                showToast(MESSAGE_ERROR)
              }
              setLoading(false);
              setChangePhoto(false);
              setJourney(null);
              setNewStory(false);
            }
          }
        );
        break;
      case "gallery":
        ImagePicker.openPicker(oOptions).then(
          (image) => {
            if (newStory) {
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
                  .then((result) => {
                    setNewStory(false);
                    setLoading(false);
                    if (Platform.OS == "ios") {
                      dispatch(
                        actionPreviewStory(
                          POST_TYPE_VIDEO,
                          sTemporalPath + sName,
                          sName
                        )
                      );
                    } else {
                      if (nIndex > 0) {
                        dispatch(
                          actionPreviewStory(
                            POST_TYPE_VIDEO,
                            sTemporalPath + sName,
                            sName
                          )
                        );
                      } else {
                        dispatch(actionMessage("There was a problem selecting the video"));
                        setLoading(false);
                        setChangePhoto(false);
                        setJourney(null);
                        setNewStory(false);
                      }
                    }
                  })
                  .catch((oError) => {
                    dispatch(actionMessage("There was a problem resizing the video"));
                  });
              } else if (image.mime.indexOf("image") !== -1) {
                setNewStory(false);
                setLoading(false);
                ImagePicker.openCropper({
                  path: image.path,
                  width: 800,
                  height: 1024,
                  includeBase64: true,
                })
                  .then((oImage) => {
                    dispatch(
                      actionPreviewStory(
                        POST_TYPE_IMAGE,
                        `data:image/jpg;base64,` + oImage.data
                      )
                    );
                  })
                  .catch((oError) => {
                    setLoading(false);
                    setChangePhoto(false);
                    setJourney(null);
                    setNewStory(false);
                  });
              } else dispatch(actionMessage("Unsupported file type"));
            } else
              setNewImage(image.data);
            setLoading(false);
            setShowQuestionChangeImage(true);
            setChangePhoto(false);

          },
          (cancel) => {
            setLoading(false);
            setChangePhoto(false);
            setJourney(null);
            setNewStory(false);
          }
        );
        break;
    }
  };

  const changePhotoHandler = () => {
    dispatch(
      actionEditJourney(
        journey.id,
        session.account.id,
        journey.description,
        newImage
      )
    );
    setChangeDescription(false);
    setJourney(null);
    setShowQuestionChangeImage(false);
    setNewImage(null);
    setJourney(null);
  };

  const swipe = (nIndex) => {
    props.navigation.setParams({
      index: nIndex,
    });
    setIndex(nIndex);
  };

  const actionChangePhoto = () => {
    if (journey.likes < 1) {
      setChangePhoto(true);
      setShowToastEdit(false);
    } else {
      dispatch(actionMessage("You cannot change a photo that has likes"));
    }
  };

  const handleScrollView = (event) => {
    let nScrollY = event.nativeEvent.contentOffset.y,
      nIndex = Math.round(nScrollY / (612 - 60));
    if (nIndex > 0 && journeyProps.journeys[nIndex] !== undefined)
      journeyProps.journeys[nIndex - 1].paused = true;
    if (
      nIndex + 1 < journeyProps.journeys.length - 1 &&
      journeyProps.journeys[nIndex + 1] !== undefined
    )
      journeyProps.journeys[nIndex + 1].paused = true;
    if (journeyProps.journeys[nIndex] !== undefined)
      journeyProps.journeys[nIndex].paused = false;
    setRefresh(!refresh);
  };

  const renderItem = (oItem, nIndex, bPaused) => {
    return (
      <View style={CarouselStyle.itemContainer}>
        {oItem.type == POST_TYPE_VIDEO ? (
          <Pressable
            activeOpacity={1}
            onPress={() => {
              setMuted(!muted);
            }}
          >
            <Video
              paused={
                props.swiperHome === undefined
                  ? index === 1
                    ? bPaused == undefined
                      ? true
                      : bPaused
                    : true
                  : props.indexHome === 1 ||
                    props.indexHome === undefined
                    ? bPaused == undefined
                      ? true
                      : bPaused
                    : true
              }
              muted={
                props.swiperHome !== undefined
                  ? muted
                  : muted || props.indexHome === 1
              }
              repeat={true}
              controls={false}
              disableFocus={false}
              key={"video_" + oItem.id.toString() + oItem.id_user}
              resizeMode={"cover"}
              source={{ uri: oItem.image }}
              style={GlobalStyles.fullImage}
              ref={(ref) => {
                player = ref;
              }}
              onLoadStart={() => setMuted(!muted)}
            />
            {muted && !bPaused && (
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
                setRefresh(!refresh);
              }}
              activeOpacity={1}
            >
              {getImage(oItem)}
            </Pressable>
            {oItem.showTag &&
              oItem.tags.map((oTag) => (
                <Pressable
                  onPress={() => redirectionViewProfileHandler(oTag.id_user)}
                  key={oTag.id.toString()}
                  style={dynamicStyle(oTag)}
                >
                  <View style={styles.tagTriangle}></View>
                  <View style={styles.tagUserView}>
                    <Text style={styles.tagListText}>{oTag.name}</Text>
                  </View>
                </Pressable>
              ))}
          </>
        ) : (
          getImage(oItem)
        )}
      </View>
    );
  };

  const getImage = (oItem) => {
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

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: WhiteColor, flex: 1 }}>
        <ScrollView
          scrollEventThrottle={1}
          onScroll={handleScrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          <View
            style={{ borderBottomColor: "#A6A7A8", borderBottomWidth: 0.5 }}
          >
            <Stories
              new={() => setNewStory(true)}
              options={() => setViewMyStory(true)}
            />
          </View>
          {journeyProps.journeys.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={journeyProps.journeys}
              extraData={refresh}
              scrollEnabled={false}
              refreshing={refresh}
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
                      redirectionViewProfileHandler(item.user.id)
                    }
                    options={() => {
                      setShowToastQuestion(true);
                      setJourney(item);
                    }}
                  />
                  <View style={{ aspectRatio: 1 }}>
                    <SafeAreaView>
                      <Carousel
                        ref={(oRef) => {
                          crousel = oRef;
                        }}
                        data={item.images}
                        renderItem={(oItem) =>
                          renderItem(oItem.item, oItem.index, item.paused)
                        }
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        lockScrollWhileSnapping={true}
                        autoplay={false}
                        style={CarouselStyle.carouselContainer}
                        loop={false}
                        onSnapToItem={(index) => {
                          item.nIndex = index;
                          setRefresh(!refresh);
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
                      pressAddLike={() => addUnLike(item, true)}
                      existTags={item.images[item.nIndex].tags.length > 0}
                      showTags={() => {
                        setShowTagsList(true);
                        setTags(item.images[item.nIndex].tags);
                      }}
                      pressUnLike={() => addUnLike(item, false)}
                      showLikes={() => showLikesHandler(item.id)}
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
          visible={showToastQuestion}
          options={
            <View style={{ padding: 10 }}>
              {null !== journey &&
                journey.user.id !==
                session.account.id && (
                  <Pressable
                    onPress={() => {
                      setShowReport(true);
                      setShowToastQuestion(false);
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
              {null !== journey &&
                journey.user.id ===
                session.account.id && (
                  <Pressable
                    onPress={() => {
                      setShowToastQuestion(false);
                      setShowToastEdit(true);
                    }}
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
              {null !== journey &&
                journey.user.id ===
                session.account.id && (
                  <Pressable
                    onPress={() => {
                      setShowToastQuestion(false);
                      setShowQuestionDeleteJourney(true);
                    }}
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
                onPress={() => {
                  setShowToastQuestion(false);
                  setJourney(null);
                }}
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
          visible={showToastEdit}
          options={
            <View style={{ padding: 10 }}>
              <Pressable
                onPress={() => {
                  setChangeDescription(true);
                  setShowToastEdit(false);
                  setNewDescription(journey.description);
                }}
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
                            <Pressable onPress={() => actionChangePhoto()}>
                                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                                    <Icon name="images" size={22} color={WhiteColor} />
                                    <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                                        New Image
                                    </Text>
                                </View>
                            </Pressable> 
                        */}
              <Pressable
                onPress={() => {
                  setShowToastQuestion(true);
                  setShowToastEdit(false);
                }}
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
        {changeDescription && (
          <View style={ToastQuestionGenericStyles.contentToast}>
            <View style={ToastQuestionGenericStyles.viewToast}>
              <TextInput
                numberOfLines={4}
                multiline={true}
                style={ToastQuestionGenericStyles.inputLarge}
                value={newDescription}
                onChangeText={(text) => setNewDescription(text)}
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() => {
                      setShowToastEdit(true);
                      setChangeDescription(false);
                    }}
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => changeDescriptionHandler()}
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
        {newStory ? (
          <ToastQuestion
            visible={changePhoto || newStory}
            close={() => { setChangePhoto(false); setNewStory(false); }}
            functionCamera={() => addImage("camera")}
            functionGallery={() => addImage("gallery")}
            functionVideo={() => addImage("video")}
          />
        ) : (
          <ToastQuestion
            visible={changePhoto || newStory}
            close={() => { setChangePhoto(false); setNewStory(false); }}
            functionCamera={() => addImage("camera")}
            functionGallery={() => addImage("gallery")}
          />
        )}
        {null !== journey && (
          <ToastQuestionGeneric
            visible={showQuestionChangeImage}
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
                        uri: journey.image,
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
                        uri: `data:image/jpg;base64,` + newImage,
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
                      onPress={() => {
                        setShowQuestionChangeImage(false);
                        setNewImage(null);
                        setJourney(null);
                      }}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonConfirm}
                      onPress={() => changePhotoHandler()}
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
        <LoadingSpinner visible={loading} />
        <ShowLikes
          visible={showLikes}
          close={() => setShowLikes(false)}
          navigation={props.navigation}
          redirectionViewProfile={(nIdFitrec) =>
            redirectionViewProfileHandler(nIdFitrec)
          }
        />
        {showTagsList && (
          <View style={GlobalModal.viewContent}>
            <View style={GlobalModal.viewHead}>
              <Text style={GlobalModal.headTitle}>Tags in this Photo</Text>
              <Pressable
                style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
                onPress={() => {
                  setShowTagsList(false);
                  setTags(null);
                }}
              >
                <Icon name="close" color={SignUpColor} size={22} />
                <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                  Close
                </Text>
              </Pressable>
            </View>
            <ListPeople
              people={tags}
              refresh={refresh}
              action={(item) => redirectionViewProfileHandler(item.id_user)}
              grid={false}
            />
          </View>
        )}
        <ToastQuestionGeneric
          visible={showQuestionDeleteJourney}
          titleBig="Delete journey"
          title="Are you sure you want to delete journey?"
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => setShowQuestionDeleteJourney(false)}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => deleteJourney()}
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
        {showReport && journey !== null && (
          <ModalReport
            visible={showReport}
            close={() => setShowReport(false)}
            send={() => setShowReport(false)}
            type={REPORT_JOURNEY_TYPE}
            id={journey.id}
          />
        )}
        <ToastQuestionGeneric
          visible={viewMyStory}
          options={
            <View style={{ padding: 10 }}>
              <Pressable
                onPress={() => {
                  dispatch(actionViewStoryAction());
                  setViewMyStory(false);
                }}
              >
                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    View
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setNewStory(true);
                  setViewMyStory(false);
                }}
              >
                <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Upload
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setViewMyStory(false)}>
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

  return (
    <View style={{ flex: 1 }}>
      {props.swiperHome === undefined ? (
        <Swiper
          loop={false}
          showsPagination={false}
          onIndexChanged={(nIndex) => swipe(nIndex)}
          scrollEnabled={true}
          horizontal={true}
          index={1}
          ref={oSwiperRef}
        >
          <View style={styles.contentSwipe}>
            <Home swiperHome={true} navigation={props.navigation} />
          </View>
          <View style={styles.contentSwipe}>{renderContent()}</View>
        </Swiper>
      ) : (
        renderContent()
      )}
    </View>
  );
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
  viewMyStory: () => {
    dispatch(actionViewStoryAction());
  },
  cleanNavigation: () => {
    dispatch(actionCleanNavigation());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JourneyList);
