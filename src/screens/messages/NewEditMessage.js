import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SearchUsername } from "../../components/chat/SearchUsername";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { PlaceholderColor, WhiteColor } from "../../Styles";
import Conversation, { chatStyles } from "../../components/chat/Conversation";
import { useDispatch, useSelector } from "react-redux";
import { actionGetUserFriends, actionSetConversation } from "../../redux/actions/ChatActions";
import { Toast } from "../../components/shared/Toast";
import FastImage from "react-native-fast-image";

const NewEditMessage = (props) => {

  const friendsProps = useSelector((state) => state.reducerListFriends);
  const session = useSelector((state) => state.reducerSession);

  const dispatch = useDispatch();

  const [showConversation, setShowConversation] = useState(false);
  const [conversationSelect, setConversationSelect] = useState(null);
  const [toastText, setToastText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(actionGetUserFriends({
      accountId: session.account.key,
    }));
  }, [])

  useEffect(() => {
    if (
      friendsProps.friends.length > 0 &&
      null !== conversationSelect
    ) {
      for (var i = 0; i < friendsProps.friends.length; i++) {
        if (
          friendsProps.friends[i].userFriendKey ===
          conversationSelect.userFriendKey
        ) {
          setConversationSelect(friendsProps.friends[i]);
        }
      }
    }
  }, [friendsProps])

  const showConversationHandler = (oFriend) => {
    let oConversation = {
      key: oFriend.conversation,
      type: 1,
      users: [
        {
          id: oFriend.id,
          key: oFriend.key,
          name: oFriend.name,
          username: oFriend.username,
          image: oFriend.image,
        },
      ],
    };
    dispatch(actionSetConversation(oConversation));
    dispatch(actionSetConversation(oFriend.conversation, session.account.key));
    props.navigation.navigate("Messages");
  };

  const searchPeople = (search) => {
    return friendsProps.friends.filter(function (item) {
      return (
        item.name.toUpperCase().includes(search.toUpperCase()) ||
        item.username.toUpperCase().includes(search.toUpperCase())
      );
    });
  };

  const { friends: aFriends } = friendsProps;
  return (
    <View style={{ flex: 1, backgroundColor: WhiteColor }}>
      {aFriends && aFriends.length > 0 ? (
        <>
          <SearchUsername
            value={search}
            change={(text) => setSearch(text)}
            clean={() => setSearch("")}
          />
          <View>
            <FlatList
              data={searchPeople(search)}
              extraData={refresh}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => showConversationHandler(item)}>
                  <View style={styles.viewItem}>
                    {item.image ? (
                      <FastImage
                        style={[
                          chatStyles.viewMessageItemImageProfile,
                          { borderRadius: 100 },
                        ]}
                        source={{
                          uri: item.image,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <Image
                        style={styles.viewMessageItemImageProfile}
                        source={require("../../assets/imgProfileReadOnly.png")}
                      />
                    )}
                    <View style={styles.viewMessageData}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemUsername}>
                        @{item.username}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              styles.textCenter,
              styles.textGray,
              styles.mgT20,
              styles.fontBold,
            ]}
          >
            You currently have no pals, add users to your pals list
          </Text>
        </View>
      )}
      <Conversation
        visible={showConversation}
        conversation={conversationSelect}
        close={() => setShowConversation(false)}
      />
      <Toast toastText={toastText} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewMessageItemImageProfile: {
    width: 80,
    height: 80,
  },
  viewMessageData: {
    justifyContent: "center",
    marginLeft: 10,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  itemUsername: {
    color: "gray",
    marginBottom: 2,
  },
  viewItem: {
    flexDirection: "row",
    borderBottomColor: PlaceholderColor,
    borderBottomWidth: 0.5,
    padding: 8,
  },
  mgT20: {
    marginTop: 20,
  },
  fontBold: {
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
  },
  textGray: {
    color: PlaceholderColor,
  },
});

export default NewEditMessage;
