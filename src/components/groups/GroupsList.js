import React, { Component, useState } from "react";
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
  PlaceholderColor,
  SignUpColor,
} from "../../Styles";
import { connect, useSelector } from "react-redux";
import { Toast } from "../shared/Toast";
import CheckEmpty from "../../assets/check/empty.png";
import Icon from "react-native-vector-icons/Ionicons";
import { GROUP_PRIVATE, GROUP_PUBLIC } from "../../constants/Groups";

const GroupsList = (props) => {

  const session = useSelector((state) => state.reducerSession);

  const [refresh, setRefresh] = useState(false);
  const [groups, setGroups] = useState(null);

  const selectGroup = (oGroup) => {
    oGroup.selected =
      oGroup.selected === undefined || oGroup.selected === false ? true : false;
    setRefresh(!refresh)
  };

  const close = () => {
    var aGroups = [];
    props.groups.forEach((oGroup) => {
      oGroup.selected = false;
      aGroups.push(oGroup);
    });
    setGroups(aGroups)
    props.close();
  };

  const sendInvitations = () => {
    var aGroups = props.groups.filter(
      (element) => element.selected === true
    );
    var oMember = {
      key: props.pal.key,
      id: props.pal.id,
    };
    var oSender = {
      key: session.account.key,
      name: session.account.name,
      id: session.account.id,
    };
    props.sendInvitations({
      groups: aGroups,
      sender: oSender,
      member: oMember,
    });
  };

  return (
    props.visible && (
      <View style={GlobalModal.viewContent}>
        <View
          style={
            (GlobalModal.viewHead,
            {
              justifyContent: "center",
              alignContent: "center",
              borderBottomColor: PlaceholderColor,
              borderBottomWidth: 0.5,
            })
          }
        >
          <Text style={GlobalModal.headTitle}>Your Groups</Text>
          {props.groups !== undefined &&
            props.groups.filter((element) => element.isCapitan === true)
              .length === 0 && (
              <Pressable
                style={GlobalModal.buttonClose}
                onPress={() => {
                  close();
                }}
              >
                <Text style={GlobalModal.titleClose}>Close</Text>
              </Pressable>
            )}
        </View>
        {props.groups !== undefined &&
          props.groups.filter(
            (element) =>
              (element.type === GROUP_PRIVATE && element.isCapitan === true) ||
              element.type === GROUP_PUBLIC
          ).length > 0 ? (
          <ScrollView style={styles.listView}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Pressable
                onPress={() => {
                  close();
                }}
                style={{ flex: 6, marginRight: 5 }}
              >
                <View style={GlobalStyles.buttonCancel}>
                  <Text style={GlobalStyles.textButton}>Cancel</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  sendInvitations();
                }}
                style={{ flex: 6, marginLeft: 5 }}
              >
                <View style={GlobalStyles.buttonConfirm}>
                  <Text style={GlobalStyles.textButton}>
                    Confirm
                    {undefined !==
                      props.groups.filter(
                        (element) => element.selected === true
                      ).length &&
                      null !==
                      props.groups.filter(
                        (element) => element.selected === true
                      ).length &&
                      props.groups.filter(
                        (element) => element.selected === true
                      ).length > 0
                      ? " (" +
                      props.groups
                        .filter((element) => element.selected === true)
                        .length.toString() +
                      ")"
                      : ""}
                  </Text>
                </View>
              </Pressable>
            </View>
            <FlatList
              data={props.groups}
              keyExtractor={(item, index) => index.toString()}
              extraData={refresh}
              renderItem={({ item }) => {
                return (
                  <View style={styles.viewNotificaton}>
                    {(item.type === GROUP_PUBLIC ||
                      (item.type === GROUP_PRIVATE && item.isCapitan)) &&
                      !props.groupsPal.filter(
                        (oElement) => oElement.group === item.key
                      ).length > 0 &&
                      !props.invitations.filter(
                        (oElement) => oElement.id === item.key
                      ).length > 0 ? (
                      <Pressable
                        onPress={() => selectGroup(item)}
                        style={{ flexDirection: "row", width: "100%" }}
                      >
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
                        <View
                          style={{
                            justifyContent: "center",
                            marginLeft: 10,
                            marginRight: 175,
                          }}
                        >
                          <Text style={styles.textUserReference}>
                            {item.name.length > 25
                              ? item.name.substring(0, 22) + "..."
                              : item.name}
                          </Text>
                          <Text>
                            {item.participants.length}{" "}
                            {item.participants.length > 1
                              ? "Members"
                              : "Member"}
                          </Text>
                        </View>
                        <View style={styles.viewIconRight}>
                          {item.selected ? (
                            <Icon
                              name="md-checkmark-circle"
                              size={24}
                              color={SignUpColor}
                            />
                          ) : (
                            <Image source={CheckEmpty} />
                          )}
                        </View>
                      </Pressable>
                    ) : (
                      <View
                        onPress={() => selectGroup(item)}
                        style={{ flexDirection: "row", width: "100%" }}
                      >
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
                        <View
                          style={{
                            justifyContent: "center",
                            marginLeft: 10,
                            marginRight: 175,
                          }}
                        >
                          <Text style={styles.textUserReference}>
                            {item.name.length > 23
                              ? item.name.substring(0, 20) + "..."
                              : item.name}
                          </Text>
                          <Text>
                            {item.participants.length}{" "}
                            {item.participants.length > 1
                              ? "Members"
                              : "Member"}
                          </Text>
                        </View>
                        <View style={styles.viewIconRight}>
                          <Text
                            style={{
                              color: GreenFitrecColor,
                              fontWeight: "bold",
                            }}
                          >
                            {props.groupsPal.filter(
                              (oElement) => oElement.group === item.key
                            ).length > 0 ? (
                              "Member"
                            ) : item.type === GROUP_PUBLIC ||
                              (item.type === GROUP_PRIVATE &&
                                item.isCapitan) ? (
                              "Invited"
                            ) : (
                              <Icon
                                name="close-circle-outline"
                                size={24}
                                color={SignUpColor}
                              />
                            )}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          </ScrollView>
        ) : (
          <Text style={GlobalStyles.messageEmpty}>
            You currently have no groups in which you are captain
          </Text>
        )}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  viewNotificaton: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: PlaceholderColor,
    padding: 5,
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
  listView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default GroupsList;
