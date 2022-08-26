import React from "react";
import { Text, StyleSheet, Pressable, View, Image } from "react-native";
import { GlobalStyles, PlaceholderColor, GreenFitrecColor } from "../../Styles";
import FastImage from "react-native-fast-image";

export const ListPeople = (props) =>
  props.people !== undefined && props.people.length > 0 ? (
    props.grid ? (
      <View style={styles.container}>
        {props.people.map((item) =>
          props.action !== undefined ? (
            <Pressable
              key={item.key + item.id}
              style={styles.margin}
              onPress={() => props.action(item)}>
              <View>
                {item.image === null ? (
                  <Image
                    style={GlobalStyles.photoProfileCardList}
                    source={require("../../assets/profile.png")}
                  />
                ) : (
                  <FastImage
                    style={GlobalStyles.photoProfileCardList}
                    source={{
                      uri: item.image,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                )}
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <View key={item.key + item.id} style={styles.margin}>
              {item.image === null ? (
                <Image
                  style={GlobalStyles.photoProfileCardList}
                  source={require("../../assets/profile.png")}
                />
              ) : (
                <FastImage
                  style={GlobalStyles.photoProfileCardList}
                  source={{
                    uri: item.image,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
              <View>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          )
        )}
      </View>
    ) : (
      <View style={styles.container}>
        {props.people.map((item) =>
          props.action !== undefined ? (
            <View key={item.key + item.id} style={styles.row}>
              <Pressable
                style={styles.margin}
                onPress={() => props.action(item)}
                style={styles.rowTouchable}>
                {null === item.image ? (
                  <Image
                    style={GlobalStyles.photoProfileCardList}
                    source={require("../../assets/imgGroup.png")}
                  />
                ) : (
                  <Image
                    style={GlobalStyles.photoProfileCardList}
                    source={{ uri: item.image }}
                  />
                )}
                <View style={styles.rowText}>
                  <Text style={styles.textUserReference}>{item.name}</Text>
                  <Text style={{ fontStyle: "italic" }}>{item.username}</Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <View key={item.key + item.id} style={styles.row}>
              {null === item.image ? (
                <Image
                  style={GlobalStyles.photoProfileCardList}
                  source={require("../../assets/imgGroup.png")}
                />
              ) : (
                <Image
                  style={GlobalStyles.photoProfileCardList}
                  source={{ uri: item.image }}
                />
              )}
              <View style={styles.rowText}>
                <Text style={styles.textUserReference}>{item.name}</Text>
                <Text style={{ fontStyle: "italic" }}>{item.username}</Text>
              </View>
            </View>
          )
        )}
      </View>
    )
  ) : null;

const styles = StyleSheet.create({
  margin: {
    margin: 5,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    margin: 5,
    borderTopWidth: 0.4,
    marginTop: 15,
  },
  name: {
    textAlign: "center",
    alignContent: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: PlaceholderColor,
    padding: 5,
  },
  rowText: {
    justifyContent: "center",
    marginLeft: 10,
    width: "70%",
  },
  rowTouchable: {
    flexDirection: "row",
    width: "100%",
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
});
