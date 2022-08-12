import React, { Component, useState } from "react";
import {
  View,
  ImageBackground,
  Image,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import {
  WhiteColor,
  GlobalStyles,
  SignUpColor,
  GreenFitrecColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

const CarouselTutorial = (props) => {
  const [displayImage, setDisplayImage] = useState(1);

  const setDisplayImageOne = () => {
    this.setState({
      displayImage: 1,
    });
  };

  const nextPage = () => {
    if (4 === displayImage) {
      setDisplayImage(1);
      props.close();
    } else setDisplayImage(displayImage + 1);
  };

  const backPage = () => {
    if (1 === displayImage) {
      setDisplayImage(1);
      props.close();
    } else setDisplayImage(displayImage - 1);
  };

  const onSwipe = (gestureName, gestureState) => {
    const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_LEFT:
        nextPage();
        break;
      case SWIPE_RIGHT:
        backPage();
        break;
      default:
        break;
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  if (props.visible) {
    return (
      <View style={styles.viewFullAbsolute}>
        <GestureRecognizer
          onSwipe={onSwipe}
          config={config}
          style={styles.gestureRecognizerContainer}
        >
          <ImageBackground
            source={require("../../assets/tutorial/background.png")}
            style={GlobalStyles.fullImage}
          >
            {displayImage === 1 && (
              <Image
                source={require("../../assets/tutorial/1.png")}
                resizeMode="stretch"
                style={styles.fullImage}
              />
            )}
            {displayImage === 2 && (
              <Image
                source={require("../../assets/tutorial/2.png")}
                style={styles.fullImage}
                resizeMode="stretch"
              />
            )}
            {displayImage === 3 && (
              <Image
                source={require("../../assets/tutorial/3.png")}
                style={styles.fullImage}
                resizeMode="stretch"
              />
            )}
            {displayImage === 4 && (
              <Image
                source={require("../../assets/tutorial/4.png")}
                style={styles.fullImage}
                resizeMode="stretch"
              />
            )}
            <View style={styles.viewControls}>
              <Pressable style={styles.buttonControls} onPress={props.close}>
                <Text style={{ color: SignUpColor }}>SKIP</Text>
              </Pressable>
              <View style={styles.viewButtonControls}>
                <Pressable onPress={() => setDisplayImage(1)}>
                  <Icon
                    name={
                      displayImage === 1
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                    }
                    style={styles.iconControls}
                    size={18}
                    color={GreenFitrecColor}
                  />
                </Pressable>
                <Pressable onPress={() => setDisplayImage(2)}>
                  <Icon
                    name={
                      displayImage === 2
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                    }
                    style={styles.iconControls}
                    size={18}
                    color={GreenFitrecColor}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setDisplayImage(3);
                  }}
                >
                  <Icon
                    name={
                      displayImage === 3
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                    }
                    style={styles.iconControls}
                    size={18}
                    color={GreenFitrecColor}
                  />
                </Pressable>
                <Pressable onPress={() => setDisplayImage(4)}>
                  <Icon
                    name={
                      displayImage === 4
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                    }
                    size={18}
                    color={GreenFitrecColor}
                  />
                </Pressable>
              </View>
              <Pressable style={styles.buttonControls} onPress={nextPage}>
                <Text style={{ color: SignUpColor }}>NEXT</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </GestureRecognizer>
      </View>
    );
  } else {
    setDisplayImageOne;
    return null;
  }
};

export default CarouselTutorial;

const styles = StyleSheet.create({
  gestureRecognizerContainer: {
    flex: 1,
  },
  viewFullAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: WhiteColor,
  },
  viewControls: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    right: 0,
    left: 0,
    justifyContent: "center",
  },
  viewButtonControls: {
    flexDirection: "row",
    marginLeft: "15%",
    marginRight: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonControls: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 5,
  },
  iconControls: {
    marginRight: 10,
  },
  fullImage: {
    width: "100%",
    padding: 10,
    height: "100%",
  },
});
