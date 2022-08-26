import React from "react";
import {
  PlaceholderColor,
  GreenFitrecColor,
  GlobalStyles,
  SignUpColor,
} from "../../Styles";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getFitnnesLevel } from "../shared/SharedFunctions";

export const ShowHead = (props) => {
  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <Pressable onPress={props.redirectionViewProfile} style={styles.leftView}>
        {null === props.image ? (
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../../assets/imgProfileReadOnly.png")}
          />
        ) : (
          <Image
            style={{ height: 50, width: 50, borderRadius: 100 }}
            source={{ uri: props.image }}
          />
        )}
        <View style={{ justifyContent: "center", marginLeft: 5 }}>
          <Text
            style={{
              color: GreenFitrecColor,
              fontWeight: "bold",
              fontSize: 16,
            }}>
            {props.username}
          </Text>
          <Text style={GlobalStyles.textMuted}>
            {getFitnnesLevel(props.level)}
          </Text>
        </View>
      </Pressable>
      <View style={styles.rightView}>
        {undefined !== props.bShowOptions && props.bShowOptions ? (
          <Pressable onPress={() => props.fCloseChangeTags()}>
            <Icon name="close-circle" size={22} color={SignUpColor} />
          </Pressable>
        ) : (
          <Pressable onPress={() => props.options()}>
            <Icon
              name="ellipsis-vertical-outline"
              size={22}
              color={GreenFitrecColor}
            />
          </Pressable>
        )}
        <Text style={{ color: PlaceholderColor }}>{props.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftView: {
    width: "70%",
    flexDirection: "row",
  },
  rightView: {
    width: "30%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
