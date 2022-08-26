import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  Image,
  FlatList,
} from "react-native";
import {
  GlobalStyles,
  GlobalModal,
  GreenFitrecColor,
  WhiteColor,
  PlaceholderColor,
  SignUpColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from "react-native-fast-image";
import { GROUP_PRIVATE } from "../../constants/Groups";

export const InvitationGroup = (props) =>
  props.visible && (
    <View style={GlobalModal.viewContent}>
      <View
        style={
          (GlobalModal.viewHead,
          { justifyContent: "center", alignContent: "center" })
        }>
        <Text style={GlobalModal.headTitle}>Group Invitation</Text>
        <Pressable style={GlobalModal.buttonClose} onPress={props.close}>
          <Text style={GlobalModal.titleClose}>Close</Text>
        </Pressable>
      </View>
      <ScrollView style={{ padding: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <View>
            {props.group.image === "img/group.png" ||
            null === props.group.image ? (
              <Image
                style={{
                  borderRadius: 100,
                  margin: 10,
                  height: 150,
                  width: 150,
                }}
                source={require("../../assets/imgGroup.png")}
              />
            ) : (
              <Pressable onPress={() => props.expandImage(props.group.image)}>
                <FastImage
                  style={{
                    borderRadius: 100,
                    margin: 10,
                    height: 150,
                    width: 150,
                  }}
                  source={{
                    uri: props.group.image,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Pressable>
            )}
            <Text
              style={{
                color: GreenFitrecColor,
                fontWeight: "bold",
                textAlign: "center",
              }}>
              {props.group.type === GROUP_PRIVATE
                ? "Private Group"
                : "Public Group"}
            </Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                fontWeight: "bold",
                color: GreenFitrecColor,
                fontSize: 18,
                marginRight: 175,
              }}>
              {props.group.name}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: "bold",
                color: PlaceholderColor,
              }}>
              Description
            </Text>
            {"" !== props.group.description ? (
              <Text
                style={{
                  fontWeight: "normal",
                  marginRight: 175,
                  textAlign: "justify",
                }}>
                {props.group.description}
              </Text>
            ) : (
              <Text
                style={{
                  fontWeight: "normal",
                  marginRight: 175,
                  textAlign: "justify",
                  fontStyle: "italic",
                }}>
                No associated description
              </Text>
            )}
          </View>
        </View>
        <View
          style={{ flexDirection: "row", marginTop: 20, alignSelf: "center" }}>
          <Icon name="ios-people" size={40} color={PlaceholderColor} />
          <View style={{ justifyContent: "center", marginLeft: "5%" }}>
            <Text style={{ fontSize: 16, color: GreenFitrecColor }}>
              PARTICIPANTS:{" "}
              {undefined !== props.group.participants &&
                props.group.participants.length}
            </Text>
          </View>
        </View>
        {props.isRequestPending === true ? (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => props.rejectRequest()}
              style={{ flex: 6, marginRight: 5 }}>
              <View style={GlobalStyles.buttonCancel}>
                <Text style={GlobalStyles.textButton}>Reject</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => props.acceptRequest()}
              style={{ flex: 6, marginLeft: 5 }}>
              <View style={GlobalStyles.buttonConfirm}>
                <Text style={GlobalStyles.textButton}>Accept</Text>
              </View>
            </Pressable>
          </View>
        ) : props.group.users.includes(props.sUserKey) ? (
          <Text style={[styles.message, { color: GreenFitrecColor }]}>
            You have already accepted the entry request
          </Text>
        ) : (
          <Text style={[styles.message, { color: SignUpColor }]}>
            You rejected the entry request
          </Text>
        )}
        <View>
          {!props.isAddParticipant ? (
            <FlatList
              data={props.group.participants}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.viewNotificaton}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <View style={{ margin: 10 }}>
                        {null !== item.image ? (
                          <Image
                            style={GlobalStyles.photoProfileCardList}
                            source={{ uri: item.image }}
                          />
                        ) : (
                          <Image
                            style={GlobalStyles.photoProfileCardList}
                            source={require("../../assets/imgGroup.png")}
                          />
                        )}
                      </View>
                      <View
                        style={{ justifyContent: "center", marginLeft: 10 }}>
                        <Text style={styles.textUserReference}>
                          {props.userLoginKey === item.key ? "You" : item.name}
                        </Text>
                        <Text>
                          @
                          {props.userLoginKey === item.key
                            ? "You"
                            : item.username}
                        </Text>
                      </View>
                      {props.group.capitans.includes(item) && (
                        <View style={styles.viewIconRight}>
                          <View style={{ flexDirection: "row" }}>
                            <Icon
                              name="md-help-buoy"
                              size={18}
                              color={SignUpColor}
                            />
                            <Text style={{ marginLeft: 2 }}>Captain</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <FlatList
              data={props.friends}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return !item.invitationsGroup.includes(props.group.key) &&
                  !props.group.users.includes(item.key) ? (
                  <Pressable
                    onPress={() => props.addParticipant(item)}
                    style={{ flexDirection: "row", width: "100%" }}>
                    <View style={{ margin: 10 }}>
                      {item.image === undefined || item.image === null ? (
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
                    </View>
                    <View style={{ justifyContent: "center", marginLeft: 10 }}>
                      <Text style={styles.textUserReference}>{item.name}</Text>
                      <Text>@{item.username}</Text>
                    </View>
                    {props.newParticipants.includes(item) && (
                      <View style={styles.viewIconRight}>
                        <View style={{ flexDirection: "row" }}>
                          <Icon
                            name="md-checkmark-circle"
                            size={24}
                            color={SignUpColor}
                          />
                        </View>
                      </View>
                    )}
                  </Pressable>
                ) : props.group.users.includes(item.key) ? (
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View style={{ margin: 10 }}>
                      {item.image === null || item.image === undefined ? (
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
                    </View>
                    <View style={{ justifyContent: "center", marginLeft: 10 }}>
                      <Text style={styles.textUserReference}>{item.name}</Text>
                      <Text>@{item.username}</Text>
                    </View>
                    {
                      <View
                        style={[
                          styles.viewIconRight,
                          { flexDirection: "row", alignItems: "center" },
                        ]}>
                        <Text style={{ color: SignUpColor }}>Member </Text>
                        <Icon
                          name="md-checkmark-circle"
                          size={24}
                          color={SignUpColor}
                        />
                      </View>
                    }
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View style={{ margin: 10 }}>
                      {item.image === null || item.image === undefined ? (
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
                    </View>
                    <View style={{ justifyContent: "center", marginLeft: 10 }}>
                      <Text style={styles.textUserReference}>{item.name}</Text>
                      <Text>@{item.username}</Text>
                    </View>
                    {
                      <View
                        style={[
                          styles.viewIconRight,
                          { flexDirection: "row", alignItems: "center" },
                        ]}>
                        <Text style={{ color: SignUpColor }}>Invited </Text>
                        <Icon
                          name="md-checkmark-circle"
                          size={24}
                          color={SignUpColor}
                        />
                      </View>
                    }
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );

const styles = StyleSheet.create({
  viewNotificaton: {
    flexDirection: "row",
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
  viewIconRight: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    margin: 20,
    fontWeight: "bold",
  },
});
