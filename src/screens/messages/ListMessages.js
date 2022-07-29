import React, { Component } from "react";
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
import { connect } from "react-redux";
import { SearchUsername } from "../../components/chat/SearchUsername";
import Conversation from "../../components/chat/Conversation";
import {
  actionListMessages,
  actionConfirmMessageRead,
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

class ListMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToastQuestion: false,
      showConversation: false,
      showDelete: false,
      refresh: false,
      conversationSelect: null,
      loading: false,
      toastText: "",
      refreshing: false,
      search: "",
      showListPals: false,
      showGroupConversation: false,
      conversationSelect: null,
      showNameNewChatGroup: false,
      nameChatGroup: "",
      showOptions: false,
    };
    this.oConversationRows = [];
  }

  componentDidMount = () => {
    this.setState({
      loading: true,
    });
    this.props.getListMessages(this.props.session.account.key);
    if (
      this.props.palsProps.myFriends.status !== true &&
      this.props.palsProps.myFriends.length === 0
    )
      this.props.getFriends(this.props.session.account.key);
  };

  redirectNewMessage = () => {
    this.props.navigation.navigate("NewEditMessage");
    this.setState({
      showOptions: false,
    });
  };

  setShowDelete = () => {
    this.setState({ showDelete: true, showOptions: false });
  };

  showConversation = (conversation) => {
    let oConversation = {
      key: conversation.key,
      type: conversation.type,
      users: conversation.users,
    };
    this.props.setConversationData(oConversation);
    this.props.getMessages(conversation.key, this.props.session.account.key);
    this.props.navigation.navigate("Messages");
  };

  componentWillReceiveProps = (nextProps) => {
    if (null !== this.state.conversationSelect) {
      for (var i = 0; i < nextProps.messages.messages.length; i++) {
        if (
          nextProps.messages.messages[i].key ===
          this.state.conversationSelect.key
        ) {
          this.setState({
            conversationSelect: nextProps.messages.messages[i],
          });
        }
      }
    }
    var sConversationKey = this.props.messages.sConversationKey;
    if (null !== sConversationKey && this.props.messages.messages.length > 0) {
      this.props.messages.messages.forEach((oElement) => {
        if (oElement.key === sConversationKey) this.showConversation(oElement);
      });
      this.props.cleanNavigation();
    }
    this.setState({
      loading: false,
      refreshing: false,
      refresh: !this.state.refresh,
    });
  };

  showToast = (sText, callback = null) => {
    this.setState({
      toastText: sText,
      loading: false,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.props.getListMessages(this.props.session.account.key);
  };

  searchPeople = (sSearch) => {
    return this.props.messages.messages.filter(function (item) {
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

  deleteConversation = (oConversation) => {
    this.setState({ loading: true });
    this.props.deleteConversation(
      this.props.session.account.key,
      oConversation.key,
      oConversation.type
    );
    this.oConversationRows[oConversation.key].close();
  };

  viewProfile = (oUser) => {
    if (oUser.sender !== undefined) {
      GetUserAccount(oUser.sender).then((userAccountSnapshot) => {
        var oUserAccount = userAccountSnapshot.val();
        this.props.getProfile(oUserAccount.id);
        this.props.navigation.navigate("ProfileViewDetails");
      });
    } else {
      this.props.getProfile(oUser.id);
      this.props.navigation.navigate("ProfileViewDetails");
    }
  };

  closePeopleList = () => {
    this.clearPeopleSelect();
    this.setState({ showListPals: false });
  };

  clearPeopleSelect = () => {
    this.props.palsProps.myFriends.forEach((oPal) => {
      oPal.selected = false;
    });
  };

  confirmMembers = () => {
    var aMembers = [];
    this.props.palsProps.myFriends.forEach((oPal) => {
      if (oPal.selected) aMembers.push({ key: oPal.key, id: oPal.id });
    });
    if (aMembers.length > 1) {
      aMembers.push({
        key: this.props.session.account.key,
        id: this.props.session.account.id,
      });
      this.setState({
        membersNewChatGroup: aMembers,
        showNameNewChatGroup: true,
      });
    } else {
      // TODO: If the length is equal to one, redirect messages with the search equal to the name of that user
      if (aMembers.length == 1) this.redirectNewMessage();
    }
    this.clearPeopleSelect();
    this.setState({
      showListPals: false,
    });
  };

  crateNewChatGroup = () => {
    if ("" !== this.state.nameChatGroup) {
      this.props.createChatGroup(
        this.state.nameChatGroup,
        this.props.session.account.key,
        this.props.session.account.name,
        this.state.membersNewChatGroup
      );
      this.setState({
        nameChatGroup: "",
        membersNewChatGroup: [],
        showNameNewChatGroup: false,
      });
    } else this.showToast("The name cannot be empty");
  };

  render() {
    return (
      <ImageBackground
        source={require("../../assets/bk.png")}
        resizeMode="stretch"
        style={GlobalStyles.fullImageWidht}
      >
        {this.props.messages.messages.length > 0 ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
                tintColor={GreenFitrecColor}
                title="Pull to refresh..."
              />
            }
            ListHeaderComponent={
              <SearchUsername
                value={this.state.search}
                change={(text) => this.setState({ search: text })}
                clean={() => this.setState({ search: "" })}
              />
            }
            refresh={this.state.refresh}
            keyExtractor={(item, index) => index.toString()}
            data={this.searchPeople(this.state.search)}
            extraData={this.state.refresh}
            renderItem={({ item }) => (
              <View
                style={[styles.viewMessageItem, { backgroundColor: "white" }]}
              >
                <Swipeable
                  renderRightActions={() => (
                    <Pressable
                      style={styles.buttonDelete}
                      onPress={() => {
                        this.deleteConversation(item);
                      }}
                    >
                      <Icon name="trash" size={30} color={WhiteColor} />
                    </Pressable>
                  )}
                  ref={(oRef) => (this.oConversationRows[item.key] = oRef)}
                >
                  <View style={styles.viewMessageItemDetails}>
                    <View style={{ width: "100%" }}>
                      <Pressable
                        onPress={() => this.showConversation(item)}
                        style={{ flexDirection: "row" }}
                      >
                        {this.state.showDelete && (
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
                            numberOfLines={1}
                          >
                            {item.message}
                          </Text>
                          <Text style={GlobalStyles.textMuted}>
                            {item.time}
                          </Text>
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
              ]}
            >
              Here you will find the chats with other users
            </Text>
            <Text style={[styles.textCenter, styles.textGray, styles.fontBold]}>
              Start chatting!
            </Text>
          </View>
        )}
        {this.state.showDelete && (
          <View style={styles.viewButtonDeleteMessages}>
            <Pressable
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
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
          visible={this.state.showConversation}
          conversation={this.state.conversationSelect}
          close={() => this.setState({ showConversation: false })}
          viewProfile={(item) => this.viewProfile(item)}
        />
        <GroupChat
          close={() => this.setState({ showGroupConversation: false })}
          visible={this.state.showGroupConversation}
          conversation={this.state.conversationSelect}
          viewProfile={(item) => this.viewProfile(item)}
        />
        {this.state.showNameNewChatGroup && (
          <View style={ToastQuestionGenericStyles.contentToast}>
            <View style={ToastQuestionGenericStyles.viewToast}>
              <Text style={ToastQuestionGenericStyles.textToast}>
                Name of the new group chat?
              </Text>
              <TextInput
                numberOfLines={4}
                multiline={false}
                style={ToastQuestionGenericStyles.inputSimple}
                value={this.state.textNotification}
                onChangeText={(text) =>
                  text.length < 31 && this.setState({ nameChatGroup: text })
                }
              />
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={[GlobalStyles.buttonCancel, { marginRight: 10 }]}
                    onPress={() =>
                      this.setState({
                        showNameNewChatGroup: false,
                        membersNewChatGroup: null,
                      })
                    }
                  >
                    <Text style={GlobalStyles.textButton}>Cancel</Text>
                  </Pressable>
                </View>
                <View style={{ width: "50%" }}>
                  <Pressable
                    style={GlobalStyles.buttonConfirm}
                    onPress={() => this.crateNewChatGroup()}
                  >
                    <Text style={GlobalStyles.textButton}>Confirm</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
        {this.state.showGroupConversation ||
          (!this.state.showConversation && (
            <PalsOptions
              visible={this.state.showOptions}
              groupMessage={() =>
                this.setState({ showListPals: true, showOptions: false })
              }
              newMessage={() => this.redirectNewMessage()}
              openOptions={() =>
                this.setState({ showOptions: !this.state.showOptions })
              }
            />
          ))}
        <PeopleList
          visible={this.state.showListPals}
          close={() => this.closePeopleList()}
          pals={this.props.palsProps.myFriends}
          confirm={() => this.confirmMembers()}
        />
        <LoadingSpinner visible={this.state.loading} />
        <Toast toastText={this.state.toastText} />
      </ImageBackground>
    );
  }
}

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

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  messages: state.reducerListMessages,
  palsProps: state.reducerMyPals,
});

const mapDispatchToProps = (dispatch) => ({
  getListMessages: (sUserKey) => {
    dispatch(actionListMessages(sUserKey));
  },
  confirmReadMessage: (data) => {
    dispatch(actionConfirmMessageRead(data));
  },
  deleteConversation: (sAccountKey, sConversationKey, nType) => {
    dispatch(actionDeleteConversation(sAccountKey, sConversationKey, nType));
  },
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
  },
  createChatGroup: (sGroupName, sUserKey, sUserName, aMemebers) => {
    dispatch(actionCreateChatGroup(sGroupName, sUserKey, sUserName, aMemebers));
  },
  getFriends: (sUserKey) => {
    dispatch(actionGetMyFriends(sUserKey));
  },
  getMessages: (sConversationId, sUserKey) => {
    dispatch(actionGetMessages(sConversationId, sUserKey));
  },
  setConversationData: (oConversation) => {
    dispatch(actionSetConversation(oConversation));
  },
  cleanNavigation: () => {
    dispatch(actionCleanNavigation());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ListMessages);
