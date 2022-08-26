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
} from "../../Styles";
import { Image } from "react-native";
import { ToastQuestion } from "../shared/ToastQuestion";
import { ListPeople } from "../shared/ListPeople";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";
import moment from "moment/min/moment-with-locales";
import {
  actionSendMessageChatGroup,
  actionGetGiphy,
} from "../../redux/actions/ChatActions";
import { Toast } from "../shared/Toast";
import Geolocation from "@react-native-community/geolocation";
import MapView, { Marker } from "react-native-maps";
import FastImage from "react-native-fast-image";
import GifIcon from "../../assets/gif.png";
import {
  MESSAGE_ERROR,
  OPTIONS_GEOLOCATION_GET_POSITION,
  OPTIONS_IMAGE_CROP_CONVERSATION,
} from "../../Constants";
import { ModalGifs } from "../shared/ModalGifs";
import { actionExpandImage } from "../../redux/actions/SharedActions";
import GiphyLogo from "../../assets/giphyLogo.png";

// Component for the group chat (among users), not the chat within a group
class GroupChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhoto: false,
      messageSend: "",
      toastText: "",
      refresh: false,
      locationInital: {
        latitude: 40.5879479,
        longitude: -109.405,
      },
      showMap: false,
      marker: null,
      keyboardOffset: 0,
      showKeyboard: false,
      showMoreOptions: false,
      showMembers: false,
      showGiphy: false,
      showGiphyStickers: false,
      search: "",
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
    if (this.state.loading && nextProps.chatProps.statusSend) {
      await this.setState({
        showConversation: false,
      });
      this.showToast("Message sent successfully");
    }
    await this.setState({
      loading: false,
      refresh: !this.state.refresh,
    });
  };

  sendMessage = async (sType) => {
    if ("location" === sType)
      if (null === this.state.marker) {
        this.showToast("The marker cannot be empty");
        return;
      }
    var sMessage = "";
    if (sType === "text") sMessage = this.state.messageSend.trim();
    if (sType === "image") sMessage = this.state.imageSend;
    if ("" !== sMessage || "location" === sType) {
      await this.setState({
        loading: true,
      });
      var oMessage = {
        sender: this.props.session.account.key,
        message: sMessage,
        date: Date.now(),
        type: undefined !== sType ? sType : "text",
      };
      if ("location" === oMessage.type) {
        oMessage.lat = this.state.marker.latitude;
        oMessage.lon = this.state.marker.longitude;
      }
      this.props.sendMessage({
        conversationId: this.props.conversation.conversation,
        message: oMessage,
        nameUser: this.props.session.account.name,
      });
      await this.setState({
        messageSend: "",
        marker: null,
        showMap: false,
        imageSend: "",
      });
    } else {
      await this.setState({
        messageSend: sMessage,
      });
      this.showToast("The message field cannot be empty");
    }
  };

  addImage = async (sType) => {
    await this.setState({
      showPhoto: false,
    });
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_CONVERSATION)
        .then(async (oImage) => {
          var sImageB64 = oImage.data;
          await this.setState({
            imageSend: sImageB64,
          });
          this.sendMessage("image");
        })
        .catch(() => {
          this.showToast(MESSAGE_ERROR);
        });
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_CONVERSATION)
        .then(async (oImage) => {
          var sImageB64 = oImage.data;
          await this.setState({
            imageSend: sImageB64,
          });
          this.sendMessage("image");
        })
        .catch(() => {
          this.showToast(MESSAGE_ERROR);
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
            marker: {
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

  sendGif = async (oGif) => {
    await this.setState({
      showGiphy: false,
      showGiphyStickers: false,
      search: "",
    });
    this.props.getGiphy("");
    var oMessage = {
      sender: this.props.session.account.key,
      message: oGif.image,
      height: +oGif.height,
      width: +oGif.width,
      date: Date.now(),
      giphyId: oGif.id,
      type: "gif",
    };
    this.props.sendMessage({
      conversationId: this.props.conversation.conversation,
      message: oMessage,
    });
  };

  expandImage = async (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  render() {
    return this.props.visible && this.props.conversation ? (
      !this.state.showMembers ? (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            <Pressable
              style={[GlobalModal.buttonLeft, { flexDirection: "row" }]}
              onPress={() => this.setState({ showMembers: true })}>
              <Icon
                name="people-circle-outline"
                color={SignUpColor}
                size={22}
              />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                People
              </Text>
            </Pressable>
            <Text style={GlobalModal.headTitle}>
              {this.props.conversation.name}
            </Text>
            <Pressable
              style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
              onPress={this.props.close}>
              <Icon name="close" color={SignUpColor} size={22} />
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
            }}>
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
                        }}>
                        <View style={{ width: "80%", paddingRight: 8 }}>
                          <View
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              borderRadius: 5,
                              backgroundColor: "#e0e2e4",
                              borderColor: "#e0e2e4",
                            }}>
                            {"image" === item.type && (
                              <Pressable
                                onPress={() => this.expandImage(item.message)}>
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
                                onPress={() => this.expandImage(item.message)}>
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
                                }}>
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
                            }}>
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
                        {this.props.conversation.users.filter(
                          (oUser) =>
                            oUser.key === item.sender && "" !== oUser.image
                        ).length > 0 ? (
                          <FastImage
                            style={chatStyles.viewMessageItemImageProfile}
                            source={{
                              uri: this.props.conversation.users.filter(
                                (oUser) => oUser.key === item.sender
                              )[0].image,
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
                        }}>
                        <Pressable onPress={() => this.props.viewProfile(item)}>
                          {this.props.conversation.users.filter(
                            (oUser) =>
                              oUser.key === item.sender && "" !== oUser.image
                          ).length > 0 ? (
                            <FastImage
                              style={chatStyles.viewMessageItemImageProfile}
                              source={{
                                uri: this.props.conversation.users.filter(
                                  (oUser) => oUser.key === item.sender
                                )[0].image,
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
                            }}>
                            {"image" === item.type && (
                              <Pressable
                                onPress={() => this.expandImage(item.message)}>
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
                                onPress={() => this.expandImage(item.message)}>
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
                                }}>
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
                              flexDirection: "row",
                              paddingTop: 5,
                            }}>
                            <View
                              style={{
                                flex: 6,
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}>
                              <Icon
                                name="person-circle-outline"
                                size={16}
                                color={GreenFitrecColor}
                                style={{ marginRight: 5 }}
                              />
                              <Text style={{ color: GreenFitrecColor }}>
                                {
                                  this.props.conversation.users.filter(
                                    (oUser) => oUser.key === item.sender
                                  )[0].name
                                }
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 6,
                                flexDirection: "row",
                                justifyContent: "flex-end",
                              }}>
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
                    </View>
                  );
              }}
            />
          </ScrollView>
          <View
            style={[styles.viewWriteMessage, this.getKeyboardOffsetStyle()]}>
            {!this.state.showKeyboard ||
            (this.state.showKeyboard && this.state.messageSend === "") ||
            this.state.showMoreOptions ? (
              <View
                style={[
                  styles.viewWriteMessageIcons,
                  this.state.showMoreOptions ? { width: "28%" } : {},
                ]}>
                <Pressable
                  onPress={() => {
                    this.setState({ showPhoto: true });
                    Keyboard.dismiss();
                  }}
                  style={styles.viewWriteMessageIconCamera}>
                  <Icon name="camera" size={32} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    this.showMap();
                    Keyboard.dismiss();
                  }}
                  style={styles.viewWriteMessageIconMap}>
                  <Icon name="location-sharp" size={24} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    this.setState({ showGiphy: true });
                    Keyboard.dismiss();
                    this.props.getGiphy("");
                  }}
                  style={styles.viewWriteMessageIconMap}>
                  <Image source={GifIcon} style={{ width: 30, height: 30 }} />
                </Pressable>
                {this.state.showMoreOptions && (
                  <Pressable
                    onPress={() => this.setState({ showMoreOptions: false })}
                    style={styles.viewWriteMessageIconDismissMore}>
                    <Icon name="chevron-back-circle-outline" size={32} />
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={styles.viewWriteMessageIconsMore}>
                <Pressable
                  onPress={() => this.setState({ showMoreOptions: true })}
                  style={styles.viewWriteMessageIconCamera}>
                  <Icon name="chevron-forward-circle-outline" size={32} />
                </Pressable>
              </View>
            )}
            <View
              style={[
                styles.viewWriteMessageViewTextInput,
                this.state.showKeyboard
                  ? this.state.messageSend === ""
                    ? {}
                    : !this.state.showMoreOptions
                    ? { width: "77%" }
                    : { width: "57%" }
                  : {},
              ]}>
              <TextInput
                placeholder="Type your message"
                placeholderTextColor={PlaceholderColor}
                style={styles.viewWriteMessageTextInput}
                multiline={true}
                value={this.state.messageSend}
                onChangeText={(text) =>
                  this.setState({
                    messageSend: text,
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
                    this.setState({ marker: e.nativeEvent.coordinate })
                  }
                  initialRegion={this.state.locationInital}>
                  {null !== this.state.marker && (
                    <Marker
                      key={1}
                      coordinate={this.state.marker}
                      pinColor="#FF0000"
                    />
                  )}
                </MapView>
                <View style={[styles.viewSection, styles.viewSectionButtons]}>
                  <View style={styles.viewButton}>
                    <Pressable
                      onPress={() =>
                        this.setState({ showMap: false, marker: null })
                      }
                      style={[
                        styles.button,
                        { backgroundColor: GreenFitrecColor },
                      ]}>
                      <Text style={styles.textButton}>Cancel</Text>
                    </Pressable>
                  </View>
                  <View style={styles.viewButton}>
                    <Pressable
                      onPress={() => this.sendMessage("location")}
                      style={[styles.button, { backgroundColor: SignUpColor }]}>
                      <Text style={styles.textButton}>Send</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
          <ModalGifs
            bShow={this.state.showGiphy}
            bShowStickers={this.state.showGiphyStickers}
            sSearch={this.state.search}
            fSearch={() => this.props.getGiphy(this.state.search)}
            fUpdateSearch={(text) => {
              this.setState({ search: text });
            }}
            fClean={() => {
              this.setState({ search: "" });
              this.props.getGiphy("");
            }}
            fActionSelect={(item) => {
              this.sendGif(item);
            }}
            fChangeType={() => {
              this.setState({
                showGiphyStickers: !this.state.showGiphyStickers,
              });
            }}
            fClose={() => {
              this.setState({
                showGiphy: false,
                showGiphyStickers: false,
                search: "",
              });
            }}
            aGifs={this.props.giphyProps.gifs}
            aStickers={this.props.giphyProps.stickers}
          />
        </View>
      ) : (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            <Pressable
              style={[GlobalModal.buttonLeft, { flexDirection: "row" }]}
              onPress={() => this.setState({ showMembers: false })}>
              <Icon name="chatbubbles-outline" color={SignUpColor} size={22} />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                Messages
              </Text>
            </Pressable>
            <Text style={GlobalModal.headTitle}>
              {this.props.conversation.name}
            </Text>
            <Pressable
              style={[GlobalModal.buttonClose, { flexDirection: "row" }]}
              onPress={() => {
                this.props.close();
                this.setState({ showMembers: false });
              }}>
              <Icon name="close" color={SignUpColor} size={22} />
              <Text style={[GlobalModal.titleClose, { marginLeft: 2 }]}>
                Close
              </Text>
            </Pressable>
          </View>
          <View style={styles.containerText}>
            <Text style={styles.textPeople}>Members of this chat</Text>
          </View>
          <ListPeople
            people={this.props.conversation.users}
            refresh={this.state.refresh}
            action={(item) => this.props.viewProfile(item)}
            grid={false}
          />
        </View>
      )
    ) : null;
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
  containerText: {
    alignSelf: "center",
    marginTop: 15,
  },
  textPeople: {
    fontSize: 24,
    color: GreenFitrecColor,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  chatProps: state.reducerChat,
  giphyProps: state.reducerGiphy,
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => {
    dispatch(actionSendMessageChatGroup(data));
  },
  getGiphy: (data) => {
    dispatch(actionGetGiphy(data));
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupChat);
