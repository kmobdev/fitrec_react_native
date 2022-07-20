import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SignUpColor, WhiteColor } from "../../Styles";
import ReactNativePickerModule from "react-native-picker-module";

export default class HomeFilters extends Component {
  constructor(props) {
    super(props);
    this.pickerGender = React.createRef();
    this.pickerRange = React.createRef();
    this.state = {
      showActivities: false,
      showRange: false,
      showGender: false,
      showDefault: false,
      showDescriptions: false,
      showGym: false,
      filters: null,
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.visible) {
      await setTimeout(async () => {
        await this.setState({
          showDefault: true,
          showDescriptions: true,
        });
      }, 50);
      await setTimeout(async () => {
        await this.setState({
          showRange: true,
        });
      }, 115);
      await setTimeout(async () => {
        await this.setState({
          showGym: true,
        });
      }, 190);
      await setTimeout(async () => {
        await this.setState({
          showGender: true,
        });
      }, 265);
      await setTimeout(async () => {
        await this.setState({
          showActivities: true,
        });
      }, 340);
      await this.setState({
        filters: this.props.filters,
      });
    } else {
      await setTimeout(async () => {
        await this.setState({
          showDefault: false,
          showDescriptions: false,
        });
      }, 30);
      await setTimeout(async () => {
        await this.setState({
          showGender: false,
        });
      }, 50);
      await setTimeout(async () => {
        await this.setState({
          showGym: false,
        });
      }, 70);
      await setTimeout(async () => {
        await this.setState({
          showRange: false,
        });
      }, 90);
      await setTimeout(async () => {
        await this.setState({
          showActivities: false,
        });
      }, 110);
    }
  };

  applyFilterRange = async (value) => {
    switch (value) {
      case "Less than 1 miles":
        await this.setState({
          filters: {
            ...this.state.filters,
            range: "1",
          },
        });
        break;
      case "Less than 3 miles":
        await this.setState({
          filters: {
            ...this.state.filters,
            range: "3",
          },
        });
        break;
      case "Less than 5 miles":
        await this.setState({
          filters: {
            ...this.state.filters,
            range: "5",
          },
        });
        break;
      case "Less than 10 miles":
        await this.setState({
          filters: {
            ...this.state.filters,
            range: "10",
          },
        });
        break;
      case "Less than 20 miles":
        await this.setState({
          filters: {
            ...this.state.filters,
            range: "20",
          },
        });
        break;
    }
    this.props.setFilter(this.state.filters);
  };

  applyFilterGender = async (value) => {
    switch (value) {
      case "Female":
        await this.setState({
          filters: {
            ...this.state.filters,
            gender: "F",
          },
        });
        break;
      case "Male":
        await this.setState({
          filters: {
            ...this.state.filters,
            gender: "M",
          },
        });
        break;
    }
    this.props.setFilter(this.state.filters);
  };

  applyFilterDefault = async () => {
    await this.setState({
      filters: {
        gender: "",
        range: "",
        activity: [],
        gyms: [],
      },
    });
    this.props.setFilter(this.state.filters, true);
  };

  render() {
    return (
      <View style={styles.viewContent}>
        {this.state.showActivities && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.props.showActivities()}
            >
              {this.state.showDescriptions && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>Activities</Text>
                  </View>
                </View>
              )}
              <Icon name="bicycle" size={38} color={WhiteColor} />
            </Pressable>
          </View>
        )}
        {this.state.showGender && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.pickerGender.current.show()}
            >
              {this.state.showDescriptions && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>Gender</Text>
                  </View>
                </View>
              )}
              <Icon name="people" size={38} color={WhiteColor} />
            </Pressable>
            <ReactNativePickerModule
              pickerRef={this.pickerGender}
              title={"Gender"}
              items={["Male", "Female"]}
              onValueChange={(value) => this.applyFilterGender(value)}
            />
          </View>
        )}
        {this.state.showGym && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.props.showGyms()}
            >
              {this.state.showDescriptions && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>Gym</Text>
                  </View>
                </View>
              )}
              <Icon name="barbell-outline" size={38} color={WhiteColor} />
            </Pressable>
          </View>
        )}
        {this.state.showRange && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.pickerRange.current.show()}
            >
              {this.state.showDescriptions && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>Range</Text>
                  </View>
                </View>
              )}
              <Icon name="map-sharp" size={38} color={WhiteColor} />
            </Pressable>
            <ReactNativePickerModule
              pickerRef={this.pickerRange}
              title={"Range"}
              items={[
                "Less than 1 miles",
                "Less than 3 miles",
                "Less than 5 miles",
                "Less than 10 miles",
                "Less than 20 miles",
              ]}
              onValueChange={(value) => this.applyFilterRange(value)}
            />
          </View>
        )}
        {this.state.showDefault && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.applyFilterDefault()}
            >
              {this.state.showDescriptions && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>Default</Text>
                  </View>
                </View>
              )}
              <Icon name="options" size={38} color={WhiteColor} />
            </Pressable>
          </View>
        )}
        <View style={[styles.viewBubble, styles.viewBubbleBig]}>
          <Pressable style={styles.touchable} onPress={this.props.press}>
            <Text style={[styles.text, styles.bold]}>FILTER</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContent: {
    position: "absolute",
    right: 20,
    bottom: 10,
    alignItems: "center",
  },
  viewBubble: {
    backgroundColor: SignUpColor,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 15,
  },
  viewBubbleSmall: {
    height: 50,
    width: 50,
  },
  viewBubbleBig: {
    height: 65,
    width: 65,
  },
  touchable: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: WhiteColor,
  },
  bold: {
    fontWeight: "bold",
  },
  bubbleSmallDescription: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 6,
    borderRadius: 10,
  },
  viewBubbleSmallDescription: {
    position: "absolute",
    right: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
});
