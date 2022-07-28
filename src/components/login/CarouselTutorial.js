import React, { Component } from "react";
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

export default class CarouselTutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayImage: 1,
    };
  }

  setDisplayImageOne = () => {
    this.setState({
      displayImage: 1,
    });
  };

  nextPage = () => {
    if (4 === this.state.displayImage) {
      this.setState({ displayImage: 1 });
      this.props.close();
    } else this.setState({ displayImage: this.state.displayImage + 1 });
  };

  backPage = () => {
    if (1 === this.state.displayImage) {
      this.setState({ displayImage: 1 });
      this.props.close();
    } else this.setState({ displayImage: this.state.displayImage - 1 });
  };

  onSwipe = (gestureName, gestureState) => {
    const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_LEFT:
        this.nextPage();
        break;
      case SWIPE_RIGHT:
        this.backPage();
        break;
      default:
        break;
    }
  };

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    if (this.props.visible) {
      return (
        <View style={styles.viewFullAbsolute}>
          <GestureRecognizer
            onSwipe={this.onSwipe}
            config={config}
            style={{
              flex: 1,
              backgroundColor: this.state.backgroundColor,
            }}
          >
            <ImageBackground
              source={require("../../assets/tutorial/background.png")}
              style={GlobalStyles.fullImage}
            >
              {this.state.displayImage === 1 && (
                <Image
                  source={require("../../assets/tutorial/1.png")}
                  resizeMode="stretch"
                  style={styles.fullImage}
                />
              )}
              {this.state.displayImage === 2 && (
                <Image
                  source={require("../../assets/tutorial/2.png")}
                  style={styles.fullImage}
                  resizeMode="stretch"
                />
              )}
              {this.state.displayImage === 3 && (
                <Image
                  source={require("../../assets/tutorial/3.png")}
                  style={styles.fullImage}
                  resizeMode="stretch"
                />
              )}
              {this.state.displayImage === 4 && (
                <Image
                  source={require("../../assets/tutorial/4.png")}
                  style={styles.fullImage}
                  resizeMode="stretch"
                />
              )}
              <View style={styles.viewControls}>
                <Pressable
                  style={styles.buttonControls}
                  onPress={this.props.close}
                >
                  <Text style={{ color: SignUpColor }}>SKIP</Text>
                </Pressable>
                <View style={styles.viewButtonControls}>
                  <Pressable
                    onPress={() => {
                      this.setState({ displayImage: 1 });
                    }}
                  >
                    <Icon
                      name={
                        this.state.displayImage === 1
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
                      this.setState({ displayImage: 2 });
                    }}
                  >
                    <Icon
                      name={
                        this.state.displayImage === 2
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
                      this.setState({ displayImage: 3 });
                    }}
                  >
                    <Icon
                      name={
                        this.state.displayImage === 3
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
                      this.setState({ displayImage: 4 });
                    }}
                  >
                    <Icon
                      name={
                        this.state.displayImage === 4
                          ? "ios-radio-button-on"
                          : "ios-radio-button-off"
                      }
                      size={18}
                      color={GreenFitrecColor}
                    />
                  </Pressable>
                </View>
                <Pressable
                  style={styles.buttonControls}
                  onPress={() => this.nextPage()}
                >
                  <Text style={{ color: SignUpColor }}>NEXT</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </GestureRecognizer>
        </View>
      );
    } else {
      this.setDisplayImageOne;
      return null;
    }
  }
}

const styles = StyleSheet.create({
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
