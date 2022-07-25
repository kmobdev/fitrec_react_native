import React, { Component } from "react";
import {
  GlobalMessages,
  GlobalModal,
  GlobalStyles,
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
  ToastQuestionGenericStyles,
  WhiteColor,
} from "../../Styles";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
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
  actionGetMessages,
  actionSendMessageGroup,
} from "../../redux/actions/GroupActions";
import { actionGetGiphy } from "../../redux/actions/ChatActions";
import { ModalGifs } from "../../components/shared/ModalGifs";
import {
  OPTIONS_GEOLOCATION_GET_POSITION,
  OPTIONS_IMAGE_CROP_CONVERSATION,
  SEND_MESSAGE_TYPES,
} from "../../Constants";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

const GroupImageDefault = require("../../assets/imgGroup.png");
const UserImageDefault = require("../../assets/profile.png");
const GifIcon = require("../../assets/gif.png");
const GiphyLogo = require("../../assets/giphyLogo.png");

const OPTION_CAMERA = "camera";
const OPTION_GALLERY = "gallery";

const oInitialState = {
  bRefresh: false,
  nKeyboardPadding: 0,
  bShowKeyboard: false,
  bShowMoreOptions: false,
  sText: "",
  sImage: "",
  oMarker: null,
  oInitialLocation: {
    latitude: 40.5879479,
    longitude: -109.405,
  },
  bShowGifsModal: false,
  bShowGifsStickers: false,
  sSearch: "",
  bShowOptionImage: false,
  bShowMap: false,
};

class MessagesGroup extends Component {
  constructor(props) {
    super(props);
    this.state = oInitialState;
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({ goBack: this.goBack });
    this.oKeyboardListenerWillShow = Keyboard.addListener(
      "keyboardWillShow",
      this.openKeyboard
    );
    this.oKeyboardListenerWillHide = Keyboard.addListener(
      "keyboardWillHide",
      this.closeKeyboard
    );
  };

  openKeyboard = ({ endCoordinates: { height } }) => {
    this.setState({ bShowKeyboard: true, nKeyboardPadding: height });
  };

  closeKeyboard = ({ endCoordinates: { height } }) => {
    this.setState({ bShowKeyboard: false, nKeyboardPadding: 0 });
  };

  componentWillUnmount = () => {
    this.oKeyboardListenerWillShow && this.oKeyboardListenerWillShow.remove();
    this.oKeyboardListenerWillHide && this.oKeyboardListenerWillHide.remove();
    this.props.cleanMessages();
  };

  componentDidUpdate = async (oPrevProps) => { };

  goBack = () => {
    this.props.cleanMessages();
    this.props.navigation.goBack();
  };

  expandImage = async (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  handleChangeSearch = (sText) => {
    this.setState({ sSearch: sText });
  };

  handleFocusSearch = () => {
    if (null !== this.oScrollView && undefined !== this.oScrollView)
      this.oScrollView.scrollToEnd({ animated: true });
  };

  handleCleanSearch = (nType = null) => {
    if (nType === SEND_MESSAGE_TYPES.GIF) this.props.getGiphy("");
    this.setState({ sSearch: "" });
  };

  viewProfile = async (oUserKey) => {
    const { oGroup } = this.props.oGroupProps;
    let aUser = oGroup.participants.filter(
      (oParticipant) => oParticipant.key === oUserKey
    ),
      nId = null;
    if (aUser.length > 0) nId = aUser[0].id;
    this.props.getProfile(nId);
    this.props.navigation.navigate("ProfileViewDetailsHome");
  };

  resetState = () => {
    this.setState({
      ...oInitialState,
      nKeyboardPadding: this.state.nKeyboardPadding,
    });
  };

  getImageUser = (sUserKey) => {
    const { oGroup } = this.props.oGroupProps;
    let aUser = oGroup.participants.filter(
      (oParticipant) => oParticipant.key === sUserKey
    );
    if (aUser.length > 0) return aUser[0].image ? aUser[0].image : null;
    return null;
  };

  sendMessage = async (sType = SEND_MESSAGE_TYPES.TEXT, oGif = null) => {
    const { sText, sImage, oMarker, bShowGifsStickers } = this.state;
    const { key: sGroupKey } = this.props.oGroupProps.oGroup;
    const { key: sSenderKey } = this.props.session.account;
    let oMessage = {
      sender: sSenderKey,
      groupId: sGroupKey,
      type: sType,
      message: "",
    };
    switch (sType) {
      case SEND_MESSAGE_TYPES.TEXT:
      default:
        oMessage.message = sText.trim();
        if (oMessage.message === "") return;
        break;
      case SEND_MESSAGE_TYPES.IMAGE:
        oMessage.message = sImage;
        break;
      case SEND_MESSAGE_TYPES.LOCATION:
        if (oMarker === null)
          return this.props.message("The marker cannot be empty");
        oMessage.lat = oMarker.latitude;
        oMessage.lon = oMarker.longitude;
        break;
      case SEND_MESSAGE_TYPES.GIF:
        oMessage.message = oGif.image;
        oMessage.height = oGif.height;
        oMessage.width = oGif.width;
        oMessage.giphyId = oGif.id;
        oMessage.isSticker = bShowGifsStickers;
        break;
    }
    this.props.sendMessage(oMessage);
    this.resetState();
  };

  handlePressOptions = async (sOptionName) => {
    Keyboard.dismiss();
    if (sOptionName === "bShowGifsModal") this.props.getGiphy("");
    await this.setState({
      [sOptionName]: true,
    });
  };

  addImage = async (sType = OPTION_GALLERY) => {
    switch (sType) {
      case OPTION_CAMERA:
        ImagePicker.openCamera(OPTIONS_IMAGE_CROP_CONVERSATION)
          .then(async (oResponse) => {
            var sImageB64 = oResponse.data;
            await this.setState({
              sImage: sImageB64,
            });
            this.sendMessage(SEND_MESSAGE_TYPES.IMAGE);
          })
          .catch(() => {
            this.props.message(MESSAGE_ERROR);
          });
        break;
      case OPTION_GALLERY:
      default:
        ImagePicker.openPicker(OPTIONS_IMAGE_CROP_CONVERSATION)
          .then(async (oResponse) => {
            var sImageB64 = oResponse.data;
            await this.setState({
              sImage: sImageB64,
            });
            this.sendMessage(SEND_MESSAGE_TYPES.IMAGE);
          })
          .catch(() => {
            this.props.message(MESSAGE_ERROR);
          });
        break;
    }
  };

  showMap = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && undefined !== position.coords) {
          Keyboard.dismiss();
          this.setState({
            oInitialLocation: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.1,
            },
            oMarker: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
            bShowMap: true,
          });
        }
      },
      (error) => {
        Keyboard.dismiss();
        this.handlePressOptions("bShowMap");
      },
      OPTIONS_GEOLOCATION_GET_POSITION
    );
  };

  render = () => {
    const { aMessages } = this.props.oGroupProps;
    return (
      <>
        {aMessages ? (
          <>
            {this.renderMessages()}
            {this.renderQuestions()}
          </>
        ) : (
          <View></View>
        )}
      </>
    );
  };

  renderMessages = () => {
    const { aMessages } = this.props.oGroupProps;
    const { key: sGroupKey } = this.props.oGroupProps.oGroup;
    const { bRefresh } = this.state;
    const { key: sUserKey } = this.props.session.account;
    return (
      <View style={oStyles.container}>
        <ScrollView
          style={oStyles.pd10}
          ref={(oRef) => (this.oScrollView = oRef)}
          onContentSizeChange={() => {
            if (null !== this.oScrollView && undefined !== this.oScrollView)
              this.oScrollView.scrollToEnd({ animated: true });
          }}
        >
          <FlatList
            data={aMessages}
            style={{ flexDirection: "column-reverse" }}
            keyExtractor={(item, index) => index.toString()}
            extraData={bRefresh}
            renderItem={({ item: oMessage }) => (
              <>
                {sGroupKey !== oMessage.sender
                  ? sUserKey === oMessage.sender
                    ? this.renderMyMessage(oMessage)
                    : this.renderMessageOtherSender(oMessage)
                  : this.renderGroupMessage(oMessage)}
              </>
            )}
          />
        </ScrollView>
        {this.renderInput()}
      </View>
    );
  };

  renderGroupMessage = (oMessage) => {
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
            {this.renderMessage(oMessage, "#EFEFEF")}
          </View>
        </View>
      </View>
    );
  };

  renderMessageOtherSender = (oMessage) => {
    return (
      <View style={[oStyles.row, oStyles.mgB10, oStyles.leftAlign]}>
        <Pressable
          activeOpacity={1}
          onPress={() => this.viewProfile(oMessage.sender)}
        >
          {this.getImageUser(oMessage.sender) ? (
            <FastImage
              style={oStyles.userImage}
              source={{
                uri: this.getImageUser(oMessage.sender),
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
            {this.renderMessage(oMessage)}
          </View>
          <View
            style={[
              [
                oStyles.row,
                oStyles.pdT5,
                oStyles.mgR5,
                { justifyContent: "flex-end" },
              ],
            ]}
          >
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
      </View>
    );
  };

  renderMyMessage = (oMessage) => {
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
            {this.renderMessage(oMessage, "#6f6f6f")}
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
        {this.getImageUser(oMessage.sender) ? (
          <FastImage
            style={oStyles.userImage}
            source={{
              uri: this.getImageUser(oMessage.sender),
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

  renderMessage = (oMessage, sColorText = WhiteColor) => {
    return (
      <>
        {SEND_MESSAGE_TYPES.IMAGE === oMessage.type && (
          <Pressable onPress={() => this.expandImage(oMessage.message)}>
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
          <Pressable onPress={() => this.expandImage(oMessage.message)}>
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
            provider={this.props.provider}
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

  renderInput = () => {
    const { nKeyboardPadding, bShowKeyboard, sText, bShowMoreOptions } =
      this.state;
    return (
      <View
        style={[oStyles.viewWriteMessage, { paddingBottom: nKeyboardPadding }]}
      >
        {!bShowKeyboard ||
          (bShowKeyboard && sText === "") ||
          bShowMoreOptions ? (
          <View
            style={[
              oStyles.row,
              oStyles.alignCenter,
              { width: bShowMoreOptions ? "28%" : "20%" },
            ]}
          >
            <Pressable
              onPress={() => this.handlePressOptions("bShowOptionImage")}
              style={oStyles.pdT2}
            >
              <Icon name="camera" size={32} />
            </Pressable>
            <Pressable
              onPress={() => {
                this.showMap();
              }}
              style={oStyles.viewWriteMessageIconMap}
            >
              <Icon name="location-sharp" size={24} />
            </Pressable>
            <Pressable
              onPress={() => this.handlePressOptions("bShowGifsModal")}
              style={oStyles.viewWriteMessageIconMap}
            >
              <Image source={GifIcon} style={{ width: 30, height: 30 }} />
            </Pressable>
            {bShowMoreOptions && (
              <Pressable
                activeOpacity={1}
                onPress={() => this.setState({ bShowMoreOptions: false })}
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
              onPress={() => this.setState({ bShowMoreOptions: true })}
              style={oStyles.pdT2}
            >
              <Icon name="chevron-forward-circle-outline" size={32} />
            </Pressable>
          </View>
        )}
        <View
          style={{
            marginLeft: "2%",
            width: bShowKeyboard
              ? sText === ""
                ? "65%"
                : !bShowMoreOptions
                  ? "77%"
                  : "57%"
              : "65%",
          }}
        >
          <TextInput
            placeholder="Type your message"
            placeholderTextColor={PlaceholderColor}
            onFocus={this.handleFocusSearch}
            style={oStyles.viewWriteMessageTextInput}
            multiline={true}
            value={sText}
            onChangeText={(text) =>
              this.setState({
                sText: text,
                bShowMoreOptions:
                  bShowMoreOptions && text === "" ? false : bShowMoreOptions,
              })
            }
          />
        </View>
        <View style={oStyles.w15}>
          <Pressable onPress={() => this.sendMessage()}>
            <Text style={oStyles.font18}>Send</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  renderQuestions = () => {
    const { oGroup } = this.props.oGroupProps;
    const {
      bShowGifsModal,
      bShowGifsStickers,
      sSearch,
      bShowOptionImage,
      bShowMap,
      oMarker,
    } = this.state;
    return (
      <>
        {/* // Modal that shows the gifs to send */}
        <ModalGifs
          bShow={bShowGifsModal}
          bShowStickers={bShowGifsStickers}
          sSearch={sSearch}
          fSearch={() => this.props.getGiphy(sSearch)}
          fUpdateSearch={(text) => this.handleChangeSearch(text)}
          fClean={() => this.handleCleanSearch(SEND_MESSAGE_TYPES.GIF)}
          fClose={() => {
            this.resetState();
          }}
          fActionSelect={(oGif) =>
            this.sendMessage(SEND_MESSAGE_TYPES.GIF, oGif)
          }
          fChangeType={() => {
            this.setState({ bShowGifsStickers: !bShowGifsStickers });
          }}
          aGifs={this.props.oGiphyProps.gifs}
          aStickers={this.props.oGiphyProps.stickers}
        />
        {/* // Modal where the user takes the decision of what image to send */}
        <ToastQuestion
          visible={bShowOptionImage}
          functionCamera={() => this.addImage(OPTION_CAMERA)}
          functionGallery={() => this.addImage()}
          close={() => this.setState({ bShowOptionImage: false })}
        />
        {/* // Modal where the user takes the decision of what image to send */}
        {bShowMap && (
          <View
            style={[
              GlobalModal.viewContent,
              { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            ]}
          >
            <ScrollView>
              <MapView
                provider={this.props.provider}
                style={{ height: 300, width: "100%", marginTop: 20 }}
                onPress={(e) =>
                  this.setState({ oMarker: e.nativeEvent.coordinate })
                }
                initialRegion={this.state.locationInital}
              >
                {null !== oMarker && (
                  <Marker key={1} coordinate={oMarker} pinColor="#FF0000" />
                )}
              </MapView>
              <View style={[oStyles.viewSection, oStyles.viewSectionButtons]}>
                <View style={[oStyles.w50, oStyles.alignCenter]}>
                  <Pressable
                    onPress={() =>
                      this.setState({ bShowMap: false, oMarker: null })
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
                      this.sendMessage(SEND_MESSAGE_TYPES.LOCATION)
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
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  oGroupProps: state.reducerDetailsGroup,
  oGiphyProps: state.reducerGiphy,
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => {
    dispatch(actionSendMessageGroup(data));
  },
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  cleanMessages: () => {
    dispatch(actionGetMessages());
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
  },
  getGiphy: (sFilter) => {
    dispatch(actionGetGiphy(sFilter));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesGroup);
