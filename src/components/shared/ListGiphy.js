import React from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import FastImage from "react-native-fast-image";
import { GlobalStyles } from "../../Styles";

export const ListGiphy = (props) =>
  !props.showStickers ? (
    props.gifs !== undefined && props.gifs.length > 0 ? (
      <View style={styles.container}>
        {props.gifs.map((item) =>
          props.action !== undefined ? (
            <Pressable
              key={item.id}
              style={styles.margin}
              onPress={() => props.action(item)}>
              <View>
                <FastImage
                  style={GlobalStyles.gifImageSmall}
                  source={{
                    uri: item.image,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </Pressable>
          ) : (
            <View key={item.id} style={styles.margin}>
              <View>
                <FastImage
                  style={GlobalStyles.gifImageSmall}
                  source={{
                    uri: item.image,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </View>
          )
        )}
      </View>
    ) : props.sSearch !== undefined && props.sSearch !== "" ? (
      <Text style={GlobalStyles.messageEmpty}>No GIF found</Text>
    ) : (
      <Text style={GlobalStyles.messageEmpty}>Loading...</Text>
    )
  ) : props.stickers !== undefined && props.stickers.length > 0 ? (
    <View style={styles.container}>
      {props.stickers.map((item) =>
        props.action !== undefined ? (
          <Pressable
            key={item.id}
            style={styles.margin}
            onPress={() => props.action(item)}>
            <View>
              <FastImage
                style={GlobalStyles.gifImageSmall}
                source={{
                  uri: item.image,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </Pressable>
        ) : (
          <View key={item.id} style={styles.margin}>
            <View>
              <FastImage
                style={GlobalStyles.gifImageSmall}
                source={{
                  uri: item.image,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
        )
      )}
    </View>
  ) : (
    <Text style={GlobalStyles.messageEmpty}>No Stickers found</Text>
  );

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    marginBottom: 20,
  },
  margin: {
    margin: "1%",
    width: "31.33%",
  },
  name: {
    textAlign: "center",
    alignContent: "center",
  },
});
