import React, { Component } from "react";
import { Text, Pressable, StyleSheet, View, Image } from "react-native";
import { GlobalStyles, GreenFitrecColor, SignUpColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from "react-native-fast-image";

export default class FollowerCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onPressSection, name, username, onPressUnfollow, profileImage } = this.props;
    return (
      <View style={styles.containerRow}>
        <View style={{ flex: 3 }}>
          {profileImage != null ? (
            <FastImage
              style={GlobalStyles.photoProfileCardList}
              source={{ uri: profileImage }}
              resizeMode="cover"
            />
          ) : (
            <Image
              style={GlobalStyles.photoProfileCardList}
              source={require("../../assets/imgProfileReadOnly2.png")}
            />
          )}
        </View>
        <Pressable
          onPress={onPressSection}
          style={styles.sectionText}
        >
          <Text style={styles.textName}>{name}</Text>
          <Text style={styles.textUsername}>@{username}</Text>
        </Pressable>
        <View style={styles.sectionButton}>
          <Pressable
            onPress={onPressUnfollow}
            style={styles.removeButton}
            activeOpacity={0.8}
          >
            <Icon
              name="trash"
              size={24}
              color={SignUpColor}
              style={styles.textCenter}
            />
          </Pressable>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containerRow: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
  },
  sectionText: {
    justifyContent: "center",
    marginLeft: 10,
    flex: 9,
  },
  textName: {
    fontSize: 16,
    fontWeight: "600",
  },
  textUsername: {
    fontSize: 14,
    color: GreenFitrecColor,
  },
  sectionButton: {
    justifyContent: "center",
    flex: 2,
  },
  removeButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: SignUpColor,
    borderRadius: 5,
    marginRight: 0,
  },
  textCenter: {
    textAlign: "center",
  },
});
