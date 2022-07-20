import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SignUpColor, WhiteColor } from "../../Styles";

export default class PalsOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewMessage: false,
      showGroupMessage: false,
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.visible) {
      await setTimeout(async () => {
        await this.setState({
          showNewMessage: true,
        });
      }, 50);
      await setTimeout(async () => {
        await this.setState({
          showGroupMessage: true,
        });
      }, 115);
    } else {
      await setTimeout(async () => {
        await this.setState({
          showGroupMessage: false,
        });
      }, 30);
      await setTimeout(async () => {
        await this.setState({
          showNewMessage: false,
        });
      }, 50);
    }
  };

  render() {
    return (
      <View style={styles.viewContent}>
        {this.state.showNewMessage && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.props.newMessage()}
            >
              {this.state.showNewMessage && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>New Message</Text>
                  </View>
                </View>
              )}
              <Icon name="create" size={34} color={WhiteColor} />
            </Pressable>
          </View>
        )}
        {this.state.showGroupMessage && (
          <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
            <Pressable
              style={styles.touchable}
              onPress={() => this.props.groupMessage()}
            >
              {this.state.showGroupMessage && (
                <View style={styles.viewBubbleSmallDescription}>
                  <View style={styles.bubbleSmallDescription}>
                    <Text style={styles.text}>Message Group</Text>
                  </View>
                </View>
              )}
              <Icon name="people" size={34} color={WhiteColor} />
            </Pressable>
          </View>
        )}
        <View style={[styles.viewBubble, styles.viewBubbleBig]}>
          <Pressable
            style={[styles.touchable, { alignSelf: "center" }]}
            onPress={() => this.props.openOptions()}
          >
            <Icon name="add" size={32} color={WhiteColor} />
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
    marginTop: 3,
  },
  text: {
    color: WhiteColor,
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
    width: 140,
  },
});
