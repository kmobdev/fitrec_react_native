import React, { Component, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SignUpColor, WhiteColor } from "../../Styles";

const PalsOptions = (props) => {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showGroupMessage, setShowGroupMessage] = useState(false);

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        setShowNewMessage(true);
      }, 50);
      setTimeout(() => {
        setShowGroupMessage(true);
      }, 120);
    } else {
      setTimeout(() => {
        setShowGroupMessage(false);
      }, 50);
      setTimeout(() => {
        setShowNewMessage(false);
      }, 120);
    }
  }, [props]);

  return (
    <View style={styles.viewContent}>
      {showNewMessage && (
        <Pressable onPress={props.newMessage}>
          <View
            style={[
              styles.viewBubble,
              styles.viewBubbleSmall,
              styles.touchable,
            ]}>
            {showNewMessage && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>New Message</Text>
                </View>
              </View>
            )}
            <Icon name="create" size={26} color={WhiteColor} />
          </View>
        </Pressable>
      )}
      {showGroupMessage && (
        <Pressable onPress={props.groupMessage}>
          <View
            style={[
              styles.viewBubble,
              styles.viewBubbleSmall,
              styles.touchable,
            ]}>
            {showGroupMessage && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>Message Group</Text>
                </View>
              </View>
            )}
            <Icon name="people" size={26} color={WhiteColor} />
          </View>
        </Pressable>
      )}
      <Pressable onPress={props.openOptions}>
        <View
          style={[styles.viewBubble, styles.viewBubbleBig, styles.touchable]}>
          <Icon name="add" size={32} color={WhiteColor} />
        </View>
      </Pressable>
    </View>
  );
};

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
    justifyContent: "center",
    alignItems: "center",
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

export default PalsOptions;
