import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  FlatList,
  Keyboard,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  GlobalModal,
  SignUpColor,
  PlaceholderColor,
  GreenFitrecColor,
  WhiteColor,
  GlobalStyles,
  GlobalMessages,
} from "../../Styles";
import { Image } from "react-native";
import { ToastQuestion } from "../shared/ToastQuestion";
import ImagePicker from "react-native-image-crop-picker";
// Complemento anterior - Leandro Curbelo
// import ImagePicker from 'react-native-image-picker';
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import {
  actionSendMessage,
  actionGetGiphy,
} from "../../redux/actions/ChatActions";
import { Toast } from "../shared/Toast";
import Geolocation from "@react-native-community/geolocation";
import MapView, { Marker } from "react-native-maps";
import FastImage from "react-native-fast-image";
import GifIcon from "../../assets/gif.png";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import {
  MESSAGE_ERROR,
  OPTIONS_GEOLOCATION_GET_POSITION,
  OPTIONS_IMAGE_CROP_CONVERSATION,
  SEND_MESSAGE_TYPES,
} from "../../Constants";
import { ModalGifs } from "../shared/ModalGifs";
import { actionExpandImage } from "../../redux/actions/SharedActions";
import GiphyLogo from "../../assets/giphyLogo.png";

const Conversation = (props) => {

  const scrollView = useRef();

  const session = useSelector((state) => state.reducerSession);
  const chatProps = useSelector((state) => state.reducerChat);
  const giphyProps = useSelector((state) => state.reducerGiphy);

  const dispatch = useDispatch();

  const [locationInital, setLocationInital] = useState({
    latitude: 40.5879479,
    longitude: -109.405,
  });
  const [showPhoto, setShowPhoto] = useState(false);
  const [sText, setSText] = useState("");
  const [toastText, setToastText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [oMarker, setOMarker] = useState(null);
  const [keyboardOffset, setkeyboardOffset] = useState(0);
  const [showKeyboard, setshowKeyboard] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showGiphy, setShowGiphy] = useState(false);
  const [bShowGifsStickers, setBShowGifsStickers] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [sImageSend, setSImageSend] = useState("");


  useEffect(() => {
    if (
      !loadingImage &&
      loading &&
      chatProps.statusSend
    ) {
      setShowConversation(false);
      showToast("Message sent successfully");
    }
    if (loadingImage && chatProps.statusSendImage) {
      setLoadingImage(false);
      showToast("Image sent successfully");
    }
    setLoading(false);
    setRefresh(!refresh);
  }, [chatProps]);

  const sendMessage = (sType = SEND_MESSAGE_TYPES.TEXT, oGif = null) => {
    const { sText, sImageSend, oMarker, bShowGifsStickers } = state;
    const { key: sUserKey, name: sUserName } = session.account;
    let sMessage = "",
      oData = null;
    switch (sType) {
      case SEND_MESSAGE_TYPES.TEXT:
      default:
        sMessage = sText.trim();
        if (sMessage === "") return;
        break;
      case SEND_MESSAGE_TYPES.IMAGE:
        sMessage = sImageSend;
        break;
      case SEND_MESSAGE_TYPES.LOCATION:
        if (oMarker === null)
          return showToast("The marker cannot be empty");
        oData = {
          lat: oMarker.latitude,
          lon: oMarker.longitude,
        };
        break;
      case SEND_MESSAGE_TYPES.GIF:
        sMessage = oGif.image;
        oData = {
          height: oGif.height,
          width: oGif.width,
          giphyId: oGif.id,
          isSticker: bShowGifsStickers,
        };
        dispatch(actionGetGiphy(""));
        break;
    }
    const { conversation: oConversation } = props;
    const oSender = {
      key: sUserKey,
      name: sUserName,
    },
      sConversationKey = oConversation.conversation;
    const sFriendKey = oConversation.userFriendKey;
    dispatch(
      actionSendMessage(
        oSender,
        sMessage,
        sType,
        sFriendKey,
        sConversationKey,
        oData,
        true
      )
    );
    setSText("");
    setOMarker(null);
    setShowMap(false);
    setSImageSend("");
    setShowGiphy(false);
    setBShowGifsStickers(false);
    setSearch("");
  };

  addImage = (sType) => {
    setShowPhoto(false);
    setLoadingImage(true);
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_CONVERSATION)
        .then((oImage) => {
          var sImageB64 = oImage.data;
          setSImageSend(sImageB64);
          sendMessage("image");
        })
        .catch((oError) => {
          if (oError.message == "Permission denied")
            showToast(
              "Permission denied, please check FitRec permissions"
            );
          else showToast(MESSAGE_ERROR);
        })
        .finally(() => {
          setShowPhoto(false);
          setLoadingImage(false);
        });
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_CONVERSATION)
        .then((oImage) => {
          var sImageB64 = oImage.data;
          setSImageSend(sImageB64);
          sendMessage("image");
        })
        .catch((oError) => {
          if (oError.message == "Permission denied")
            showToast(
              "Permission denied, please check FitRec permissions"
            );
          else showToast(MESSAGE_ERROR);
        })
        .finally(() => {
          setShowPhoto(false);
          setLoadingImage(false);
        });
    }
  };

  const showToast = (text, callback = null) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  const showMaphandler = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && undefined !== position.coords) {
          setLocationInital({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.1,
          });
          setOMarker({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          setShowMap(true);
        }
      },
      (error) => {
        setShowMap(true);
      },
      OPTIONS_GEOLOCATION_GET_POSITION
    );
  };

  const showGifs = () => {
    setShowGiphy(true);
    Keyboard.dismiss();
    dispatch(actionGetGiphy(""));
  };

  const closeGifs = () => {
    setShowGiphy(false);
    setBShowGifsStickers(false);
    setSearch("");
    Keyboard.dismiss();
  };

  const expandImage = (sUrlToImage) => {
    dispatch(actionExpandImage(sUrlToImage));
  };

  return (
    props.visible &&
    props.conversation && (
      <View style={GlobalModal.viewContent}>
        <View style={GlobalModal.viewHead}>
          {/*OPTION COMMENTED FOR NEW VERSION
                        <Pressable style={[GlobalModal.buttonLeft, { flexDirection: 'row' }]}
                            onPress={props.close}>
                            <Icon name="ios-trash" color={SignUpColor} size={22} />
                            <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>Empty</Text>
                        </Pressable>
                        */}
          <Text style={GlobalModal.headTitle}>
            {props.conversation.userFriend}
          </Text>
          <Pressable
            style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
            onPress={props.close}
          >
            <Icon name="md-close" color={SignUpColor} size={22} />
            <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
              Close
            </Text>
          </Pressable>
        </View>
        <ScrollView
          style={{ margin: 10 }}
          ref={scrollView}
          onContentSizeChange={() => {
            if (null !== scrollView && undefined !== scrollView)
              scrollView.current.scrollToEnd({ animated: true });
          }}
        >
          <FlatList
            data={props.conversation.conversations}
            keyExtractor={(item, index) => index.toString()}
            extraData={refresh}
            renderItem={({ item }) => {
              if (item.sender === session.account.key)
                return (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginBottom: 10,
                      }}
                    >
                      <View style={{ width: "80%", paddingRight: 8 }}>
                        <View style={GlobalMessages.containerMessage}>
                          {"image" === item.type && (
                            <Pressable
                              onPress={() => expandImage(item.message)}
                            >
                              <FastImage
                                style={{ height: 200 }}
                                source={{
                                  uri: item.message,
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </Pressable>
                          )}
                          {"gif" === item.type && (
                            <Pressable
                              onPress={() => expandImage(item.message)}
                            >
                              <View style={{ alignItems: "center" }}>
                                <FastImage
                                  style={GlobalStyles.gifImage}
                                  source={{
                                    uri: item.message,
                                    priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              </View>
                              <Image
                                style={GlobalStyles.giphyLogoPositionRight}
                                source={GiphyLogo}
                              />
                            </Pressable>
                          )}
                          {"text" === item.type && (
                            <Text style={{ color: "#6f6f6f" }}>
                              {item.message}
                            </Text>
                          )}
                          {"location" === item.type && (
                            <MapView
                              provider={props.provider}
                              style={{ height: 200, width: "100%" }}
                              initialRegion={{
                                latitude: item.lat,
                                longitude: item.lon,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.1,
                              }}
                            >
                              <Marker
                                key={1}
                                coordinate={{
                                  latitude: item.lat,
                                  longitude: item.lon,
                                }}
                                pinColor="#FF0000"
                              />
                            </MapView>
                          )}
                        </View>
                        <View
                          style={{
                            width: "100%",
                            justifyContent: "flex-start",
                            flexDirection: "row",
                            paddingTop: 5,
                          }}
                        >
                          <Icon
                            name="md-time"
                            size={16}
                            color={PlaceholderColor}
                            style={{ marginRight: 5 }}
                          />
                          <Text style={{ color: PlaceholderColor }}>
                            {moment(item.date).format("MMM DD LT")}
                          </Text>
                        </View>
                        <Icon
                          name="caret-forward"
                          size={32}
                          color="#e0e2e4"
                          style={{ position: "absolute", right: -8, top: 10 }}
                        />
                      </View>
                      {null !== props.conversation.myProfilePic &&
                        undefined !== props.conversation.myProfilePic &&
                        "" !== props.conversation.myProfilePic ? (
                        <FastImage
                          style={chatStyles.viewMessageItemImageProfile}
                          source={{
                            uri: props.conversation.myProfilePic,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      ) : (
                        <Image
                          style={chatStyles.viewMessageItemImageProfile}
                          source={require("../../assets/imgProfileReadOnly2.png")}
                        />
                      )}
                    </View>
                  </View>
                );
              else
                return (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginBottom: 10,
                      }}
                    >
                      <Pressable onPress={() => props.viewProfile(item)}>
                        {null !== props.conversation.image &&
                          undefined !== props.conversation.image &&
                          "" !== props.conversation.image ? (
                          <FastImage
                            style={chatStyles.viewMessageItemImageProfile}
                            source={{
                              uri: props.conversation.image,
                              priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <Image
                            style={chatStyles.viewMessageItemImageProfile}
                            source={require("../../assets/imgProfileReadOnly.png")}
                          />
                        )}
                      </Pressable>
                      <View style={{ width: "80%", paddingLeft: 8 }}>
                        <Icon
                          name="caret-back"
                          size={32}
                          color="#37892c"
                          style={{ position: "absolute", left: -8, top: 10 }}
                        />
                        <View
                          style={{
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5,
                            backgroundColor: "#4eaa41",
                            borderColor: "#4eaa41",
                          }}
                        >
                          {"image" === item.type && (
                            <Pressable
                              onPress={() => expandImage(item.message)}
                            >
                              <FastImage
                                style={{ height: 200 }}
                                source={{
                                  uri: item.message,
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </Pressable>
                          )}
                          {"gif" === item.type && (
                            <Pressable
                              onPress={() => expandImage(item.message)}
                            >
                              <View style={{ alignItems: "center" }}>
                                <FastImage
                                  style={GlobalStyles.gifImage}
                                  source={{
                                    uri: item.message,
                                    priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              </View>
                              <Image
                                style={GlobalStyles.giphyLogoPositionLeft}
                                source={GiphyLogo}
                              />
                            </Pressable>
                          )}
                          {"text" === item.type && (
                            <Text style={{ color: "white" }}>
                              {item.message}
                            </Text>
                          )}
                          {"location" === item.type && (
                            <MapView
                              provider={props.provider}
                              style={{ height: 200, width: "100%" }}
                              initialRegion={{
                                latitude: item.lat,
                                longitude: item.lon,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.1,
                              }}
                            >
                              <Marker
                                key={1}
                                coordinate={{
                                  latitude: item.lat,
                                  longitude: item.lon,
                                }}
                                pinColor="#FF0000"
                              />
                            </MapView>
                          )}
                        </View>
                        <View
                          style={{
                            width: "100%",
                            justifyContent: "flex-end",
                            flexDirection: "row",
                            paddingTop: 5,
                          }}
                        >
                          <Icon
                            name="time"
                            size={16}
                            color={PlaceholderColor}
                            style={{ marginRight: 5 }}
                          />
                          <Text style={{ color: PlaceholderColor }}>
                            {moment(item.date).format("MMM DD LT")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
            }}
          />
        </ScrollView>
        <View
          style={styles.viewWriteMessage}
        >
          {!showKeyboard ||
            (showKeyboard && sText === "") ||
            showMoreOptions ? (
            <View
              style={[
                styles.viewWriteMessageIcons,
                showMoreOptions ? { width: "28%" } : {},
              ]}
            >
              <Pressable
                onPress={() => {
                  setShowPhoto(true);
                  Keyboard.dismiss();
                }}
                style={styles.viewWriteMessageIconCamera}
              >
                <Icon name="camera" size={32} />
              </Pressable>
              <Pressable
                onPress={() => {
                  showMaphandler();
                  Keyboard.dismiss();
                }}
                style={styles.viewWriteMessageIconMap}
              >
                <Icon name="location-sharp" size={24} />
              </Pressable>
              <Pressable
                onPress={() => showGifs()}
                style={styles.viewWriteMessageIconMap}
              >
                <Image source={GifIcon} style={{ width: 30, height: 30 }} />
              </Pressable>
              {showMoreOptions && (
                <Pressable
                  onPress={() => setShowMoreOptions(false)}
                  style={styles.viewWriteMessageIconDismissMore}
                >
                  <Icon name="chevron-back-circle-outline" size={32} />
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.viewWriteMessageIconsMore}>
              <Pressable
                onPress={() => setShowMoreOptions(true)}
                style={styles.viewWriteMessageIconCamera}
              >
                <Icon name="chevron-forward-circle-outline" size={32} />
              </Pressable>
            </View>
          )}
          <View
            style={[
              styles.viewWriteMessageViewTextInput,
              showKeyboard
                ? sText === ""
                  ? {}
                  : !showMoreOptions
                    ? { width: "77%" }
                    : { width: "57%" }
                : {},
            ]}
          >
            <TextInput
              placeholder="Type your message"
              placeholderTextColor={PlaceholderColor}
              style={styles.viewWriteMessageTextInput}
              multiline={true}
              value={sText}
              onChangeText={(text) => {
                setSText(text);
                setShowMoreOptions(
                  showMoreOptions && text === ""
                    ? false
                    : showMoreOptions);

              }}
            />
          </View>
          <View style={styles.viewWriteMessageSend}>
            <Pressable onPress={() => sendMessage("text")}>
              <Text style={styles.viewWriteMessageSendText}>Send</Text>
            </Pressable>
          </View>
        </View>
        <ToastQuestion
          visible={showPhoto}
          functionCamera={() => addImage("camera")}
          functionGallery={() => addImage("gallery")}
        />
        <Toast toastText={toastText} />
        {showMap && (
          <View style={GlobalModal.viewContent}>
            <View style={GlobalModal.viewHead}>
              <Text style={GlobalModal.headTitle}></Text>
            </View>
            <ScrollView>
              <MapView
                provider={props.provider}
                style={{ height: 300, width: "100%" }}
                onPress={(e) => setOMarker(e.nativeEvent.coordinate)}
                initialRegion={locationInital}
              >
                {null !== oMarker && (
                  <Marker
                    key={1}
                    coordinate={oMarker}
                    pinColor="#FF0000"
                  />
                )}
              </MapView>
              <View style={[styles.viewSection, styles.viewSectionButtons]}>
                <View style={styles.viewButton}>
                  <Pressable
                    onPress={() => {
                      setShowMap(false);
                      setOMarker(null);
                    }}
                    style={[
                      styles.button,
                      { backgroundColor: GreenFitrecColor },
                    ]}
                  >
                    <Text style={styles.textButton}>Cancel</Text>
                  </Pressable>
                </View>
                <View style={styles.viewButton}>
                  <Pressable
                    onPress={() => sendMessage("location")}
                    style={[styles.button, { backgroundColor: SignUpColor }]}
                  >
                    <Text style={styles.textButton}>Send</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        <ModalGifs
          bShow={showGiphy}
          bShowStickers={bShowGifsStickers}
          sSearch={search}
          fSearch={() => dispatch(actionGetGiphy(search))}
          fUpdateSearch={(text) => {
            setSearch(text);
          }}
          fClean={() => {
            setSearch("");
            dispatch(actionGetGiphy(""));
          }}
          fActionSelect={(oGif) => {
            sendMessage(SEND_MESSAGE_TYPES.GIF, oGif);
          }}
          fChangeType={() => {
            setBShowGifsStickers(!bShowGifsStickers);
          }}
          fClose={() => closeGifs()}
          aGifs={giphyProps.gifs}
          aStickers={giphyProps.stickers}
        />
        <LoadingSpinner
          visible={loading || loadingImage}
        />
      </View>
    )
  );
}

export const chatStyles = StyleSheet.create({
  viewMessageItemImageProfile: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
});

export const styles = StyleSheet.create({
  viewWriteMessage: {
    borderTopWidth: 1,
    flexDirection: "row",
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: Platform.OS === "android" ? 0 : 10,
    alignItems: "center",
    width: "100%",
    borderTopColor: PlaceholderColor,
    paddingBottom: 10,
  },
  viewWriteMessageIcons: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
  },
  viewWriteMessageIconsMore: {
    width: "8%",
    flexDirection: "row",
    alignItems: "center",
  },
  viewWriteMessageIconCamera: {
    paddingTop: 2,
  },
  viewWriteMessageIconMap: {
    padding: 0,
    margin: 0,
  },
  viewWriteMessageIconDismissMore: {
    padding: 0,
    margin: 0,
  },
  viewWriteMessageViewTextInput: {
    width: "65%",
  },
  viewWriteMessageTextInput: {
    marginRight: 40,
    width: "100%",
    paddingStart: 10,
    paddingEnd: 10,
    fontSize: 16,
    color: GreenFitrecColor,
  },
  viewWriteMessageSend: {
    width: "15%",
  },
  viewWriteMessageSendText: {
    fontSize: 18,
  },
  viewSectionButtons: {
    flexDirection: "row",
    borderBottomWidth: 0,
    marginTop: 20,
  },
  viewButton: {
    width: "50%",
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
    fontSize: 18,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  chatProps: state.reducerChat,
  giphyProps: state.reducerGiphy,
});


export default Conversation;
