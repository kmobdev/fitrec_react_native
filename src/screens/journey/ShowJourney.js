import React, { Component } from "react";
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
import { connect } from "react-redux";
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

class ShowJourney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      showToastQuestion: false,
      refreshing: false,
      showLikes: false,
      statusGetLikesResponse: false,
      showQuestionDeleteJourney: false,
      showToastEdit: false,
      newDescription: "",
      changePhoto: false,
      newImage: null,
      showQuestionChangeImage: false,
      showReport: false,
      showFriends: false,
      userTag: null,
      search: "",
      muted: true,
      nIndex: 0,
      isChangeTags: false,
    };
    this.props.getJourney(this.props.navigation.getParam("id", 0));
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ goBack: this.goBack });
  };

  showOptions = () => {
    this.setState({ showToastQuestion: true });
  };

  componentWillReceiveProps = async (nextProps) => {
    if (!this.props.journeyProps.status) this.goBack();
    await this.setState({
      refreshing: false,
      refresh: !this.state.refresh,
    });
  };

  goBack = () => {
    this.props.getJourney();
    this.props.navigation.goBack();
  };

  addUnLike = async (nIdJourney, bAddLike) => {
    let oDataNotification =
      this.props.session.account.id !== this.props.journeyProps.journey.user.id
        ? {
          sHeader: this.props.session.account.username,
          sDescription: `${this.props.session.account.name} likes your post`,
          sPushId: this.props.journeyProps.journey.user.id_push,
        }
        : null;
    this.props.addLike(nIdJourney, bAddLike, oDataNotification);
  };

  showLikes = async (nJourneyId) => {
    this.props.showLikes(nJourneyId);
    await this.setState({
      showLikes: true,
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

  deleteJourney = async () => {
    await this.setState({
      showQuestionDeleteJourney: false,
    });
    this.props.deleteJourney(
      this.props.journeyProps.journey.id,
      this.props.session.account.id
    );
    this.goBack();
  };

  redirectionViewProfile = (nIdFitrec) => {
    if (
      this.props.navigation.state.routeName === "ShowJourneyMyProfile" &&
      nIdFitrec === this.props.journeyProps.journey.user.id
    )
      this.props.navigation.goBack();
    else {
      this.props.getProfile(nIdFitrec, true);
      if (this.props.closeModal) {
        setTimeout(() => {
          this.props.close();
          this.props.closeModal();
        }, 1000);
      }
      if (this.props.navigation.state.routeName === "ShowJourneyMyProfile") {
        this.props.navigation.navigate("ProfileViewDetailsUser");
      } else this.props.navigation.navigate("ProfileViewDetails");
    }
  };

  changeDescription = () => {
    this.props.editJourney(
      this.props.journeyProps.journey.id,
      this.props.session.account.id,
      this.state.newDescription,
      null
    );
    this.setState({
      changeDescription: false,
    });
  };

  addImage = async (sType) => {
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
        async (image) => {
          await this.setState({
            newImage: image.data,
            showQuestionChangeImage: true,
            changePhoto: false,
          });
        },
        async () => {
          await this.setState({
            changePhoto: false,
          });
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        async (image) => {
          await this.setState({
            newImage: image.data,
            showQuestionChangeImage: true,
            changePhoto: false,
          });
        },
        async () => {
          await this.setState({
            changePhoto: false,
          });
        }
      );
    }
  };

  changePhoto = () => {
    this.props.editJourney(
      this.props.journeyProps.journey.id,
      this.props.session.account.id,
      this.props.journeyProps.journey.description,
      this.state.newImage
    );
    this.setState({
      changeDescription: false,
      showQuestionChangeImage: false,
      newImage: null,
    });
  };

  actionChangePhoto = () => {
    if (this.props.journeyProps.journey.likes < 1)
      this.setState({ changePhoto: true, showToastEdit: false });
    else this.props.message("You cannot change a photo that has likes");
  };

  setTagUser = async () => {
    await this.setState({
      showQuestionAddTag: false,
    });
    if (
      null !== this.props.journeyProps.journey.images[this.state.nIndex].tags &&
      this.props.journeyProps.journey.images[this.state.nIndex].tags.filter(
        (element) => element.id_user === this.state.userTag.id
      ).length > 0
    ) {
      this.props.message(
        "The tag already exists, you must remove the current tag to add a new tag"
      );
    } else {
      await this.setState({
        showFriends: false,
      });
      var nJourneyId = this.props.journeyProps.journey.id,
        nUserTaggedId = this.state.userTag.id,
        nX = this.state.left,
        nY = this.state.top,
        sUserKey = this.state.userTag.key,
        nUserId = this.props.session.account.id,
        sName = this.props.session.account.name,
        sUsername = this.props.session.account.username,
        nImageId = this.props.journeyProps.journey.images[this.state.nIndex].id;
      this.props.addTagUser(
        nJourneyId,
        nUserTaggedId,
        nX,
        nY,
        sUserKey,
        nUserId,
        sName,
        sUsername,
        nImageId
      );
    }
  };

  removeTag = async () => {
    var nTagId = this.state.userTag.id,
      nJourneyId = this.props.journeyProps.journey.id,
      nUserId = this.props.session.account.id;
    await this.setState({
      showQuestionRemoveTag: false,
      userTag: null,
    });
    this.props.removeTagUser(nTagId, nUserId, nJourneyId);
  };

  handlePress = async (evt) => {
    await this.setState({
      top: (evt.nativeEvent.locationY * 100) / screenHeight,
      left: (evt.nativeEvent.locationX * 100) / screenWidth,
    });
    setTimeout(() => {
      this.setState({
        showFriends: true,
      });
    }, 200);
  };

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
              paused={bPaused == undefined ? true : bPaused}
              muted={this.state.muted}
              repeat={true}
              controls={false}
              disableFocus={false}
              key={"video_" + oItem.id.toString() + oItem.id_user}
              resizeMode={"cover"}
              source={{ uri: oItem.image, cache: true }}
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
        ) : this.state.isChangeTags ? (
          <>
            {this.getImage(oItem)}
            {oItem.tags.map((tag) => (
              <View key={tag.id.toString()} style={this.dynamicStyle(tag)}>
                {
                  <View>
                    <View style={styles.tagTriangle} />
                    <Pressable
                      onPress={() => {
                        this.setState({
                          showQuestionRemoveTag: true,
                          userTag: tag,
                        });
                      }}
                      style={styles.tagUserView}
                    >
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
                this.setState({ refresh: !this.state.refresh });
              }}
              activeOpacity={1}
            >
              {this.getImage(oItem)}
            </Pressable>
            {oItem.tags.map((oTag) => (
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
          <Pressable
            onPress={() => {
              oItem.showTag = !oItem.showTag;
              this.setState({ refresh: !this.state.refresh });
            }}
            activeOpacity={1}
          >
            {this.getImage(oItem)}
          </Pressable>
        )}
      </View>
    );
  };

  getImage = (oItem) => {
    return this.state.isChangeTags ? (
      <TouchableWithoutFeedback onPress={(evt) => this.handlePress(evt)}>
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

  render() {
    const { journey: oJourney } = this.props.journeyProps;
    const { nIndex } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: WhiteColor }}>
        {oJourney !== null && (
          <View style={styles.viewPost}>
            <ShowHead
              date={moment(oJourney.created_at, "YYYY-MM-DD H:m:s").fromNow()}
              level={oJourney.user.level}
              username={oJourney.user.username}
              image={oJourney.user.image}
              redirectionViewProfile={() =>
                this.redirectionViewProfile(oJourney.user.id)
              }
              options={() => this.showOptions()}
              bShowOptions={this.state.isChangeTags}
              fCloseChangeTags={() => this.setState({ isChangeTags: false })}
            />
            <View style={{ aspectRatio: 1 }}>
              <Carousel
                ref={(oRef) => {
                  this.crousel = oRef;
                }}
                data={oJourney.images}
                renderItem={(oItem) =>
                  this.renderItem(oItem.item, oItem.index, false)
                }
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                lockScrollWhileSnapping={true}
                autoplay={false}
                style={{ padding: 0, margin: 0, width: "100%", height: "100%" }}
                loop={false}
                onSnapToItem={(index) => {
                  this.setState({
                    nIndex: index,
                    refresh: !this.state.refresh,
                  });
                }}
              />
              {oJourney.images.length > 1 && (
                <Pagination
                  dotsLength={oJourney.images.length}
                  activeDotIndex={nIndex}
                  containerStyle={CarouselStyle.paginationContainer}
                  dotStyle={CarouselStyle.paginationActive}
                  inactiveDotStyle={CarouselStyle.paginationInactive}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={1}
                />
              )}
            </View>
            {this.state.isChangeTags && (
              <View style={styles.footerPhoto}>
                <Text style={styles.footerContent}>
                  TAP PHOTO to tag people
                </Text>
              </View>
            )}
            <ShowFooter
              isLiked={oJourney.isLiked}
              likes={oJourney.likes}
              text={oJourney.description}
              pressAddLike={() => this.addUnLike(oJourney.id, true)}
              existTags={oJourney.images[nIndex].tags.length > 0}
              showTags={() =>
                this.setState({
                  showTagsList: true,
                  tags: oJourney.images[nIndex].tags,
                })
              }
              pressUnLike={() => this.addUnLike(oJourney.id, false)}
              showLikes={() => this.showLikes(oJourney.id)}
            />
          </View>
        )}
        <ToastQuestionGeneric
          visible={this.state.showToastQuestion}
          options={
            <View style={{ padding: 10 }}>
              {null !== oJourney &&
                oJourney.user.id !== this.props.session.account.id && (
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
              {null !== oJourney &&
                oJourney.user.id === this.props.session.account.id && (
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
              {null !== oJourney &&
                oJourney.user.id === this.props.session.account.id &&
                oJourney.images[nIndex].type != POST_TYPE_VIDEO && (
                  <Pressable
                    onPress={() =>
                      this.setState({
                        showToastQuestion: false,
                        isChangeTags: true,
                      })
                    }
                  >
                    <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                      <Icon name="pricetag" size={22} color={WhiteColor} />
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Tags
                      </Text>
                    </View>
                  </Pressable>
                )}
              {null !== oJourney &&
                oJourney.user.id === this.props.session.account.id && (
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
                onPress={() => this.setState({ showToastQuestion: false })}
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
                    newDescription: oJourney.description,
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
              {/* <Pressable onPress={() => this.actionChangePhoto()}>
                            <View style={[ToastQuestionGenericStyles.viewButtonOption]}>
                                <Icon name="images" size={22} color={WhiteColor} />
                                <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                                    New Image
                                </Text>
                            </View>
                        </Pressable> */}
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
        <ToastQuestion
          visible={this.state.changePhoto}
          functionCamera={() => this.addImage("camera")}
          functionGallery={() => this.addImage("gallery")}
        />
        {null !== oJourney && (
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
                        uri: oJourney.image,
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
        {this.state.showReport && oJourney !== null && (
          <ModalReport
            visible={this.state.showReport}
            close={() => this.setState({ showReport: false })}
            send={() => this.setState({ showReport: false })}
            type={REPORT_JOURNEY_TYPE}
            id={this.props.journeyProps.journey.id}
          />
        )}
        {this.state.showFriends && (
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
            ]}
          >
            <SearchUsername
              ph="Search for people or username"
              value={this.state.search}
              change={(text) =>
                this.setState({ search: text, refresh: !this.state.refresh })
              }
              clean={() =>
                this.setState({ search: "", refresh: !this.state.refresh })
              }
              close={() => this.setState({ showFriends: false })}
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
                refreshing={this.state.refresh}
                renderItem={({ item }) => (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: PlaceholderColor,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        this.setState({
                          userTag: item,
                          showQuestionAddTag: true,
                          showFriends: false,
                        });
                      }}
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        padding: 10,
                      }}
                    >
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
                      <View
                        style={{ justifyContent: "center", marginLeft: 10 }}
                      >
                        <Text style={styles.textUserReference}>
                          {item.name}
                        </Text>
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
          visible={this.state.showQuestionAddTag}
          titleBig="Add tag user"
          title="Are you sure you want to add tag?"
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => this.setState({ showQuestionAddTag: false })}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.setTagUser()}
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
        <ToastQuestionGeneric
          visible={this.state.showQuestionRemoveTag}
          titleBig="Remove tag user"
          title="Are you sure you want to remove tag?"
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => this.setState({ showQuestionRemoveTag: false })}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.removeTag(this.state.tagSelected)}
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
      </View>
    );
  }
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

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  journeyProps: state.reducerShowJourney,
  myPals: state.reducerMyPals,
});

const mapDispatchToProps = (dispatch) => ({
  addLike: (nJourneyId, bAddLike, oDataNotification) => {
    dispatch(actionAddUnLike(nJourneyId, bAddLike, oDataNotification, true));
  },
  getProfile: (nUserId, bIsHome) => {
    dispatch(actionGetProfile(nUserId, bIsHome));
  },
  showLikes: (nJourneyId) => {
    dispatch(actionGetLikes(nJourneyId));
  },
  deleteJourney: (nJourneyId, nUserId) => {
    dispatch(actionDeleteJourney(nJourneyId, nUserId));
  },
  editJourney: (nJourneyId, nUserId, sDescription, sImage) => {
    dispatch(
      actionEditJourney(nJourneyId, nUserId, sDescription, sImage, true)
    );
  },
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  getJourney: (nJourneyId = null) => {
    dispatch(actionGetJourney(nJourneyId));
  },
  removeTagUser: (nTagId, nUserId, nJourneyId) => {
    dispatch(actionRemoveTagUser(nTagId, nUserId, true, nJourneyId));
  },
  addTagUser: (
    nJourneyId,
    nUserTaggedId,
    nX,
    nY,
    sUserKey,
    nUserId,
    sName,
    sUsername,
    nImageId
  ) => {
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
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowJourney);
