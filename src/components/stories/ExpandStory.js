import React, { Component } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ProgressViewIOS,
  Platform,
} from "react-native";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { POST_TYPE_IMAGE, POST_TYPE_VIDEO } from "../../Constants";
import {
  GlobalStyles,
  GreenFitrecColor,
  SignUpColor,
  ToastQuestionStyles,
  WhiteColor,
} from "../../Styles";
import { getFitnnesLevel } from "../shared/SharedFunctions";
import Video from "react-native-video";
import { actionCloseImage } from "../../redux/actions/SharedActions";
import {
  actionDeleteStory,
  actionNextStory,
  actionPreviousStory,
  actionResetControlStory,
  actionStopStory,
  actionViewStory,
} from "../../redux/actions/StoryActions";
import { ToastQuestionGeneric } from "../shared/ToastQuestionGeneric";
import { ifIphoneX } from "react-native-iphone-x-helper";

import moment from "moment/min/moment-with-locales";

class ExpandStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationDeletestory: false,
      nProgress: 0,
      oInterval: null,
      nActualStory: null,
      loading: false,
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    if (!nextProps.oStory.stopStory) {
      if (nextProps.oStory.nextStory || nextProps.oStory.previusStory) {
        this.props.resetControlStory();
        clearInterval(this.state.oInterval);
        await this.setState({
          oInterval: null,
          nActualStory: null,
          nProgress: 0,
          loading: false,
        });
      }
      if (
        null === this.state.oInterval &&
        this.state.nActualStory !== nextProps.oStory.id &&
        nextProps.oStory.type == POST_TYPE_IMAGE
      ) {
        this.setState({ nActualStory: nextProps.oStory.id });
        let nProgress = 0;
        let oInterval = setInterval(async () => {
          if (this.props.oStory.expand) {
            if (!this.props.oStory.stopStory) {
              if (
                this.props.oStory.nextStory ||
                this.props.oStory.previusStory
              ) {
                clearInterval(this.state.oInterval);
                await this.setState({
                  oInterval: null,
                  nActualStory: null,
                  nProgress: 0,
                });
              } else {
                if (this.state.loading) {
                  nProgress = nProgress + 10;
                  this.setState({ nProgress: nProgress / 4000 });
                  if (nProgress / 4000 > 1) {
                    clearInterval(this.state.oInterval);
                    clearInterval(oInterval);
                    this.setState({
                      oInterval: null,
                      nProgress: 0,
                      nActualStory: null,
                      loading: false,
                    });
                    if (this.props.oStory.expand) this.next();
                  }
                }
              }
            }
          } else {
            clearInterval(this.state.oInterval);
            clearInterval(oInterval);
            this.setState({
              oInterval: null,
              nProgress: 0,
              nActualStory: null,
              loading: false,
            });
          }
        }, 10);
        this.setState({ oInterval: oInterval });
      }
    }
  };

  close = () => {
    if (null !== this.state.oInterval) clearInterval(this.state.oInterval);
    this.setState({
      oInterval: null,
      nProgress: 0,
      nActualStory: null,
      loading: false,
    });
    this.props.close();
  };

  next = () => {
    if (null !== this.state.oInterval) clearInterval(this.state.oInterval);
    this.setState({
      oInterval: null,
      nProgress: 0,
      nActualStory: null,
      loading: false,
    });
    if (this.props.oStory.total - 1 !== this.props.oStory.index)
      this.props.next();
    else this.close();
  };

  previous = () => {
    if (null !== this.state.oInterval) clearInterval(this.state.oInterval);
    this.setState({
      oInterval: null,
      nProgress: 0,
      nActualStory: null,
      loading: false,
    });
    this.props.previous();
  };

  delete = () => {
    this.setState({ confirmationDeletestory: false });
    this.props.deleteStory(this.props.oStory.id);
  };

  cancelDelete = () => {
    this.setState({ confirmationDeletestory: false });
    this.props.resetControlStory();
  };

  play = () => {
    if (this.props.oStory.stopStory) this.props.resetControlStory();
  };

  renderHeader = () => {
    let oHeader = [],
      oSection = [];
    for (let nIndex = 0; nIndex < this.props.oStory.total; nIndex++) {
      if (nIndex < this.props.oStory.index) {
        oSection.push(
          <View
            style={[styles.sectionHeader, styles.sectionHeaderView]}
            key={
              nIndex.toString() +
              this.props.oStory.id.toString() +
              this.props.oStory.date
            }
          ></View>
        );
      } else {
        if (nIndex === this.props.oStory.index) {
          if (Platform.OS === "android")
            oSection.push(
              <ProgressBar
                progress={this.state.nProgress}
                key={
                  nIndex.toString() +
                  this.props.oStory.id.toString() +
                  this.props.oStory.date
                }
                color={WhiteColor}
                styleAttr={"Horizontal"}
                style={styles.sectionHeader}
                animating={true}
                indeterminate={false}
              />
            );
          else
            oSection.push(
              <ProgressViewIOS
                progress={this.state.nProgress}
                key={
                  nIndex.toString() +
                  this.props.oStory.id.toString() +
                  this.props.oStory.date
                }
                progressTintColor={WhiteColor}
                progressViewStyle={"bar"}
                style={[
                  styles.sectionHeader,
                  { backgroundColor: "gray", alignSelf: "center" },
                ]}
              />
            );
        } else {
          oSection.push(
            <View
              style={[styles.sectionHeader, styles.sectionHeaderNotView]}
              key={
                nIndex.toString() +
                this.props.oStory.id.toString() +
                this.props.oStory.date
              }
            ></View>
          );
        }
      }
    }
    oHeader.push(<View style={styles.containerHeader}>{oSection}</View>);
    return oHeader;
  };

  render = () => {
    return this.props.oStory.expand && this.props.oStory.image ? (
      <>
        {this.props.oStory.type == POST_TYPE_VIDEO ? (
          <>
            <View style={styles.container}>
              <Video
                paused={this.props.oStory.stopStory}
                repeat={false}
                controls={false}
                disableFocus={false}
                resizeMode={"contain"}
                style={GlobalStyles.fullImage}
                source={{ uri: this.props.oStory.image }}
                onEnd={() => this.next()}
                onLoad={() => {
                  this.props.viewStory(this.props.oStory.id);
                }}
                onProgress={(oDataProgress) => {
                  let nProgress =
                    oDataProgress.currentTime / oDataProgress.playableDuration;
                  if (nProgress <= 1) {
                    this.setState({
                      nProgress:
                        oDataProgress.currentTime /
                        oDataProgress.playableDuration,
                    });
                  }
                }}
                ref={(ref) => {
                  this.player = ref;
                }}
              />
              {this.renderHeader()}
              <View style={styles.containerActionsVideo}>
                <Pressable
                  onPress={() => this.previous()}
                  style={styles.touchableControls}
                  delayLongPress={1000}
                  onLongPress={() => this.props.stop()}
                  onPressOut={() => this.play()}
                />
                <Pressable
                  onPress={() => this.next()}
                  style={[
                    styles.touchableControls,
                    this.props.oStory.owner && { marginBottom: 90 },
                  ]}
                  delayLongPress={1000}
                  onLongPress={() => this.props.stop()}
                  onPressOut={() => this.play()}
                />
                <View style={styles.containerProfile}>
                  <FastImage
                    style={styles.imageProfile}
                    source={{
                      uri: this.props.oStory.profile,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <View style={styles.containerData}>
                    <Text style={styles.textName}>
                      {this.props.oStory.name}
                    </Text>
                    <Text style={styles.textLevel}>
                      {getFitnnesLevel(this.props.oStory.level) +
                        " - " +
                        moment(
                          this.props.oStory.date,
                          "YYYY-MM-DD H:m:s"
                        ).fromNow()}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => this.close()} style={styles.icon}>
                  <Icon name="close" color={WhiteColor} size={32} />
                </Pressable>
              </View>
            </View>
            {this.props.oStory.owner && (
              <Pressable
                style={styles.iconRemove}
                onPress={() => {
                  this.setState({ confirmationDeletestory: true });
                  this.props.stop();
                }}
              >
                <Icon name="trash-outline" color={SignUpColor} size={32} />
              </Pressable>
            )}
          </>
        ) : (
          <>
            <FastImage
              style={styles.container}
              source={{
                uri: this.props.oStory.image,
                priority: FastImage.priority.normal,
              }}
              onLoadEnd={() => {
                this.setState({ loading: true });
                this.props.viewStory(this.props.oStory.id);
              }}
              resizeMode={FastImage.resizeMode.contain}
            >
              <>
                <View style={styles.touchableContainer}>
                  <Pressable
                    onPress={() => this.previous()}
                    style={styles.touchableControls}
                    delayLongPress={1000}
                    onLongPress={() => this.props.stop()}
                    onPressOut={() => this.play()}
                  />
                  <Pressable
                    onPress={() => this.next()}
                    style={[
                      styles.touchableControls,
                      this.props.oStory.owner && {
                        marginBottom: Platform.OS === "android" ? 140 : 50,
                      },
                    ]}
                    delayLongPress={1000}
                    onLongPress={() => this.props.stop()}
                    onPressOut={() => this.play()}
                  />
                </View>
                {this.renderHeader()}
                <View style={styles.containerProfile}>
                  <FastImage
                    style={styles.imageProfile}
                    source={{
                      uri: this.props.oStory.profile,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <View style={styles.containerData}>
                    <Text style={styles.textName}>
                      {this.props.oStory.name}
                    </Text>
                    <Text style={styles.textLevel}>
                      {getFitnnesLevel(this.props.oStory.level) +
                        " - " +
                        moment(
                          this.props.oStory.date,
                          "YYYY-MM-DD H:m:s"
                        ).fromNow()}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => this.close()} style={styles.icon}>
                  <Icon name="close" color={WhiteColor} size={32} />
                </Pressable>
              </>
            </FastImage>
            {this.props.oStory.owner && (
              <Pressable
                style={styles.iconRemove}
                onPress={() => {
                  this.setState({ confirmationDeletestory: true });
                  this.props.stop();
                }}
              >
                <Icon name="trash-outline" color={SignUpColor} size={32} />
              </Pressable>
            )}
          </>
        )}
        <ToastQuestionGeneric
          visible={this.state.confirmationDeletestory}
          titleBig="Delete Story"
          title="Are you sure you want to delete the story?"
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => this.cancelDelete()}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.delete()}
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
      </>
    ) : null;
  };
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  icon: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    right: 30,
    backgroundColor: SignUpColor,
    borderRadius: 100,
    width: 35,
    height: 35,
    alignItems: "center",
    zIndex: 3,
  },
  iconRemove: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 40 : ifIphoneX(80, 30),
    right: 30,
    zIndex: 3,
  },
  progressStyle: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 140,
    left: 15,
    right: 15,
    height: 2,
    zIndex: 1,
  },
  containerProfile: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    left: 20,
    zIndex: 3,
    flexDirection: "row",
  },
  imageProfile: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  containerData: {
    marginLeft: 5,
    alignSelf: "center",
  },
  textName: {
    color: WhiteColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  textLevel: {
    color: WhiteColor,
    fontSize: 12,
    fontWeight: "400",
  },
  touchableContainer: {
    flexDirection: "row",
    flex: 1,
    zIndex: 2,
  },
  touchableControls: {
    flex: 1,
    marginTop: 100,
  },
  containerActionsVideo: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
  },
  containerHeader: {
    position: "absolute",
    top: Platform.OS === "android" ? 30 : 50,
    left: 20,
    right: 20,
    zIndex: 3,
    flexDirection: "row",
    flex: 1,
  },
  sectionHeader: {
    flex: 1,
    zIndex: 10,
    marginStart: 2,
    height: 2,
  },
  sectionHeaderView: {
    backgroundColor: WhiteColor,
  },
  sectionHeaderNotView: {
    backgroundColor: "gray",
  },
});

const mapStateToProps = (state) => ({
  oSession: state.reducerSession,
  oStory: state.reducerStory,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(actionCloseImage());
  },
  next: () => {
    dispatch(actionNextStory());
  },
  previous: () => {
    dispatch(actionPreviousStory());
  },
  stop: () => {
    dispatch(actionStopStory());
  },
  resetControlStory: () => {
    dispatch(actionResetControlStory());
  },
  deleteStory: (nStoryId) => {
    dispatch(actionDeleteStory(nStoryId));
  },
  viewStory: (nStoryId) => {
    dispatch(actionViewStory(nStoryId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpandStory);
