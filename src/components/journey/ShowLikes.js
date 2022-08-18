import React, { Component } from "react";
import {
  Text,
  View,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { GlobalModal, PlaceholderColor, GreenFitrecColor } from "../../Styles";
import { connect, useSelector } from "react-redux";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import FastImage from "react-native-fast-image";
import { getFitnnesLevel } from "../shared/SharedFunctions";

const ShowLikes = (props) => {

  const session = useSelector((state) => state.reducerSession);
  const journeyProps = useSelector((state) => state.reducerJourney);

  return (
    props.visible && (
      <View style={GlobalModal.viewContent}>
        <View style={GlobalModal.viewHead}>
          <Text style={GlobalModal.headTitle}>Users liked</Text>
          <Pressable
            style={GlobalModal.buttonClose}
            onPress={props.close}
          >
            <Text style={GlobalModal.titleClose}>Close</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          {journeyProps.usersLiked !== undefined &&
            journeyProps.usersLiked.length > 0 ? (
            <FlatList
              data={journeyProps.usersLiked}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: PlaceholderColor,
                  }}
                >
                  <Pressable
                    style={{
                      width: "100%",
                      padding: 10,
                      flexDirection: "row",
                    }}
                    onPress={() => props.redirectionViewProfile(item.id)}
                  >
                    {null === item.image ? (
                      <Image
                        style={{ height: 80, width: 80 }}
                        source={require("../../assets/imgProfileReadOnly.png")}
                      />
                    ) : (
                      <FastImage
                        style={{ height: 80, width: 80, borderRadius: 100 }}
                        source={{
                          uri: item.image,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                    {session.account.id !== item.id ? (
                      <View
                        style={{
                          justifyContent: "center",
                          marginLeft: 10,
                          marginRight: 75,
                        }}
                      >
                        <Text style={styles.textUserReference}>
                          {item.name} @{item.username}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          {getFitnnesLevel(item.level)}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: "center",
                          marginLeft: 10,
                          marginRight: 75,
                        }}
                      >
                        <Text style={styles.textUserReference}>You</Text>
                        <Text style={{ fontSize: 14 }}>
                          {getFitnnesLevel(item.level)}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              )}
            />
          ) : (
            <LoadingSpinner
              visible={!journeyProps.statusGetLikesResponse}
            />
          )}
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
});


export default ShowLikes;
