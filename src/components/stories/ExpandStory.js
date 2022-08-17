import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
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

const ExpandStory = (props) => {

  const oSession = useSelector((state) => state.reducerSession);
  const story = useSelector((state) => state.reducerStory);

  const dispatch = useDispatch();

  const [confirmationDeletestory, setConfirmationDeletestory] = useState(false);
  const [nProgress, setNProgress] = useState(0);
  const [oInterval, setOInterval] = useState(null);
  const [nActualStory, setNActualStory] = useState(null);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    if (!story.stopStory) {
      if (story.nextStory || story.previusStory) {
        dispatch(actionResetControlStory());
        clearInterval(oInterval);
        setOInterval(null);
        setNActualStory(null);
        setNProgress(0);
        setLoading(false);
      }
      if (
        null === oInterval &&
        nActualStory !== story.id &&
        story.type == POST_TYPE_IMAGE
      ) {
        setNProgress(story.id);
        let nProgress = 0;
        let oInterval = setInterval(() => {
          if (story.expand) {
            if (!story.stopStory) {
              if (
                story.nextStory ||
                story.previusStory
              ) {
                clearInterval(oInterval);
                setOInterval(null);
                setNActualStory(null);
                setNProgress(0);
              } else {
                if (loading) {
                  nProgress = nProgress + 10;
                  setNProgress(nProgress / 4000);
                  if (nProgress / 4000 > 1) {
                    clearInterval(oInterval);
                    setOInterval(null);
                    setNProgress(0);
                    setNActualStory(null);
                    setLoading(false);
                    if (story.expand) {
                      next();
                    }
                  }
                }
              }
            }
          } else {
            clearInterval(oInterval);
            setOInterval(null);
            setNActualStory(null);
            setNProgress(0);
            setLoading(false);
          }
        }, 10);
        setOInterval(oInterval);
      }
    }
  }, [story])

  const close = () => {
    if (null !== oInterval) clearInterval(oInterval);
    setOInterval(null);
    setNProgress(0);
    setNActualStory(null);
    setLoading(false);
    dispatch(actionCloseImage());
  };

  const next = () => {
    if (null !== oInterval) clearInterval(oInterval);
    setOInterval(null);
    setNProgress(0);
    setNActualStory(null);
    setLoading(false);
    if (story.total - 1 !== story.index)
      dispatch(actionNextStory());
    else close();
  };

  const previous = () => {
    if (null !== oInterval) clearInterval(oInterval);
    setOInterval(null);
    setNProgress(0);
    setNActualStory(null);
    setLoading(false);
    dispatch(actionPreviousStory());
  };

  const deleteHandler = () => {
    setConfirmationDeletestory(false);
    dispatch(actionDeleteStory(story.id));
  };

  const cancelDelete = () => {
    setConfirmationDeletestory(false);
    dispatch(actionResetControlStory());
  };

  const play = () => {
    if (story.stopStory) {
      dispatch(actionResetControlStory());
    }
  };

  const renderHeader = () => {
    let oHeader = [],
      oSection = [];
    for (let nIndex = 0; nIndex < story.total; nIndex++) {
      if (nIndex < story.index) {
        oSection.push(
          <View
            style={[styles.sectionHeader, styles.sectionHeaderView]}
            key={
              nIndex.toString() +
              story.id.toString() +
              story.date
            }
          ></View>
        );
      } else {
        if (nIndex === story.index) {
          if (Platform.OS === "android")
            oSection.push(
              <ProgressBar
                progress={nProgress}
                key={
                  nIndex.toString() +
                  story.id.toString() +
                  story.date
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
                progress={nProgress}
                key={
                  nIndex.toString() +
                  story.id.toString() +
                  story.date
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
                story.id.toString() +
                story.date
              }
            ></View>
          );
        }
      }
    }
    oHeader.push(<View style={styles.containerHeader}>{oSection}</View>);
    return oHeader;
  };

  return story.expand && story.image ? (
    <>
      {story.type == POST_TYPE_VIDEO ? (
        <>
          <View style={styles.container}>
            <Video
              paused={story.stopStory}
              repeat={false}
              controls={false}
              disableFocus={false}
              resizeMode={"contain"}
              style={GlobalStyles.fullImage}
              source={{ uri: story.image }}
              onEnd={() => next()}
              onLoad={() => {
                dispatch(actionViewStory(story.id));
              }}
              onProgress={(oDataProgress) => {
                let nProgress =
                  oDataProgress.currentTime / oDataProgress.playableDuration;
                if (nProgress <= 1) {
                  setNProgress(oDataProgress.currentTime / oDataProgress.playableDuration);
                }
              }}
              ref={(ref) => {
                player = ref;
              }}
            />
            {renderHeader()}
            <View style={styles.containerActionsVideo}>
              <Pressable
                onPress={() => previous()}
                style={styles.touchableControls}
                delayLongPress={1000}
                onLongPress={() => dispatch(actionStopStory())}
                onPressOut={() => play()}
              />
              <Pressable
                onPress={() => next()}
                style={[
                  styles.touchableControls,
                  story.owner && { marginBottom: 90 },
                ]}
                delayLongPress={1000}
                onLongPress={() => dispatch(actionStopStory())}
                onPressOut={() => play()}
              />
              <View style={styles.containerProfile}>
                <FastImage
                  style={styles.imageProfile}
                  source={{
                    uri: story.profile,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.containerData}>
                  <Text style={styles.textName}>
                    {story.name}
                  </Text>
                  <Text style={styles.textLevel}>
                    {getFitnnesLevel(story.level) +
                      " - " +
                      moment(
                        story.date,
                        "YYYY-MM-DD H:m:s"
                      ).fromNow()}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => close()} style={styles.icon}>
                <Icon name="close" color={WhiteColor} size={32} />
              </Pressable>
            </View>
          </View>
          {story.owner && (
            <Pressable
              style={styles.iconRemove}
              onPress={() => {
                setConfirmationDeletestory(true);
                dispatch(actionStopStory());
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
              uri: story.image,
              priority: FastImage.priority.normal,
            }}
            onLoadEnd={() => {
              setLoading(true);
              dispatch(actionViewStory(story.id));
            }}
            resizeMode={FastImage.resizeMode.contain}
          >
            <>
              <View style={styles.touchableContainer}>
                <Pressable
                  onPress={() => previous()}
                  style={styles.touchableControls}
                  delayLongPress={1000}
                  onLongPress={() => dispatch(actionStopStory())}
                  onPressOut={() => play()}
                />
                <Pressable
                  onPress={() => next()}
                  style={[
                    styles.touchableControls,
                    story.owner && {
                      marginBottom: Platform.OS === "android" ? 140 : 50,
                    },
                  ]}
                  delayLongPress={1000}
                  onLongPress={() => dispatch(actionStopStory())}
                  onPressOut={() => play()}
                />
              </View>
              {renderHeader()}
              <View style={styles.containerProfile}>
                <FastImage
                  style={styles.imageProfile}
                  source={{
                    uri: story.profile,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.containerData}>
                  <Text style={styles.textName}>
                    {story.name}
                  </Text>
                  <Text style={styles.textLevel}>
                    {getFitnnesLevel(story.level) +
                      " - " +
                      moment(
                        story.date,
                        "YYYY-MM-DD H:m:s"
                      ).fromNow()}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => close()} style={styles.icon}>
                <Icon name="close" color={WhiteColor} size={32} />
              </Pressable>
            </>
          </FastImage>
          {story.owner && (
            <Pressable
              style={styles.iconRemove}
              onPress={() => {
                setConfirmationDeletestory(true);
                dispatch(actionStopStory());
              }}
            >
              <Icon name="trash-outline" color={SignUpColor} size={32} />
            </Pressable>
          )}
        </>
      )}
      <ToastQuestionGeneric
        visible={confirmationDeletestory}
        titleBig="Delete Story"
        title="Are you sure you want to delete the story?"
        options={
          <View style={ToastQuestionStyles.viewButtons}>
            <Pressable
              onPress={() => cancelDelete()}
              style={[
                ToastQuestionStyles.button,
                { backgroundColor: GreenFitrecColor, marginRight: 10 },
              ]}
            >
              <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => deleteHandler()}
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

export default ExpandStory;
