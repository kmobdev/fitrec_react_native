import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/Ionicons";
import { connect, useDispatch, useSelector } from "react-redux";
import { ShowFooter } from "../../components/journey/ShowFooter";
import { ShowHead } from "../../components/journey/ShowHead";
import ShowLikes from "../../components/journey/ShowLikes";
import ModalReport from "../../components/report/ModalReport";
import { ListPeople } from "../../components/shared/ListPeople";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import {
  GlobalModal,
  GlobalStyles,
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
  ToastQuestionGenericStyles,
  ToastQuestionStyles,
  WhiteColor,
  CarouselStyle,
  JourneyStyles,
} from "../../Styles";
import moment from "moment/min/moment-with-locales";
import {
  actionAddUnLike,
  actionDeleteJourney,
  actionEditJourney,
  actionGetLikes,
  actionGetJourney,
  actionRemoveTagUser,
  actionAddTagUser,
} from "../../redux/actions/JourneyActions";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import ImagePicker from "react-native-image-crop-picker";
import { SearchUsername } from "../../components/chat/SearchUsername";
import { actionMessage } from "../../redux/actions/SharedActions";
import { POST_TYPE_VIDEO, REPORT_JOURNEY_TYPE } from "../../Constants";
import Video from "react-native-video";
import Carousel, { Pagination } from "react-native-snap-carousel";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ShowJourney = (props) => {
  const session = useSelector((state) => state.reducerSession);
  const journeyProps = useSelector((state) => state.reducerShowJourney);
  const myPals = useSelector((state) => state.reducerMyPals);

  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(false);
  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [statusGetLikesResponse, setStatusGetLikesResponse] = useState(false);
  const [showQuestionDeleteJourney, setShowQuestionDeleteJourney] =
    useState(false);
  const [showToastEdit, setShowToastEdit] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [changePhoto, setChangePhoto] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [showQuestionChangeImage, setShowQuestionChangeImage] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [userTag, setUserTag] = useState(null);
  const [search, setSearch] = useState("");
  const [muted, setMuted] = useState(true);
  const [nIndex, setNIndex] = useState(0);
  const [isChangeTags, setIsChangeTags] = useState(false);
  const [changeDescription, setChangeDescription] = useState(false);
  const [showQuestionAddTag, setShowQuestionAddTag] = useState(false);
  const [showQuestionRemoveTag, setShowQuestionRemoveTag] = useState(false);
  const [showTagsList, setShowTagsList] = useState(false);
  const [top, setTop] = useState(null);
  const [left, setLeft] = useState(null);

  useEffect(() => {
    props.navigation.setParams({ goBack: goBack });
    dispatch(actionGetJourney(props.navigation.getParam("id", 0)));
  }, []);

  useEffect(() => {
    if (!journeyProps.status) goBack();
    setRefreshing(false);
    setRefresh(!refresh);
  }, [journeyProps]);

  const showOptions = () => {
    setShowToastQuestion(true);
  };

  const goBack = () => {
    dispatch(actionGetJourney());
    props.navigation.goBack();
  };

  const addUnLike = (nIdJourney, bAddLike) => {
    let oDataNotification =
      session.account.id !== journeyProps.journey.user.id
        ? {
            sHeader: session.account.username,
            sDescription: `${session.account.name} likes your post`,
            sPushId: journeyProps.journey.user.id_push,
          }
        : null;
    dispatch(actionAddUnLike(nIdJourney, bAddLike, oDataNotification));
  };

  const showLikesHandler = (nJourneyId) => {
    dispatch(actionDeleteJourney(nJourneyId));
    setShowLikes(true);
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

  const deleteJourney = () => {
    setShowQuestionDeleteJourney(false);
    dispatch(actionDeleteJourney(journeyProps.journey.id, session.account.id));
    goBack();
  };

  const redirectionViewProfile = (nIdFitrec) => {
    if (
      props.navigation.state.routeName === "ShowJourneyMyProfile" &&
      nIdFitrec === journeyProps.journey.user.id
    )
      props.navigation.goBack();
    else {
      dispatch(actionGetProfile(nIdFitrec, true));
      if (props.closeModal) {
        setTimeout(() => {
          props.close();
          props.closeModal();
        }, 1000);
      }
      if (props.navigation.state.routeName === "ShowJourneyMyProfile") {
        props.navigation.navigate("ProfileViewDetailsUser");
      } else props.navigation.navigate("ProfileViewDetails");
    }
  };

  const changeDescriptionHandler = () => {
    dispatch(
      actionEditJourney(
        journeyProps.journey.id,
        session.account.id,
        newDescription,
        null,
        true
      )
    );
    setChangeDescription(false);
  };

  const addImage = (sType) => {
    var oOptions = {
      cropping: true,
      width: 800,
      height: 800,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
      mediaType: "photo",
    };
    if ("camera" === sType) {
      ImagePicker.openCamera(oOptions).then(
        (image) => {
          setNewImage(image.data);
          setShowQuestionChangeImage(true);
          setChangePhoto(false);
        },
        () => {
          setChangePhoto(false);
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        (image) => {
          setNewImage(image.data);
          setShowQuestionChangeImage(true);
          setChangePhoto(false);
        },
        () => {
          setChangePhoto(false);
        }
      );
    }
  };

  const changePhotoHandler = () => {
    dispatch(
      actionEditJourney(
        journeyProps.journey.id,
        session.account.id,
        journeyProps.journey.description,
        newImage,
        true
      )
    );
    setChangeDescription(false);
    setShowQuestionChangeImage(false);
    setNewImage(null);
  };

  const actionChangePhoto = () => {
    if (journeyProps.journey.likes < 1) {
      setChangePhoto(true);
      setShowToastEdit(false);
    } else {
      dispatch(actionMessage("You cannot change a photo that has likes"));
    }
  };

  const setTagUser = () => {
    setShowQuestionAddTag(false);
    if (
      null !== journeyProps.journey.images[nIndex].tags &&
      journeyProps.journey.images[nIndex].tags.filter(
        (element) => element.id_user === userTag.id
      ).length > 0
    ) {
      dispatch(
        actionMessage(
          "The tag already exists, you must remove the current tag to add a new tag"
        )
      );
    } else {
      setShowFriends(false);
      var nJourneyId = journeyProps.journey.id,
        nUserTaggedId = userTag.id,
        nX = left,
        nY = top,
        sUserKey = userTag.key,
        nUserId = session.account.id,
        sName = session.account.name,
        sUsername = session.account.username,
        nImageId = journeyProps.journey.images[nIndex].id;
      dispatch(
        actionAddTagUser(
          nJourneyId,
          nUserTaggedId,
          nX,
          nY,
          sUserKey,
          nUserId,
          sName,
          sUsername,
          nImageId,
          true
        )
      );
    }
  };

  const removeTag = () => {
    var nTagId = userTag.id,
      nJourneyId = journeyProps.journey.id,
      nUserId = session.account.id;
    setShowQuestionRemoveTag(false);
    setUserTag(null);
    dispatch(actionRemoveTagUser(nTagId, nUserId, nJourneyId));
  };

  const handlePress = (evt) => {
    setTop((evt.nativeEvent.locationY * 100) / screenHeight);
    setLeft((evt.nativeEvent.locationX * 100) / screenWidth);
    setTimeout(() => {
      setShowFriends(true);
    }, 200);
  };

  const renderItem = (oItem, nIndex, bPaused) => {
    return (
      <View style={CarouselStyle.itemContainer}>
        {oItem.type == POST_TYPE_VIDEO ? (
          <Pressable
            activeOpacity={1}
            onPress={() => {
              setMuted(!muted);
            }}>
            <Video
              paused={bPaused == undefined ? true : bPaused}
              muted={muted}
              repeat={true}
              controls={false}
              disableFocus={false}
              key={"video_" + oItem.id.toString() + oItem.id_user}
              resizeMode={"cover"}
              source={{ uri: oItem.image, cache: true }}
              style={GlobalStyles.fullImage}
              ref={(ref) => {
                player = ref;
              }}
              onLoadStart={() => {
                setMuted(!muted);
              }}
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
        ) : isChangeTags ? (
          <>
            {getImage(oItem)}
            {oItem.tags.map((tag) => (
              <View key={tag.id.toString()} style={dynamicStyle(tag)}>
                {
                  <View>
                    <View style={styles.tagTriangle} />
                    <Pressable
                      onPress={() => {
                        setShowQuestionRemoveTag(true);
                        setUserTag(tag);
                      }}
                      style={styles.tagUserView}>
                      <Text style={styles.tagListText}> {tag.name} </Text>
                      <View style={styles.removeTagUser}>
                        <Image
                          style={styles.removeIcon}
                          source={require("../../assets/remove.png")}
                        />
                      </View>
                    </Pressable>
                  </View>
                }
              </View>
            ))}
          </>
        ) : oItem.showTag && oItem.tags.length > 0 ? (
          <>
            <Pressable
              onPress={() => {
                oItem.showTag = !oItem.showTag;
                setRefresh(!refresh);
              }}
              activeOpacity={1}>
              {getImage(oItem)}
            </Pressable>
            {oItem.tags.map((oTag) => (
              <Pressable
                onPress={() => redirectionViewProfile(oTag.id_user)}
                key={oTag.id.toString()}
                style={dynamicStyle(oTag)}>
                <View style={styles.tagTriangle}></View>
                <View style={styles.tagUserView}>
                  <Text style={styles.tagListText}>{oTag.name}</Text>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <Pressable
            onPress={() => {
              oItem.showTag = !oItem.showTag;
              setRefresh(!refresh);
            }}
            activeOpacity={1}>
            {getImage(oItem)}
          </Pressable>
        )}
      </View>
    );
  };

  const getImage = (oItem) => {
    return isChangeTags ? (
      <TouchableWithoutFeedback onPress={(evt) => handlePress(evt)}>
        <FastImage
          style={GlobalStyles.fullImage}
          source={{
            uri: oItem.image,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
    ) : (
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

  return (
    <View style={{ flex: 1, backgroundColor: WhiteColor }}>
      {journeyProps.journey !== null && (
        <View style={styles.viewPost}>
          <ShowHead
            date={moment(
              journeyProps.journey.created_at,
              "YYYY-MM-DD H:m:s"
            ).fromNow()}
            level={journeyProps.journey.user.level}
            username={journeyProps.journey.user.username}
            image={journeyProps.journey.user.image}
            redirectionViewProfile={() =>
              redirectionViewProfile(journeyProps.journey.user.id)
            }
            options={() => showOptions()}
            bShowOptions={isChangeTags}
            fCloseChangeTags={() => setIsChangeTags(false)}
          />
          <View style={{ aspectRatio: 1 }}>
            <Carousel
              ref={(oRef) => {
                crousel = oRef;
              }}
              data={journeyProps.journey.images}
              renderItem={(oItem) => renderItem(oItem.item, oItem.index, false)}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              lockScrollWhileSnapping={true}
              autoplay={false}
              style={{ padding: 0, margin: 0, width: "100%", height: "100%" }}
              loop={false}
              onSnapToItem={(index) => {
                setNIndex(index);
                setRefresh(!refresh);
              }}
            />
            {journeyProps.journey.images.length > 1 && (
              <Pagination
                dotsLength={journeyProps.journey.images.length}
                activeDotIndex={nIndex}
                containerStyle={CarouselStyle.paginationContainer}
                dotStyle={CarouselStyle.paginationActive}
                inactiveDotStyle={CarouselStyle.paginationInactive}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
              />
            )}
          </View>
          {isChangeTags && (
            <View style={styles.footerPhoto}>
              <Text style={styles.footerContent}>TAP PHOTO to tag people</Text>
            </View>
          )}
          <ShowFooter
            isLiked={journeyProps.journey.isLiked}
            likes={journeyProps.journey.likes}
            text={journeyProps.journey.description}
            pressAddLike={() => addUnLike(journeyProps.journey.id, true)}
            existTags={journeyProps.journey.images[nIndex].tags.length > 0}
            showTags={() => {
              setShowTagsList(true);
              setTags(journeyProps.journey.images[nIndex].tags);
            }}
            pressUnLike={() => addUnLike(journeyProps.journey.id, false)}
            showLikes={() => showLikesHandler(journeyProps.journey.id)}
          />
        </View>
      )}
      <ToastQuestionGeneric
        visible={showToastQuestion}
        options={
          <View style={{ padding: 10 }}>
            {null !== journeyProps.journey &&
              journeyProps.journey.user.id !== session.account.id && (
                <Pressable
                  onPress={() => {
                    setShowReport(true);
                    setShowToastQuestion(false);
                  }}>
                  <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                    <Icon name="close-circle" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}>
                      Report Post
                    </Text>
                  </View>
                </Pressable>
              )}
            {null !== journeyProps.journey &&
              journeyProps.journey.user.id === session.account.id && (
                <Pressable
                  onPress={() => {
                    setShowToastEdit(true);
                    setShowToastQuestion(false);
                  }}>
                  <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                    <Icon name="create-outline" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}>
                      Edit
                    </Text>
                  </View>
                </Pressable>
              )}
            {null !== journeyProps.journey &&
              journeyProps.journey.user.id === session.account.id &&
              journeyProps.journey.images[nIndex].type != POST_TYPE_VIDEO && (
                <Pressable
                  onPress={() => {
                    setShowToastQuestion(false);
                    setIsChangeTags(true);
                  }}>
                  <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                    <Icon name="pricetag" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}>
                      Tags
                    </Text>
                  </View>
                </Pressable>
              )}
            {null !== journeyProps.journey &&
              journeyProps.journey.user.id === session.account.id && (
                <Pressable
                  onPress={() => {
                    setShowToastQuestion(false);
                    setShowQuestionDeleteJourney(true);
                  }}>
                  <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                    <Icon name="trash-outline" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}>
                      Delete
                    </Text>
                  </View>
                </Pressable>
              )}
            <Pressable onPress={() => setShowToastQuestion(false)}>
              <View
                style={[
                  ToastQuestionGenericStyles.viewButtonOption,
                  { marginBottom: 0 },
                ]}>
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
                setNewDescription(journeyProps.journey.description);
              }}>
              <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                <Icon name="create-outline" size={22} color={WhiteColor} />
                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                  Description
                </Text>
              </View>
            </Pressable>
            {/* <Pressable onPress={() => actionChangePhoto()}>
                            <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                                <Icon name="images" size={22} color={WhiteColor} />
                                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                                    New Image
                                </Text>
                            </View>
                        </Pressable> */}
            <Pressable
              onPress={() => {
                setShowToastQuestion(false);
                setShowToastEdit(false);
              }}>
              <View
                style={[
                  ToastQuestionGenericStyles.viewButtonOption,
                  { marginBottom: 0 },
                ]}>
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
                  }}>
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
              <View style={{ width: "50%" }}>
                <Pressable
                  style={ToastQuestionGenericStyles.buttonConfirm}
                  onPress={() => changeDescriptionHandler()}>
                  <Text style={ToastQuestionGenericStyles.buttonText}>
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
      <ToastQuestion
        visible={changePhoto}
        functionCamera={() => addImage("camera")}
        functionGallery={() => addImage("gallery")}
      />
      {null !== journeyProps.journey && (
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
                      uri: journeyProps.journey.image,
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
                style={[ToastQuestionStyles.viewButtons, { width: "100%" }]}>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() => {
                      setShowQuestionChangeImage(false);
                      setNewImage(null);
                    }}>
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => changePhotoHandler()}>
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
      <ShowLikes
        visible={showLikes}
        close={() => setShowLikes(false)}
        navigation={props.navigation}
        redirectionViewProfile={(nIdFitrec) =>
          redirectionViewProfile(nIdFitrec)
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
              }}>
              <Icon name="close" color={SignUpColor} size={22} />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                Close
              </Text>
            </Pressable>
          </View>
          <ListPeople
            people={tags}
            refresh={refresh}
            action={(item) => redirectionViewProfile(item.id_user)}
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
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => deleteJourney()}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: SignUpColor },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Ok</Text>
            </Pressable>
          </View>
        }
      />
      {showReport && journeyProps.journey !== null && (
        <ModalReport
          visible={showReport}
          close={() => setShowReport(false)}
          send={() => setShowReport(false)}
          type={REPORT_JOURNEY_TYPE}
          id={journeyProps.journey.id}
        />
      )}
      {showFriends && (
        <View
          style={[
            {
              zIndex: 999,
              position: "absolute",
              marginTop: 0,
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(255,255,255, 0.9)",
            },
          ]}>
          <SearchUsername
            ph="Search for people or username"
            value={search}
            change={(text) => {
              setSearch(text);
              setRefresh(!refresh);
            }}
            clean={() => {
              setSearch("");
              setRefresh(!refresh);
            }}
            close={() => setShowFriends(false)}
          />
          ``
          {myPals.myFriends.length > 0 && (
            <FlatList
              data={myPals.myFriends.filter(
                (element) =>
                  element.name.includes(search) ||
                  element.username.includes(search)
              )}
              keyExtractor={(item, index) => index.toString()}
              extraData={refresh}
              refreshing={refresh}
              renderItem={({ item }) => (
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: PlaceholderColor,
                  }}>
                  <Pressable
                    onPress={() => {
                      setUserTag(item);
                      setShowQuestionAddTag(true);
                      setShowFriends(false);
                    }}
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      padding: 10,
                    }}>
                    {null === item.image ? (
                      <Image
                        style={{ height: 80, width: 80 }}
                        source={require("../../assets/imgProfileReadOnly.png")}
                      />
                    ) : (
                      <FastImage
                        style={{ height: 60, width: 60, borderRadius: 100 }}
                        source={{
                          uri: item.image,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    )}
                    <View style={{ justifyContent: "center", marginLeft: 10 }}>
                      <Text style={styles.textUserReference}>{item.name}</Text>
                      <Text style={{ fontSize: 14 }}>{item.fitnesLevel}</Text>
                    </View>
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>
      )}
      <ToastQuestionGeneric
        visible={showQuestionAddTag}
        titleBig="Add tag user"
        title="Are you sure you want to add tag?"
        options={
          <View style={ToastQuestionStyles.viewButtons}>
            <Pressable
              onPress={() => setShowQuestionAddTag(false)}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: GreenFitrecColor, marginRight: 10 },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => setTagUser()}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: SignUpColor },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Ok</Text>
            </Pressable>
          </View>
        }
      />
      <ToastQuestionGeneric
        visible={showQuestionRemoveTag}
        titleBig="Remove tag user"
        title="Are you sure you want to remove tag?"
        options={
          <View style={ToastQuestionStyles.viewButtons}>
            <Pressable
              onPress={() => setShowQuestionRemoveTag(false)}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: GreenFitrecColor, marginRight: 10 },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => removeTag(tagSelected)}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: SignUpColor },
              ]}>
              <Text style={ToastQuestionStyles.textButton}>Ok</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

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
  removeTagUser: {
    backgroundColor: "white",
    height: 15,
    width: 15,
    marginLeft: 5,
    borderRadius: 15,
    marginTop: 3,
  },
  removeIcon: {
    height: 8,
    width: 8,
    marginTop: 3,
    marginLeft: 3.5,
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
});

export default ShowJourney;
