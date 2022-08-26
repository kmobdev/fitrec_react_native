import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  RefreshControl,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import {
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
  GlobalMessages,
  GlobalStyles,
  ToastQuestionGenericStyles,
  GreenFitrecColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { SearchUsername } from "../../components/chat/SearchUsername";
import Conversation from "../../components/chat/Conversation";
import {
  actionListMessages,
  actionDeleteConversation,
  actionCreateChatGroup,
  actionGetMessages,
  actionSetConversation,
} from "../../redux/actions/ChatActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Toast } from "../../components/shared/Toast";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GetUserAccount } from "../../redux/services/FirebaseServices";
import {
  actionGetMyFriends,
  actionGetProfile,
} from "../../redux/actions/ProfileActions";
import PeopleList from "../../components/chat/PeopleList";
import GroupChat from "../../components/chat/GroupChat";
import FastImage from "react-native-fast-image";
import PalsOptions from "../../components/pals/PalsOptions";
import { actionCleanNavigation } from "../../redux/actions/NavigationActions";

const ListMessages = (props) => {
  const oConversationRows = useRef();

  const session = useSelector((state) => state.reducerSession);
  const messages = useSelector((state) => state.reducerListMessages);
  const palsProps = useSelector((state) => state.reducerMyPals);

  const dispatch = useDispatch();

  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [conversationSelect, setConversationSelect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastText, setToastText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [showListPals, setShowListPals] = useState(false);
  const [showGroupConversation, setShowGroupConversation] = useState(false);
  const [showNameNewChatGroup, setShowNameNewChatGroup] = useState(false);
  const [nameChatGroup, setNameChatGroup] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [membersNewChatGroup, setMembersNewChatGroup] = useState([]);

  useEffect(() => {
    // console.log('messages ============= >>>>> ', messages);
    setLoading(true);
    dispatch(actionListMessages(session.account.key));
    if (
      palsProps.myFriends.status !== true &&
      palsProps.myFriends.length === 0
    ) {
      dispatch(actionGetMyFriends(session.account.key));
    }
    if (null !== conversationSelect) {
      setShowConversation(true);
      for (var i = 0; i < messages.messages.length; i++) {
        if (messages.messages[i].key === conversationSelect.key) {
          setConversationSelect(messages.messages[i]);
        }
      }
    }
    var sConversationKey = messages.sConversationKey;
    if (null !== sConversationKey && messages.messages.length > 0) {
      messages.messages.forEach((oElement) => {
        if (oElement.key === sConversationKey) {
          showConversationHandler(oElement);
        }
      });
      dispatch(actionCleanNavigation());
    }
    setLoading(false);
    setRefreshing(false);
    setRefresh(!refresh);
  }, [messages]);

  const redirectNewMessage = () => {
    props.navigation.navigate("NewEditMessage");
    setShowOptions(false);
  };

  const setShowDeleteHandler = () => {
    setShowDelete(true);
    setShowOptions(false);
  };

  const showConversationHandler = (conversation) => {
    let conversationObj = {
      key: conversation.key,
      type: conversation.type,
      users: conversation.users,
    };
    dispatch(actionSetConversation(conversationObj));
    dispatch(actionGetMessages(conversation.key, session.account.key));
    props.navigation.navigate("Messages");
  };

  const showToast = (text, callback = null) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  const onRefresh = () => {
    setRefresh(true);
    dispatch(actionListMessages(session.account.key));
  };

  const searchPeople = (sSearch) => {
    return messages.messages.filter(function (item) {
      if (item.type === 1)
        return (
          item.users[0].name.toUpperCase().includes(sSearch.toUpperCase()) ||
          item.users[0].username.toUpperCase().includes(sSearch.toUpperCase())
        );
      else
        return (
          item.name.toUpperCase().includes(sSearch.toUpperCase()) ||
          item.name.toUpperCase().includes(sSearch.toUpperCase())
        );
    });
  };

  const deleteConversation = (conversation) => {
    setLoading(true);
    dispatch(
      actionDeleteConversation(
        session.account.key,
        conversation.key,
        conversation.type
      )
    );
    oConversationRows[conversation.key].close();
  };

  const viewProfile = (user) => {
    if (user.sender !== undefined) {
      GetUserAccount(user.sender).then((userAccountSnapshot) => {
        var userAccount = userAccountSnapshot.val();
        dispatch(actionGetProfile(userAccount.id, true));
        props.navigation.navigate("ProfileViewDetails");
      });
    } else {
      dispatch(actionGetProfile(user.id, true));
      props.navigation.navigate("ProfileViewDetails");
    }
  };

  const closePeopleList = () => {
    clearPeopleSelect();
    setShowListPals(false);
  };

  const clearPeopleSelect = () => {
    palsProps.myFriends.forEach((oPal) => {
      oPal.selected = false;
    });
  };

  const confirmMembers = () => {
    var members = [];
    palsProps.myFriends.forEach((oPal) => {
      if (oPal.selected) members.push({ key: oPal.key, id: oPal.id });
    });
    if (members.length > 1) {
      members.push({
        key: session.account.key,
        id: session.account.id,
      });
      setMembersNewChatGroup(members);
      setShowNameNewChatGroup(true);
    } else {
      // TODO: If the length is equal to one, redirect messages with the search equal to the name of that user
      if (members.length == 1) redirectNewMessage();
    }
    clearPeopleSelect();
    setShowListPals(false);
  };

  const crateNewChatGroup = () => {
    if ("" !== nameChatGroup) {
      dispatch(
        actionCreateChatGroup(
          nameChatGroup,
          session.account.key,
          session.account.name,
          membersNewChatGroup
        )
      );
      setNameChatGroup("");
      setMembersNewChatGroup([]);
      setShowNameNewChatGroup(false);
    } else {
      showToast("The name cannot be empty");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bk.png")}
      resizeMode="stretch"
      style={GlobalStyles.fullImageWidht}>
      {messages.messages.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
          ListHeaderComponent={
            <SearchUsername
              value={search}
              change={(text) => setSearch(text)}
              clean={() => setSearch("")}
            />
          }
          refresh={refresh}
          keyExtractor={(item, index) => index.toString()}
          data={searchPeople(search)}
          extraData={refresh}
          renderItem={({ item }) => (
            <View
              style={[styles.viewMessageItem, { backgroundColor: "white" }]}>
              <Swipeable
                renderRightActions={() => (
                  <Pressable
                    style={styles.buttonDelete}
                    onPress={() => {
                      deleteConversation(item);
                    }}>
                    <Icon name="trash" size={30} color={WhiteColor} />
                  </Pressable>
                )}
                ref={oConversationRows[item.key]}>
                <View style={styles.viewMessageItemDetails}>
                  <View style={{ width: "100%" }}>
                    <Pressable
                      onPress={() => showConversationHandler(item)}
                      style={{ flexDirection: "row" }}>
                      {showDelete && (
                        <View style={{ justifyContent: "center" }}>
                          <Icon
                            name="radio-button-on"
                            size={30}
                            color={SignUpColor}
                          />
                        </View>
                      )}
                      {1 === item.type ? (
                        null !== item.image ? (
                          <FastImage
                            style={[
                              styles.viewMessageItemImageProfile,
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
                            style={[
                              styles.viewMessageItemImageProfile,
                              { borderRadius: 100 },
                            ]}
                            source={require("../../assets/imgProfileReadOnly.png")}
                          />
                        )
                      ) : (
                        <Image
                          style={[
                            styles.viewMessageItemImageProfile,
                            { borderRadius: 100 },
                          ]}
                          source={require("../../assets/imgGroup.png")}
                        />
                      )}
                      <View style={styles.viewMessageData}>
                        <Text style={styles.messageName}>{item.name}</Text>
                        <Text
                          style={[
                            styles.messagePreview,
                            GlobalStyles.textMuted,
                          ]}
                          numberOfLines={1}>
                          {item.message}
                        </Text>
                        <Text style={GlobalStyles.textMuted}>{item.time}</Text>
                      </View>
                      <View style={styles.viewDetailsDate}>
                        <View style={styles.viewDateAndIcon}>
                          <Icon
                            name="md-time"
                            size={16}
                            color={PlaceholderColor}
                            style={styles.icon}
                          />
                          <Text>{item.date}</Text>
                        </View>
                        {item.messagesRead > 0 && (
                          <View style={GlobalMessages.viewGlobalBubble}>
                            <View style={GlobalMessages.viewBubble}>
                              <Text style={GlobalMessages.text}>
                                {item.messagesRead}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  </View>
                </View>
              </Swipeable>
            </View>
          )}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              styles.textCenter,
              styles.textGray,
              styles.pd10,
              styles.fontBold,
            ]}>
            Here you will find the chats with other users
          </Text>
          <Text style={[styles.textCenter, styles.textGray, styles.fontBold]}>
            Start chatting!
          </Text>
        </View>
      )}
      {showDelete && (
        <View style={styles.viewButtonDeleteMessages}>
          <Pressable style={{ flexDirection: "row", justifyContent: "center" }}>
            <Icon
              name="ios-trash"
              size={20}
              color={SignUpColor}
              style={styles.icon}
            />
            <Text style={{ fontSize: 18, color: SignUpColor }}>
              Delete messages
            </Text>
          </Pressable>
        </View>
      )}
      <Conversation
        visible={showConversation}
        conversation={conversationSelect}
        close={() => setShowConversation(false)}
        viewProfile={(item) => viewProfile(item)}
      />
      <GroupChat
        close={() => setShowGroupConversation(false)}
        visible={showGroupConversation}
        conversation={conversationSelect}
        viewProfile={(item) => viewProfile(item)}
      />
      {showNameNewChatGroup && (
        <View style={ToastQuestionGenericStyles.contentToast}>
          <View style={ToastQuestionGenericStyles.viewToast}>
            <Text style={ToastQuestionGenericStyles.textToast}>
              Name of the new group chat?
            </Text>
            <TextInput
              numberOfLines={4}
              multiline={false}
              style={ToastQuestionGenericStyles.inputSimple}
              value={textNotification}
              onChangeText={(text) =>
                text.length < 31 && setNameChatGroup(text)
              }
            />
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ width: "50%" }}>
                <Pressable
                  style={[GlobalStyles.buttonCancel, { marginRight: 10 }]}
                  onPress={() => {
                    setShowNameNewChatGroup(false);
                    setMembersNewChatGroup(null);
                  }}>
                  <Text style={GlobalStyles.textButton}>Cancel</Text>
                </Pressable>
              </View>
              <View style={{ width: "50%" }}>
                <Pressable
                  style={GlobalStyles.buttonConfirm}
                  onPress={() => crateNewChatGroup()}>
                  <Text style={GlobalStyles.textButton}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
      {showGroupConversation ||
        (!showConversation && (
          <PalsOptions
            visible={showOptions}
            groupMessage={() => {
              setShowListPals(true);
              setShowOptions(false);
            }}
            newMessage={() => redirectNewMessage()}
            openOptions={() => setShowOptions(!showOptions)}
          />
        ))}
      <PeopleList
        visible={showListPals}
        close={() => closePeopleList()}
        pals={palsProps.myFriends}
        confirm={() => confirmMembers()}
      />
      <LoadingSpinner visible={loading} />
      <Toast toastText={toastText} />
    </ImageBackground>
  );
};

export default ListMessages;

const styles = StyleSheet.create({
  viewMessageItem: {
    borderBottomColor: PlaceholderColor,
    borderBottomWidth: 1,
  },
  viewMessageItemDetails: {
    padding: 10,
    flexDirection: "row",
  },
  viewMessageItemImageProfile: {
    width: 80,
    height: 80,
  },
  viewMessageData: {
    justifyContent: "center",
    marginLeft: 10,
  },
  messageName: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 2,
  },
  messagePreview: {
    color: "gray",
    marginBottom: 2,
    marginRight: 150,
  },
  viewDetailsDate: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  viewDateAndIcon: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 5,
  },
  viewButtonDeleteMessages: {
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    width: "100%",
    padding: 10,
    borderColor: PlaceholderColor,
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    justifyContent: "flex-end",
  },
  buttonDelete: {
    height: "100%",
    width: 75,
    backgroundColor: SignUpColor,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  pd10: {
    padding: 10,
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
