import React, { Component } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SearchUsername } from "../../components/chat/SearchUsername";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { PlaceholderColor, WhiteColor } from "../../Styles";
import Conversation, { chatStyles } from "../../components/chat/Conversation";
import { connect } from "react-redux";
import {
  actionGetUserFriends,
  actionSetConversation,
  actionGetMessages,
} from "../../redux/actions/ChatActions";
import { Toast } from "../../components/shared/Toast";
import FastImage from "react-native-fast-image";

class NewEditMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConversation: false,
      conversationSelect: null,
      toastText: "",
      search: "",
    };
  }

  componentDidMount = async () => {
    this.props.getUserFriends({
      accountId: this.props.session.account.key,
    });
  };

  componentWillReceiveProps = async (nextProps) => {
    if (
      nextProps.friendsProps.friends.length > 0 &&
      null !== this.state.conversationSelect
    ) {
      for (var i = 0; i < nextProps.friendsProps.friends.length; i++) {
        if (
          nextProps.friendsProps.friends[i].userFriendKey ===
          this.state.conversationSelect.userFriendKey
        ) {
          await this.setState({
            conversationSelect: nextProps.friendsProps.friends[i],
          });
        }
      }
    }
  };

  showConversation = async (oFriend) => {
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
    this.props.setConversationData(oConversation);
    this.props.getMessages(
      oFriend.conversation,
      this.props.session.account.key
    );
    this.props.navigation.navigate("Messages");
  };

  searchPeople = (sSearch) => {
    return this.props.friendsProps.friends.filter(function (item) {
      return (
        item.name.toUpperCase().includes(sSearch.toUpperCase()) ||
        item.username.toUpperCase().includes(sSearch.toUpperCase())
      );
    });
  };

  render = () => {
    const { friends: aFriends } = this.props.friendsProps;
    return (
      <View style={{ flex: 1, backgroundColor: WhiteColor }}>
        {aFriends && aFriends.length > 0 ? (
          <>
            <SearchUsername
              value={this.state.search}
              change={(text) => this.setState({ search: text })}
              clean={() => this.setState({ search: "" })}
            />
            <View>
              <FlatList
                data={this.searchPeople(this.state.search)}
                extraData={this.state.refresh}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <Pressable onPress={() => this.showConversation(item)}>
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
          visible={this.state.showConversation}
          conversation={this.state.conversationSelect}
          close={() => this.setState({ showConversation: false })}
        />
        <Toast toastText={this.state.toastText} />
      </View>
    );
  };
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

const mapStateToProps = (state) => ({
  friendsProps: state.reducerListFriends,
  session: state.reducerSession,
});

const mapDispatchToProps = (dispatch) => ({
  getUserFriends: (data) => {
    dispatch(actionGetUserFriends(data));
  },
  getMessages: (sConversationId, sUserKey) => {
    dispatch(actionGetMessages(sConversationId, sUserKey));
  },
  setConversationData: (oConversation) => {
    dispatch(actionSetConversation(oConversation));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewEditMessage);
