import React, { Component } from "react";
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
import { connect } from "react-redux";
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

class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhoto: false,
      sText: "",
      toastText: "",
      refresh: false,
      locationInital: {
        latitude: 40.5879479,
        longitude: -109.405,
      },
      showMap: false,
      oMarker: null,
      keyboardOffset: 0,
      keyboardHeight: "100%",
      showKeyboard: false,
      showMoreOptions: false,
      showGiphy: false,
      bShowGifsStickers: false,
      search: "",
      loadingImage: false,
    };

    this.getKeyboardOffsetStyle = this.getKeyboardOffsetStyle.bind(this);
    this.handleKeyboardShow = this.handleKeyboardShow.bind(this);
    this.handleKeyboardHide = this.handleKeyboardHide.bind(this);

    Keyboard.addListener("keyboardDidShow", this.handleKeyboardShow);
    Keyboard.addListener("keyboardWillShow", this.handleKeyboardShow);
    Keyboard.addListener("keyboardWillHide", this.handleKeyboardHide);
    Keyboard.addListener("keyboardDidHide", this.handleKeyboardHide);
  }

  handleKeyboardShow = async ({ endCoordinates: { height } }) => {
    await this.setState({ keyboardOffset: height, showKeyboard: true });
    if (null !== this.scrollView && undefined !== this.scrollView)
      this.scrollView.scrollToEnd({ animated: true });
  };

  handleKeyboardHide = async () => {
    await this.setState({
      keyboardOffset: 0,
      showKeyboard: false,
      showMoreOptions: false,
    });
    if (null !== this.scrollView && undefined !== this.scrollView)
      this.scrollView.scrollToEnd({ animated: true });
  };

  getKeyboardOffsetStyle() {
    const { keyboardOffset } = this.state;
    return Platform.select({
      ios: () => ({ paddingBottom: keyboardOffset }),
      android: () => ({}),
    })();
  }

  componentWillReceiveProps = async (nextProps) => {
    if (
      !this.state.loadingImage &&
      this.state.loading &&
      nextProps.chatProps.statusSend
    ) {
      await this.setState({
        showConversation: false,
      });
      this.showToast("Message sent successfully");
    }
    if (this.state.loadingImage && nextProps.chatProps.statusSendImage) {
      await this.setState({
        loadingImage: false,
      });
      this.showToast("Image sent successfully");
    }
    await this.setState({
      loading: false,
      refresh: !this.state.refresh,
    });
  };

  sendMessage = async (sType = SEND_MESSAGE_TYPES.TEXT, oGif = null) => {
    const { sText, sImageSend, oMarker, bShowGifsStickers } = this.state;
    const { key: sUserKey, name: sUserName } = this.props.session.account;
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
          return this.showToast("The marker cannot be empty");
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
        this.props.getGiphy("");
        break;
    }
    const { conversation: oConversation } = this.props;
    const oSender = {
      key: sUserKey,
      name: sUserName,
    },
      sConversationKey = oConversation.conversation;
    const sFriendKey = oConversation.userFriendKey;
    this.props.sendMessage(
      oSender,
      sMessage,
      sType,
      sFriendKey,
      sConversationKey,
      oData,
      true
    );
    await this.setState({
      sText: "",
      oMarker: null,
      showMap: false,
      sImageSend: "",
      showGiphy: false,
      bShowGifsStickers: false,
      search: "",
    });
  };

  addImage = async (sType) => {
    await this.setState({
      showPhoto: false,
      loadingImage: true,
    });
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_CONVERSATION)
        .then(async (oImage) => {
          var sImageB64 = oImage.data;
          await this.setState({
            sImageSend: sImageB64,
          });
          this.sendMessage("image");
        })
        .catch((oError) => {
          if (oError.message == "Permission denied")
            this.showToast(
              "Permission denied, please check FitRec permissions"
            );
          else this.showToast(MESSAGE_ERROR);
        })
        .finally(() => {
          this.setState({
            showPhoto: false,
            loadingImage: false,
          });
        });
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_CONVERSATION)
        .then(async (oImage) => {
          var sImageB64 = oImage.data;
          await this.setState({
            sImageSend: sImageB64,
          });
          this.sendMessage("image");
        })
        .catch((oError) => {
          if (oError.message == "Permission denied")
            this.showToast(
              "Permission denied, please check FitRec permissions"
            );
          else this.showToast(MESSAGE_ERROR);
        })
        .finally(() => {
          this.setState({
            showPhoto: false,
            loadingImage: false,
          });
        });
    }
  };

  showToast = async (sText, callback = null) => {
    await this.setState({
      toastText: sText,
      loading: false,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  showMap = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && undefined !== position.coords) {
          this.setState({
            locationInital: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.1,
            },
            oMarker: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
            showMap: true,
          });
        }
      },
      (error) => {
        this.setState({
          showMap: true,
        });
      },
      OPTIONS_GEOLOCATION_GET_POSITION
    );
  };

  showGifs = () => {
    this.setState({ showGiphy: true });
    Keyboard.dismiss();
    this.props.getGiphy("");
  };

  closeGifs = () => {
    this.setState({
      showGiphy: false,
      bShowGifsStickers: false,
      search: "",
      keyboardOffset: 0,
    });
    Keyboard.dismiss();
  };

  expandImage = async (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  render() {
    return (
      this.props.visible &&
      this.props.conversation && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            {/*OPTION COMMENTED FOR NEW VERSION
                        <Pressable style={[GlobalModal.buttonLeft, { flexDirection: 'row' }]}
                            onPress={this.props.close}>
                            <Icon name="ios-trash" color={SignUpColor} size={22} />
                            <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>Empty</Text>
                        </Pressable>
                        */}
            <Text style={GlobalModal.headTitle}>
              {this.props.conversation.userFriend}
            </Text>
            <Pressable
              style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
              onPress={this.props.close}
            >
              <Icon name="md-close" color={SignUpColor} size={22} />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                Close
              </Text>
            </Pressable>
          </View>
          <ScrollView
            style={{ margin: 10 }}
            ref={(ref) => (this.scrollView = ref)}
            onContentSizeChange={() => {
              if (null !== this.scrollView && undefined !== this.scrollView)
                this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            <FlatList
              data={this.props.conversation.conversations}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state.refresh}
              renderItem={({ item }) => {
                if (item.sender === this.props.session.account.key)
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
                                onPress={() => this.expandImage(item.message)}
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
                                onPress={() => this.expandImage(item.message)}
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
                                provider={this.props.provider}
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
                        {null !== this.props.conversation.myProfilePic &&
                          undefined !== this.props.conversation.myProfilePic &&
                          "" !== this.props.conversation.myProfilePic ? (
                          <FastImage
                            style={chatStyles.viewMessageItemImageProfile}
                            source={{
                              uri: this.props.conversation.myProfilePic,
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
                        <Pressable
                          onPress={() => this.props.viewProfile(item)}
                        >
                          {null !== this.props.conversation.image &&
                            undefined !== this.props.conversation.image &&
                            "" !== this.props.conversation.image ? (
                            <FastImage
                              style={chatStyles.viewMessageItemImageProfile}
                              source={{
                                uri: this.props.conversation.image,
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
                                onPress={() => this.expandImage(item.message)}
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
                                onPress={() => this.expandImage(item.message)}
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
                                provider={this.props.provider}
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
            style={[styles.viewWriteMessage, this.getKeyboardOffsetStyle()]}
          >
            {!this.state.showKeyboard ||
              (this.state.showKeyboard && this.state.sText === "") ||
              this.state.showMoreOptions ? (
              <View
                style={[
                  styles.viewWriteMessageIcons,
                  this.state.showMoreOptions ? { width: "28%" } : {},
                ]}
              >
                <Pressable
                  onPress={() => {
                    this.setState({ showPhoto: true });
                    Keyboard.dismiss();
                  }}
                  style={styles.viewWriteMessageIconCamera}
                >
                  <Icon name="camera" size={32} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    this.showMap();
                    Keyboard.dismiss();
                  }}
                  style={styles.viewWriteMessageIconMap}
                >
                  <Icon name="location-sharp" size={24} />
                </Pressable>
                <Pressable
                  onPress={() => this.showGifs()}
                  style={styles.viewWriteMessageIconMap}
                >
                  <Image source={GifIcon} style={{ width: 30, height: 30 }} />
                </Pressable>
                {this.state.showMoreOptions && (
                  <Pressable
                    onPress={() => this.setState({ showMoreOptions: false })}
                    style={styles.viewWriteMessageIconDismissMore}
                  >
                    <Icon name="chevron-back-circle-outline" size={32} />
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={styles.viewWriteMessageIconsMore}>
                <Pressable
                  onPress={() => this.setState({ showMoreOptions: true })}
                  style={styles.viewWriteMessageIconCamera}
                >
                  <Icon name="chevron-forward-circle-outline" size={32} />
                </Pressable>
              </View>
            )}
            <View
              style={[
                styles.viewWriteMessageViewTextInput,
                this.state.showKeyboard
                  ? this.state.sText === ""
                    ? {}
                    : !this.state.showMoreOptions
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
                value={this.state.sText}
                onChangeText={(text) =>
                  this.setState({
                    sText: text,
                    showMoreOptions:
                      this.state.showMoreOptions && text === ""
                        ? false
                        : this.state.showMoreOptions,
                  })
                }
              />
            </View>
            <View style={styles.viewWriteMessageSend}>
              <Pressable onPress={() => this.sendMessage("text")}>
                <Text style={styles.viewWriteMessageSendText}>Send</Text>
              </Pressable>
            </View>
          </View>
          <ToastQuestion
            visible={this.state.showPhoto}
            functionCamera={() => this.addImage("camera")}
            functionGallery={() => this.addImage("gallery")}
          />
          <Toast toastText={this.state.toastText} />
          {this.state.showMap && (
            <View style={GlobalModal.viewContent}>
              <View style={GlobalModal.viewHead}>
                <Text style={GlobalModal.headTitle}></Text>
              </View>
              <ScrollView>
                <MapView
                  provider={this.props.provider}
                  style={{ height: 300, width: "100%" }}
                  onPress={(e) =>
                    this.setState({ oMarker: e.nativeEvent.coordinate })
                  }
                  initialRegion={this.state.locationInital}
                >
                  {null !== this.state.oMarker && (
                    <Marker
                      key={1}
                      coordinate={this.state.oMarker}
                      pinColor="#FF0000"
                    />
                  )}
                </MapView>
                <View style={[styles.viewSection, styles.viewSectionButtons]}>
                  <View style={styles.viewButton}>
                    <Pressable
                      onPress={() =>
                        this.setState({ showMap: false, oMarker: null })
                      }
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
                      onPress={() => this.sendMessage("location")}
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
            bShow={this.state.showGiphy}
            bShowStickers={this.state.bShowGifsStickers}
            sSearch={this.state.search}
            fSearch={() => this.props.getGiphy(this.state.search)}
            fUpdateSearch={(text) => {
              this.setState({ search: text });
            }}
            fClean={() => {
              this.setState({ search: "" });
              this.props.getGiphy("");
            }}
            fActionSelect={(oGif) => {
              this.sendMessage(SEND_MESSAGE_TYPES.GIF, oGif);
            }}
            fChangeType={() => {
              this.setState({
                bShowGifsStickers: !this.state.bShowGifsStickers,
              });
            }}
            fClose={() => this.closeGifs()}
            aGifs={this.props.giphyProps.gifs}
            aStickers={this.props.giphyProps.stickers}
          />
          <LoadingSpinner
            visible={this.state.loading || this.state.loadingImage}
          />
        </View>
      )
    );
  }
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

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (
    oSender,
    sMessage,
    sType,
    sFriendKey,
    sConversationKey,
    oData,
    bRefresh
  ) => {
    dispatch(
      actionSendMessage(
        oSender,
        sMessage,
        sType,
        sFriendKey,
        sConversationKey,
        oData,
        bRefresh
      )
    );
  },
  getGiphy: (data) => {
    dispatch(actionGetGiphy(data));
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
