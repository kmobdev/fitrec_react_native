import React, { Component, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import {
  GlobalModal,
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { Toast } from "../../components/shared/Toast";
import { connect, useDispatch } from "react-redux";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import FastImage from "react-native-fast-image";

const ShowPeople = (props) => {

  const scrollView = useRef();

  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [toastText, setToastText] = useState("");

  const checkElement = (nIndex) => {
    props.activity.users[nIndex].check =
      !props.activity.users[nIndex].check;
    setRefresh(!refresh);
  };

  const resetMessage = () => {
    props.activity.users.map((element) => {
      element.check = false;
    });
    setMessage("");
  };

  const changeText = (text) => {
    setMessage(text);
    if (message === "") {
      resetMessage();
    }
  };

  const sendMessage = () => {
    if (message === "") {
      showToast("The message field cannot be empty");
    } else if (
      0 === props.activity.users.filter((element) => element.check).length
    ) {
      showToast("Select a user");
    } else {
      props.sendMessage(message);
      setMessage("");
    }
  };

  const showToast = (text) => {
    setToastText(text);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const redirectionViewProfile = (idFitrec) => {
    dispatch(actionGetProfile(idFitrec, true));
    props.navigation.navigate("ProfileViewDetailsHome");
  };

  const uncheckUsers = () => {
    props.activity.users.map((element) => {
      element.check = false;
    });
  };


  const renderImage = (image = null) => {
    return (
      <>
        {null !== image ? (
          <FastImage
            style={styles.imageStyle}
            source={{
              uri: image,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image
            style={styles.imageStyle}
            source={require("../../assets/profile.png")}
          />
        )}
      </>
    );
  };
  return (
    props.visible &&
    null !== props.activity && (
      <View style={GlobalModal.viewContent}>
        <View style={GlobalModal.viewHead}>
          <Text style={GlobalModal.headTitle}>
            {props.activity.name}
          </Text>
          <Pressable
            style={GlobalModal.buttonClose}
            onPress={() => {
              props.close();
              resetMessage();
              uncheckUsers();
            }}
          >
            <Text style={GlobalModal.titleClose}>Close</Text>
          </Pressable>
        </View>
        <ScrollView style={{ padding: 20 }}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            {message !== "" && (
              <Pressable
                onPress={() => {
                  resetMessage();
                }}
                style={{ position: "absolute", zIndex: 999, bottom: 0.5 }}
              >
                <Icon name={"close"} size={24} color={SignUpColor} />
              </Pressable>
            )}
            <TextInput
              placeholder="Type your message"
              value={message}
              onFocus={() => {
                if (null !== scrollView && undefined !== scrollView)
                  scrollView.current.scrollToEnd({ animated: true });
              }}
              style={[
                styles.messageInput,
                { paddingLeft: message !== "" ? 20 : 0 },
              ]}
              onChangeText={(text) => changeText(text)}
            />
            <Pressable
              onPress={() => sendMessage()}
              style={styles.sendIcon}
            >
              <Icon
                name={message !== "" ? "md-send" : "md-text"}
                size={28}
                color={SignUpColor}
              />
            </Pressable>
          </View>
          <View style={styles.peopleContainer}>
            {props.activity.users.map((element, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (message !== "") {
                    checkElement(index);
                  } else {
                    redirectionViewProfile(element.id);
                  }
                }}
                style={styles.itemContainer}
              >
                {renderImage(element.image)}
                <Text
                  style={{ color: PlaceholderColor, textAlign: "center" }}
                >
                  {element.username}
                </Text>
                {message !== "" && (
                  <View style={{ position: "absolute", right: 0, top: 0 }}>
                    {undefined !== element.check && element.check ? (
                      <Icon
                        name="md-checkmark-circle"
                        size={24}
                        color={SignUpColor}
                      />
                    ) : (
                      <Icon
                        name="ios-add-circle-outline"
                        size={24}
                        color={PlaceholderColor}
                      />
                    )}
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <Toast toastText={toastText} />
      </View>
    )
  );

}

const styles = StyleSheet.create({
  peopleContainer: {
    flexDirection: "row",
    marginTop: 40,
    width: "100%",
    flexWrap: "wrap",
  },
  itemContainer: {
    alignItems: "center",
    width: "33%",
    marginBottom: 10,
    padding: 10,
  },
  messageInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    paddingBottom: 5,
    width: "100%",
    fontSize: 16,
    paddingRight: 25,
  },
  sendIcon: {
    position: "absolute",
    zIndex: 999,
    right: 0,
    bottom: 0.5,
  },
  imageStyle: {
    width: 60,
    height: 60,
    backgroundColor: WhiteColor,
    borderRadius: 100,
    marginBottom: 5,
  },
});

export default ShowPeople;
