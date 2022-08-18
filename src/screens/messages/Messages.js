import React, { useEffect, useRef, useState } from "react";
import {
  GlobalMessages,
  GlobalModal,
  GlobalStyles,
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
} from "../../Styles";
import { connect, useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Keyboard,
  TextInput,
  Platform,
} from "react-native";
import {
  actionExpandImage,
  actionMessage,
} from "../../redux/actions/SharedActions";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import moment from "moment/min/moment-with-locales";
import {
  actionGetGiphy,
  actionGetMessages,
  actionSendMessage,
  actionSendMessageChatGroup,
} from "../../redux/actions/ChatActions";
import { ModalGifs } from "../../components/shared/ModalGifs";
import {
  OPTIONS_GEOLOCATION_GET_POSITION,
  OPTIONS_IMAGE_CROP_CONVERSATION,
  SEND_MESSAGE_TYPES,
} from "../../Constants";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

const UserImageDefault = require("../../assets/profile.png");
const GifIcon = require("../../assets/gif.png");
const GiphyLogo = require("../../assets/giphyLogo.png");

const OPTION_CAMERA = "camera";
const OPTION_GALLERY = "gallery";

const Messages = (props) => {

  const oScrollView = useRef();

  const oMessageProps = useSelector((state) => state.reducerMessages);
  const session = useSelector((state) => state.reducerSession);
  const oGiphyProps = useSelector((state) => state.reducerGiphy);

  const dispatch = useDispatch();

  const [showKeyboard, setShowKeyboard] = useState(0);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [asignMessageFunction, setAsignMessageFunction] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [marker, setMarker] = useState("");
  const [search, setSearch] = useState("");
  const [showGifsModal, setShowGifsModal] = useState(false);
  const [showGifsStickers, setShowGifsStickers] = useState(false);
  const [showOptionImage, setShowOptionImage] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [optionName, setOptionName] = useState(false);
  const [initialLocation, setInitialLocation] = useState({
    latitude: 40.5879479,
    longitude: -109.405,
  });

  useEffect(() => {
    dispatch(actionGetMessages());
    if (getIsGroupChat() && !asignMessageFunction) {
      props.navigation.setParams({
        people: showPeopleHandler,
        showPeople: showPeople,
      });
      setAsignMessageFunction(true);
    }
  }, [])

  const goBackHandler = () => {
    dispatch(actionGetMessages());
    props.navigation.goBack();
  };

  const showPeopleHandler = () => {
    props.navigation.setParams({
      goBack: goBackHandler,
      showPeople: !showPeople,
    });
    setShowPeople(!showPeople);
  };

  const getIsGroupChat = () => {
    if (oMessageProps.oConversation === null) return false;
    const { type: nType } = oMessageProps.oConversation;
    return nType === 2;
  };

  const expandImage = (urlToImage) => {
    dispatch(actionExpandImage(urlToImage));
  };

  const handleChangeSearch = (text) => {
    setSearch(text);
  };

  const handleFocusSearch = () => {
    if (null !== oScrollView && undefined !== oScrollView)
      oScrollView.current.scrollToEnd({ animated: true });
  };

  const handleCleanSearch = (nType = null) => {
    if (nType === SEND_MESSAGE_TYPES.GIF) {
      dispatch(actionGetGiphy(""));
      setSearch("")
    }
  };

  const viewProfile = (sUserKey) => {
    const { users: aUsers } = oMessageProps.oConversation;
    let aUser = aUsers.filter((oUser) => oUser.key === sUserKey);
    if (aUser.length > 0) {
      let nId = aUser[0].id ? aUser[0].id : null;
      if (nId === null) return;
      dispatch(actionGetProfile(nId, true));
      props.navigation.navigate("ProfileViewDetailsHome");
    }
    return null;
  };

  const resetState = () => {
    setKeyboardPadding(keyboardPadding)
    setText("")
  };

  const sendMessage = (sType = SEND_MESSAGE_TYPES.TEXT, oGif = null) => {
    const { oConversation } = oMessageProps;
    const { key: sUserKey, name: sUserName } = session.account;
    let sMessage = "",
      oData = null;
    switch (sType) {
      case SEND_MESSAGE_TYPES.TEXT:
      default:
        sMessage = text.trim();
        if (sMessage === "") return;
        break;
      case SEND_MESSAGE_TYPES.IMAGE:
        sMessage = image;
        break;
      case SEND_MESSAGE_TYPES.LOCATION:
        if (marker === null)
          return dispatch(actionMessage("The marker cannot be empty"));
        oData = {
          lat: marker.latitude,
          lon: marker.longitude,
        };
        break;
      case SEND_MESSAGE_TYPES.GIF:
        sMessage = oGif.image;
        oData = {
          height: oGif.height,
          width: oGif.width,
          giphyId: oGif.id,
          isSticker: showGifsStickers,
        };
        break;
    }
    const { key: sConversationKey, users: aUsers } =
      oMessageProps.oConversation,
      oSender = {
        key: sUserKey,
        name: sUserName,
      };
    if (oConversation.type === 1) {
      const sFriendKey = aUsers[0].key;
      dispatch(
        actionSendMessage(
          oSender,
          sMessage,
          sType,
          sFriendKey,
          sConversationKey,
          oData
        )
      );
    } else {
      dispatch(
        actionSendMessageChatGroup(
          oSender,
          sMessage,
          sType,
          sConversationKey,
          oData
        )
      );
    }
    resetState();
  };

  const addImage = (sType = OPTION_GALLERY) => {
    switch (sType) {
      case OPTION_CAMERA:
        ImagePicker.openCamera(OPTIONS_IMAGE_CROP_CONVERSATION)
          .then((oResponse) => {
            var imageB64 = oResponse.data;
            setImage(imageB64)
            sendMessage(SEND_MESSAGE_TYPES.IMAGE);
          })
          .catch(() => {
            if (oError.message == "Permission denied")
              return
            dispatch(actionMessage("Permission denied, please check FitRec permissions"));
            dispatch(actionMessage(MESSAGE_ERROR));
          });
        break;
      case OPTION_GALLERY:
      default:
        ImagePicker.openPicker(OPTIONS_IMAGE_CROP_CONVERSATION)
          .then((oResponse) => {
            var imageB64 = oResponse.data;
            setImage(imageB64)
            sendMessage(SEND_MESSAGE_TYPES.IMAGE);
          })
          .catch(() => {
            if (oError.message == "Permission denied")
              return
            dispatch(actionMessage("Permission denied, please check FitRec permissions"));
            dispatch(actionMessage(MESSAGE_ERROR));
          });
        break;
    }
  };

  const showMapHandler = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && undefined !== position.coords) {
          Keyboard.dismiss();
          setInitialLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.1,
          });
          setMarker({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          setShowMap(true);
        }
      },
      (error) => {
        Keyboard.dismiss();
        handlePressOptions("showMap");
      },
      OPTIONS_GEOLOCATION_GET_POSITION
    );
  };

  const handlePressOptions = (optionName) => {
    Keyboard.dismiss();
    if (optionName === "showGifsModal") {
      dispatch(actionGetGiphy(""));
      setOptionName(true)
    }
  };

  const getImageUser = (sUserKey) => {
    const { users: aUsers } = oMessageProps.oConversation;
    let aUser = aUsers.filter((oUser) => oUser.key === sUserKey);
    if (aUser.length > 0) return aUser[0].image ? aUser[0].image : null;
    return null;
  };

  const getNameUser = (sUserKey) => {
    const { users: aUsers } = oMessageProps.oConversation;
    let aUser = aUsers.filter((oUser) => oUser.key === sUserKey);
    if (aUser.length > 0) return aUser[0].username ? aUser[0].username : null;
    return null;
  };

  const renderPeople = () => {
    const { oConversation } = oMessageProps.oConversation;
    if (oConversation === null) return null;
    const { users: aUsers } = oConversation;
    return (
      <View style={{ flex: 1, backgroundColor: WhiteColor }}>
        <View style={oStyles.container}>
          {aUsers.map(
            (oUser) =>
              oUser && (
                <Pressable
                  key={oUser.key + oUser.id}
                  style={[
                    oStyles.pd10,
                    oStyles.row,
                    {
                      borderBottomWidth: 0.5,
                      borderBottomColor: PlaceholderColor,
                    },
                  ]}
                  onPress={() => viewProfile(oUser.key)}
                >
                  {null === oUser.image ? (
                    <Image
                      style={GlobalStyles.photoProfileCardList}
                      source={UserImageDefault}
                    />
                  ) : (
                    <FastImage
                      style={GlobalStyles.photoProfileCardList}
                      source={{
                        uri: oUser.image,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                  <View style={oStyles.rowText}>
                    <Text style={oStyles.textUserReference}>{oUser.name}</Text>
                    <Text style={{ fontStyle: "italic" }}>
                      {oUser.username}
                    </Text>
                  </View>
                </Pressable>
              )
          )}
        </View>
      </View>
    );
  };

  const renderMessages = () => {
    const { aMessages } = oMessageProps;
    const { key: sConversationKey } = oMessageProps.oConversation;
    const { key: sUserKey } = session.account;
    return (
      <View style={oStyles.container}>
        <ScrollView
          style={oStyles.pd10}
          ref={oScrollView}
          onContentSizeChange={() => {
            if (null !== oScrollView && undefined !== oScrollView)
              oScrollView.current.scrollToEnd({ animated: true });
          }}
        >
          {aMessages ? (
            aMessages.map((oMessage) => (
              <View key={`${oMessage.date}${oMessage.sender}`}>
                {sConversationKey === oMessage.sender
                  ? renderGroupMessage(oMessage)
                  : sUserKey === oMessage.sender
                    ? renderMyMessage(oMessage)
                    : renderMessageOtherSender(oMessage)}
              </View>
            ))
          ) : (
            <View>
              <Text
                style={[
                  oStyles.textCenter,
                  oStyles.textGray,
                  oStyles.pd10,
                  oStyles.fontBold,
                ]}
              >
                Start a conversation
              </Text>
            </View>
          )}
        </ScrollView>
        {renderInput()}
      </View>
    );
  };

  const renderGroupMessage = (oMessage) => {
    return (
      <View style={[oStyles.mgB10, { justifyContent: "center" }]}>
        <View style={[oStyles.pdB10]}>
          <View
            style={{
              borderRadius: 100,
              backgroundColor: GreenFitrecColor,
              padding: 5,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            {renderMessage(oMessage, "#EFEFEF")}
          </View>
        </View>
      </View>
    );
  };

  const renderMessageOtherSender = (oMessage) => {
    return (
      <View style={[oStyles.row, oStyles.mgB10, oStyles.leftAlign]}>
        <Pressable
          activeOpacity={1}
          onPress={() => viewProfile(oMessage.sender)}
        >
          {getImageUser(oMessage.sender) ? (
            <FastImage
              style={oStyles.userImage}
              source={{
                uri: getImageUser(oMessage.sender),
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image style={oStyles.userImage} source={UserImageDefault} />
          )}
        </Pressable>
        <View
          style={[oStyles.w78, oStyles.containerMessageLeft, oStyles.pdB10]}
        >
          <View
            style={[
              GlobalMessages.containerMessageRight,
              {
                borderRadius:
                  oMessage.type === SEND_MESSAGE_TYPES.GIF && oMessage.isSticker
                    ? 1000
                    : 20,
              },
              oMessage.type === SEND_MESSAGE_TYPES.GIF && {
                borderColor: "white",
              },
              oMessage.isSticker !== undefined &&
              !oMessage.isSticker && { backgroundColor: "none" },
            ]}
          >
            {renderMessage(oMessage)}
          </View>
          <View style={[oStyles.row, oStyles.pdT5, { width: "100%" }]}>
            <View
              style={[
                oStyles.row,
                oStyles.middleFlex,
                { justifyContent: "flex-start" },
              ]}
            >
              <Icon
                name="person-circle-outline"
                size={16}
                color={GreenFitrecColor}
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: GreenFitrecColor }}>
                {getNameUser(oMessage.sender)}
              </Text>
            </View>
            <View
              style={[
                oStyles.row,
                oStyles.middleFlex,
                { justifyContent: "flex-end" },
              ]}
            >
              <Icon
                name="time"
                size={16}
                color={PlaceholderColor}
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: PlaceholderColor }}>
                {moment(oMessage.date).format("MMM DD LT")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderMyMessage = (oMessage) => {
    const { key: sUserKey, image: sUserImage } = session.account;
    return (
      <View style={[oStyles.row, oStyles.mgB10, oStyles.rigthAlign]}>
        <View
          style={[oStyles.w78, oStyles.containerMessageRight, oStyles.pdB10]}
        >
          <View
            style={[
              GlobalMessages.containerMessage,
              {
                borderRadius:
                  oMessage.type === SEND_MESSAGE_TYPES.GIF && oMessage.isSticker
                    ? 1000
                    : 20,
              },
              oMessage.type === SEND_MESSAGE_TYPES.GIF && {
                borderColor: "white",
              },
              oMessage.isSticker !== undefined &&
              !oMessage.isSticker && { backgroundColor: "none" },
            ]}
          >
            {renderMessage(oMessage, "#6f6f6f")}
          </View>
          <View style={[oStyles.row, oStyles.pdT5]}>
            <Icon
              name="md-time"
              size={16}
              color={PlaceholderColor}
              style={oStyles.mgR5}
            />
            <Text style={oStyles.textGray}>
              {moment(oMessage.date).format("MMM DD LT")}
            </Text>
          </View>
        </View>
        {sUserImage ? (
          <FastImage
            style={oStyles.userImage}
            source={{
              uri: sUserImage,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image style={oStyles.userImage} source={UserImageDefault} />
        )}
      </View>
    );
  };

  const renderMessage = (oMessage, sColorText = WhiteColor) => {
    return (
      <>
        {SEND_MESSAGE_TYPES.IMAGE === oMessage.type && (
          <Pressable onPress={() => expandImage(oMessage.message)}>
            <FastImage
              style={[oStyles.height200, oStyles.borderRadius10]}
              source={{
                uri: oMessage.message,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Pressable>
        )}
        {SEND_MESSAGE_TYPES.GIF === oMessage.type && (
          <Pressable onPress={() => expandImage(oMessage.message)}>
            <View style={{ alignItems: "center" }}>
              <FastImage
                style={[GlobalStyles.gifImage, oStyles.borderRadius10]}
                source={{
                  uri: oMessage.message,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <Image
              style={GlobalStyles.giphyLogoPositionRight}
              source={GiphyLogo}
            />
          </Pressable>
        )}
        {SEND_MESSAGE_TYPES.TEXT === oMessage.type && (
          <Text style={{ color: sColorText }}>{oMessage.message}</Text>
        )}
        {SEND_MESSAGE_TYPES.LOCATION === oMessage.type && (
          <MapView
            provider={props.provider}
            style={[
              { width: "100%" },
              oStyles.height200,
              oStyles.borderRadius10,
            ]}
            initialRegion={{
              latitude: oMessage.lat,
              longitude: oMessage.lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.1,
            }}
          >
            <Marker
              key={1}
              coordinate={{
                latitude: oMessage.lat,
                longitude: oMessage.lon,
              }}
              pinColor="#FF0000"
            />
          </MapView>
        )}
      </>
    );
  };

  const renderInput = () => {
    return (
      <View
        style={[oStyles.viewWriteMessage, { paddingBottom: keyboardPadding }]}
      >
        {!showKeyboard ||
          (showKeyboard && text === "") ||
          showMoreOptions ? (
          <View
            style={[
              oStyles.row,
              oStyles.alignCenter,
              { width: showMoreOptions ? "28%" : "20%" },
            ]}
          >
            <Pressable
              onPress={() => handlePressOptions("showOptionImage")}
              style={oStyles.pdT2}
            >
              <Icon name="camera" size={32} />
            </Pressable>
            <Pressable
              onPress={showMapHandler}
              style={oStyles.viewWriteMessageIconMap}
            >
              <Icon name="location-sharp" size={24} />
            </Pressable>
            <Pressable
              onPress={() => handlePressOptions("showGifsModal")}
              style={oStyles.viewWriteMessageIconMap}
            >
              <Image source={GifIcon} style={{ width: 30, height: 30 }} />
            </Pressable>
            {showMoreOptions && (
              <Pressable
                activeOpacity={1}
                onPress={() => setShowMoreOptions(false)}
                style={oStyles.viewWriteMessageIconDismissMore}
              >
                <Icon name="chevron-back-circle-outline" size={32} />
              </Pressable>
            )}
          </View>
        ) : (
          <View style={[oStyles.row, oStyles.alignCenter, { width: "8%" }]}>
            <Pressable
              activeOpacity={1}
              onPress={() => setShowMoreOptions(true)}
              style={oStyles.pdT2}
            >
              <Icon name="chevron-forward-circle-outline" size={32} />
            </Pressable>
          </View>
        )}
        <View
          style={{
            marginLeft: "2%",
            width: showKeyboard
              ? text === ""
                ? "65%"
                : !showMoreOptions
                  ? "77%"
                  : "57%"
              : "65%",
          }}
        >
          <TextInput
            placeholder="Type your message"
            placeholderTextColor={PlaceholderColor}
            onFocus={handleFocusSearch}
            style={oStyles.viewWriteMessageTextInput}
            multiline={true}
            value={text}
            onChangeText={(text) => {
              setText(text);
              setShowMoreOptions(showMoreOptions && text === "" ? false : showMoreOptions);
            }
            }
          />
        </View>
        <View style={oStyles.w15}>
          <Pressable onPress={() => sendMessage()}>
            <Text style={oStyles.font18}>Send</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderQuestions = () => {
    return (
      <>
        {/* // Modal that shows the gifs to send */}
        <ModalGifs
          bShow={showGifsModal}
          bShowStickers={showGifsStickers}
          search={search}
          fSearch={() => dispatch(actionGetGiphy(search))}
          fUpdateSearch={(text) => handleChangeSearch(text)}
          fClean={() => handleCleanSearch(SEND_MESSAGE_TYPES.GIF)}
          fClose={() => {
            resetState();
          }}
          fActionSelect={(oGif) =>
            sendMessage(SEND_MESSAGE_TYPES.GIF, oGif)
          }
          fChangeType={() => setShowGifsStickers(!showGifsStickers)}
          aGifs={oGiphyProps.gifs}
          aStickers={oGiphyProps.stickers}
        />
        {/* // Modal where the user takes the decision of what image to send */}
        <ToastQuestion
          visible={showOptionImage}
          functionCamera={() => addImage(OPTION_CAMERA)}
          functionGallery={() => addImage()}
          close={() => setShowOptionImage(false)}
        />
        {/* // Modal where the user takes the decision of what image to send */}
        {showMap && (
          <View
            style={[
              GlobalModal.viewContent,
              { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            ]}
          >
            <ScrollView>
              <MapView
                provider={props.provider}
                style={{ height: 300, width: "100%", marginTop: 20 }}
                onPress={(e) => setMarker(e.nativeEvent.coordinate)}
                initialRegion={locationInital}
              >
                {null !== marker && (
                  <Marker key={1} coordinate={marker} pinColor="#FF0000" />
                )}
              </MapView>
              <View style={[oStyles.viewSection, oStyles.viewSectionButtons]}>
                <View style={[oStyles.w50, oStyles.alignCenter]}>
                  <Pressable
                    onPress={() => {
                      setShowMap(false);
                      setMarker(null);
                    }
                    }
                    style={[
                      oStyles.button,
                      { backgroundColor: GreenFitrecColor },
                    ]}
                  >
                    <Text style={[oStyles.textButton, oStyles.font18]}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={[oStyles.w50, oStyles.alignCenter]}>
                  <Pressable
                    onPress={() =>
                      sendMessage(SEND_MESSAGE_TYPES.LOCATION)
                    }
                    style={[oStyles.button, { backgroundColor: SignUpColor }]}
                  >
                    <Text style={[oStyles.textButton, oStyles.font18]}>
                      Send
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </>
    );
  };


  const { oConversation } = oMessageProps;

  return (
    <>
      {oConversation ? (
        <>
          {showPeople ? (
            renderPeople()
          ) : (
            <>
              {renderMessages()}
              {renderQuestions()}
            </>
          )}
        </>
      ) : (
        <View></View>
      )}
    </>
  );

}

const oStyles = StyleSheet.create({
  container: {
    backgroundColor: WhiteColor,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  row: {
    flexDirection: "row",
  },
  rigthAlign: {
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  leftAlign: {
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  textCenter: {
    textAlign: "center",
  },
  textGray: {
    color: PlaceholderColor,
  },
  mgR5: {
    marginRight: 5,
  },
  mgB10: {
    marginBottom: 10,
  },
  pdT5: {
    paddingTop: 5,
  },
  pdT2: {
    paddingTop: 2,
  },
  pd10: {
    padding: 10,
  },
  pdB10: {
    paddingBottom: 10,
  },
  w78: {
    width: "78%",
  },
  w50: {
    width: "50%",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 1000,
  },
  containerMessageLeft: {
    paddingLeft: "1%",
  },
  containerMessageRight: {
    paddingRight: "1%",
  },
  viewWriteMessage: {
    borderTopWidth: 1,
    flexDirection: "row",
    padding: 5,
    marginBottom: Platform.OS === "android" ? 0 : 10,
    alignItems: "center",
    width: "100%",
    borderTopColor: PlaceholderColor,
  },
  viewWriteMessageTextInput: {
    marginRight: 40,
    width: "100%",
    paddingStart: 10,
    paddingEnd: 10,
    fontSize: 16,
    color: GreenFitrecColor,
  },
  w15: {
    width: "15%",
  },
  font18: {
    fontSize: 18,
  },
  fontBold: {
    fontWeight: "bold",
  },
  viewSectionButtons: {
    flexDirection: "row",
    borderBottomWidth: 0,
    marginTop: 20,
  },
  alignCenter: {
    alignItems: "center",
  },
  button: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: WhiteColor,
    fontWeight: "bold",
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  borderRadius10: {
    borderRadius: 10,
  },
  height200: {
    height: 200,
  },
  middleFlex: {
    flex: 6,
  },
  containerText: {
    alignSelf: "center",
    marginTop: 15,
  },
  textPeople: {
    fontSize: 24,
    color: GreenFitrecColor,
  },
  rowText: {
    justifyContent: "center",
    marginLeft: 10,
    width: "70%",
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  oMessageProps: state.reducerMessages,
  oGiphyProps: state.reducerGiphy,
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (
    oSender,
    sMessage,
    sType,
    sFriendKey,
    sConversationKey,
    oData
  ) => {
    dispatch(
      actionSendMessage(
        oSender,
        sMessage,
        sType,
        sFriendKey,
        sConversationKey,
        oData
      )
    );
  },
  sendMessageGroup: (oSender, sMessage, sType, sConversationKey, oData) => {
    dispatch(
      actionSendMessageChatGroup(
        oSender,
        sMessage,
        sType,
        sConversationKey,
        oData
      )
    );
  },
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  cleanMessages: () => {
    dispatch(actionGetMessages());
  },
  expandImage: (image) => {
    dispatch(actionExpandImage(image));
  },
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
  },
  getGiphy: (sFilter) => {
    dispatch(actionGetGiphy(sFilter));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
