import React from "react";
import {
  GlobalMessages,
  WhiteColor,
  GreenFitrecColor,
  SignUpColor,
} from "../../Styles";
import { StyleSheet, View, Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { validateCharacters } from "../shared/SharedFunctions";

export const ShowFooter = (props) => {
  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 6, flexDirection: "row" }}>
          <View>
            {props.isLiked ? (
              <Pressable
                onPress={props.pressUnLike}
                style={styles.buttonLike}
              >
                <Icon name="thumb-up" size={26} color={SignUpColor} />
                <Text style={[styles.textLike, { color: SignUpColor }]}>
                  Like
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={props.pressAddLike}
                style={styles.buttonLike}
              >
                <Icon
                  name="thumb-up-outline"
                  size={26}
                  color={GreenFitrecColor}
                />
                <Text style={styles.textLike}>Like</Text>
              </Pressable>
            )}
          </View>
          {props.existTags && (
            <View style={styles.containerTagIcon}>
              <Pressable
                onPress={props.showTags}
                style={styles.buttonTagIcon}
              >
                <Icon
                  name="account-circle"
                  size={26}
                  color={GreenFitrecColor}
                />
              </Pressable>
            </View>
          )}
        </View>
        <View style={{ flex: 6, flexDirection: "row" }}>
          {props.likes > 0 && (
            <View style={{ width: "95%", alignItems: "flex-end" }}>
              <Pressable
                onPress={props.showLikes}
                style={[
                  GlobalMessages.viewGlobalBubble,
                  {
                    marginTop: 0,
                    justifyContent: "center",
                    flexDirection: "row",
                  },
                ]}
              >
                <Text style={styles.textLike}>{props.likes}</Text>
                <View
                  style={[
                    GlobalMessages.viewBubble,
                    { backgroundColor: GreenFitrecColor },
                  ]}
                >
                  <Icon name="thumb-up" size={18} color={WhiteColor} />
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {"" !== props.text && (
        <View>
          <Text style={styles.textPost}>{validateCharacters(props.text)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonLike: {
    flexDirection: "row",
    alignItems: "center",
  },
  textLike: {
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
    color: GreenFitrecColor,
    marginRight: 2,
  },
  textPost: {
    color: GreenFitrecColor,
    marginTop: 10,
  },
  containerTagIcon: {
    borderRadius: 100,
    alignItems: "flex-start",
    marginStart: 10,
    height: "100%",
  },
  buttonTagIcon: {
    marginVertical: "auto",
  },
});
