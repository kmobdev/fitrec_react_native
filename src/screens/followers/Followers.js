import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  RefreshControl,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import {
  GlobalStyles,
  GlobalTabs,
  GreenFitrecColor,
  SignUpColor,
  ToastQuestionStyles,
  WhiteColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import {
  actionCleanFollowers,
  actionGetFollowers,
  actionGetFollowing,
  actionRemoveFollower,
  actionUnFollow,
} from "../../redux/actions/FollowerActions";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { actionGetProfile } from "../../redux/actions/ProfileActions";

class Followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.navigation.getParam("tab", true),
      refresh: false,
      question: false,
      questionName: null,
      questionId: null,
      search: "",
    };
    this.props.get();
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ navigateBack: this.navigateBack });
  };

  navigateBack = () => {
    this.props.clean();
    this.props.navigation.goBack();
  };

  remove = () => {
    this.props.remove(this.state.questionId, this.props.session.account.id);
    this.setState({
      questionRemove: false,
      questionId: null,
      questionName: null,
    });
  };

  unfollow = () => {
    this.props.unfollow(this.state.questionId, this.props.session.account.id);
    this.setState({
      questionUnfollow: false,
      questionId: null,
      questionName: null,
    });
  };

  onRefresh = async () => {
    this.props.get();
    await this.setState({ refresh: false });
  };
  /**
   * Function that redirected the user to the selected profile
   *
   * @param {number} nUserId Main Identifier of the selected profile
   *
   * @author Leandro Curbelo
   */
  viewProfile = (nUserId) => {
    this.props.getProfile(nUserId);
    this.props.navigation.navigate("ProfileViewDetails");
  };
  /**
   * Function that filters the data based on the tab in which the user is.
   *
   * @param {number} nType Identifier for the case of data you want to filter
   *
   * @author Leandro Curbelo
   */
  getData = (nType) => {
    if (nType === 1)
      return this.props.oFollowers.following.filter(
        (element) =>
          element.name
            .toUpperCase()
            .includes(this.state.search.toUpperCase()) ||
          element.username
            .toUpperCase()
            .includes(this.state.search.toUpperCase())
      );
    else
      return this.props.oFollowers.followers.filter(
        (element) =>
          element.name
            .toUpperCase()
            .includes(this.state.search.toUpperCase()) ||
          element.username
            .toUpperCase()
            .includes(this.state.search.toUpperCase())
      );
  };

  onTrashHandler = () => {
    this.setState({
      questionUnfollow: true,
      questionId: item.id_follow,
      questionName: item.name,
    })
  }

  onTrashFollowersHandler = () => {
    this.setState({
      questionRemove: true,
      questionId: item.id_follow,
      questionName: item.name,
    })
  }

  onCancleHandler = () => {
    this.setState({
      questionUnfollow: false,
      questionId: null,
      questionName: null,
    })
  }

  onCancleQuestionHandler = () => {
    this.setState({
      questionRemove: false,
      questionId: null,
      questionName: null,
    })

  }

  renderFollowing = () => {
    return (
      <>
        {this.props.oFollowers.following.length > 0 &&
          this.getData(1).length > 0 ? (
          <FlatList
            data={this.getData(1)}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state.refresh}
            renderItem={({ item }) => (
              <>
                <View style={styles.containerRow}>
                  <View style={{ flex: 3 }}>
                    {item.image != null ? (
                      <FastImage
                        style={GlobalStyles.photoProfileCardList}
                        source={{ uri: item.image }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={GlobalStyles.photoProfileCardList}
                        source={require("../../assets/imgProfileReadOnly2.png")}
                      />
                    )}
                  </View>
                  <Pressable
                    onPress={() => this.viewProfile(item.id)}
                    style={styles.sectionText}
                  >
                    <Text style={styles.textName}>{item.name}</Text>
                    <Text style={styles.textUsername}>@{item.username}</Text>
                  </Pressable>
                  <View style={styles.sectionButton}>
                    <Pressable onPress={this.onTrashHandler} style={styles.removeButton}>
                      <Icon
                        name="trash"
                        size={24}
                        color={SignUpColor}
                        style={styles.textCenter}
                      />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          />
        ) : this.props.oFollowers.following.length > 0 ? (
          <Text style={styles.textEmptyData}>No results found</Text>
        ) : (
          <Text style={styles.textEmptyData}>
            You still do not follow any user
          </Text>
        )}
      </>
    );
  };

  renderFollowers = () => {
    return (
      <>
        {this.props.oFollowers.followers.length > 0 &&
          this.getData(2).length > 0 ? (
          <FlatList
            data={this.getData(2)}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state.refresh}
            renderItem={({ item }) => (
              <>
                <View style={styles.containerRow}>
                  <View style={{ flex: 3 }}>
                    {item.image != null ? (
                      <FastImage
                        style={GlobalStyles.photoProfileCardList}
                        source={{ uri: item.image }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={GlobalStyles.photoProfileCardList}
                        source={require("../../assets/imgProfileReadOnly2.png")}
                      />
                    )}
                  </View>
                  <Pressable
                    onPress={() => this.viewProfile(item.id)}
                    style={styles.sectionText}
                  >
                    <Text style={styles.textName}>{item.name}</Text>
                    <Text style={styles.textUsername}>@{item.username}</Text>
                  </Pressable>
                  <View style={styles.sectionButton}>
                    <Pressable onPress={this.onTrashFollowersHandler} style={styles.removeButton}>
                      <Icon
                        name="trash"
                        size={24}
                        color={SignUpColor}
                        style={styles.textCenter}
                      />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          />
        ) : this.props.oFollowers.followers.length > 0 ? (
          <Text style={styles.textEmptyData}>No results found</Text>
        ) : (
          <Text style={styles.textEmptyData}>You still have no followers</Text>
        )}
      </>
    );
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={GlobalTabs.viewTabs}>
          <Pressable
            onPress={() => this.setState({ activeTab: true })}
            style={[
              GlobalTabs.tabLeft,
              this.state.activeTab && GlobalTabs.tabActive,
            ]}
          >
            <View>
              <Text
                style={
                  this.state.activeTab
                    ? GlobalTabs.tabsTextActive
                    : GlobalTabs.tabsText
                }
              >
                Followers
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => this.setState({ activeTab: false })}
            style={[
              GlobalTabs.tabRight,
              !this.state.activeTab && GlobalTabs.tabActive,
            ]}
          >
            <View>
              <Text
                style={
                  !this.state.activeTab
                    ? GlobalTabs.tabsTextActive
                    : GlobalTabs.tabsText
                }
              >
                Following
              </Text>
            </View>
          </Pressable>
        </View>
        <View>
          <TextInput
            placeholder={"Search"}
            value={this.state.search}
            onChangeText={(sValue) => {
              this.setState({ search: sValue });
            }}
            style={styles.textInput}
          />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={() => this.onRefresh()}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          {this.state.activeTab
            ? this.renderFollowers()
            : this.renderFollowing()}
        </ScrollView>
        {this.renderQuestions()}
      </View>
    );
  };

  renderQuestions = () => {
    return (
      <>
        <ToastQuestionGeneric
          visible={this.state.questionUnfollow}
          titleBig="Unfollow User"
          title={
            "Are you sure you want to unfollow " + this.state.questionName + "?"
          }
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable onPress={this.onCancleHandler} style={styles.button}>
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable onPress={this.unfollow} style={styles.buttonUnblock}>
                <Text style={ToastQuestionStyles.textButton}>Ok</Text>
              </Pressable>
            </View>
          }
        />
        <ToastQuestionGeneric
          visible={this.state.questionRemove}
          titleBig="Unfollow User"
          title={
            "Are you sure you want to remove " +
            this.state.questionName +
            " from your followers?"
          }
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable onPress={this.onCancleQuestionHandler} style={styles.button}>
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => this.remove()} style={styles.buttonUnblock}>
                <Text style={ToastQuestionStyles.textButton}>Ok</Text>
              </Pressable>
            </View>
          }
        />
      </>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteColor,
  },
  containerTitle: {
    borderBottomColor: "black",
    borderBottomWidth: 0.3,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    paddingLeft: 15,
  },
  containerRow: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  sectionText: {
    justifyContent: "center",
    marginLeft: 10,
    flex: 9,
  },
  textName: {
    fontSize: 16,
    fontWeight: "600",
  },
  textUsername: {
    fontSize: 14,
    color: GreenFitrecColor,
  },
  sectionButton: {
    justifyContent: "center",
    flex: 2,
  },
  removeButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: SignUpColor,
    borderRadius: 5,
    marginRight: 0,
  },
  textCenter: {
    textAlign: "center",
  },
  textEmptyData: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    marginTop: "20%",
  },
  textInput: {
    backgroundColor: WhiteColor,
    width: "auto",
    padding: 7,
    borderRadius: 5,
    margin: 10,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: "#777777",
  },
  button: {
    ...ToastQuestionStyles.button,
    backgroundColor: GreenFitrecColor,
    marginRight: 10,
  },
  buttonUnblock: {
    ...ToastQuestionStyles.button,
    backgroundColor: SignUpColor
  }
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  oFollowers: state.reducerFollower,
});

const mapDispatchToProps = (dispatch) => ({
  get: () => {
    dispatch(actionGetFollowers());
    dispatch(actionGetFollowing());
  },
  unfollow: (nFollowId, nUserId) => {
    dispatch(actionUnFollow(nFollowId, nUserId));
  },
  remove: (nFollowId, nUserId) => {
    dispatch(actionRemoveFollower(nFollowId, nUserId));
  },
  clean: () => {
    dispatch(actionCleanFollowers());
  },
  getProfile: (nUserId) => {
    dispatch(actionGetProfile(nUserId, true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
