import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  RefreshControl,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import {
  GlobalTabs,
  GreenFitrecColor,
  SignUpColor,
  ToastQuestionStyles,
  WhiteColor,
} from "../../Styles";
import {
  actionCleanFollowers,
  actionGetFollowers,
  actionGetFollowing,
  actionRemoveFollower,
  actionUnFollow,
} from "../../redux/actions/FollowerActions";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import { actionGetProfile } from "../../redux/actions/ProfileActions";
import { FollowerCard, FollowerTabs, Input } from "../../components";

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

  onRefresh = () => {
    this.props.get();
    this.setState({ refresh: false });
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

  unfollowHandler = (item) => {
    this.setState({
      questionUnfollow: true,
      questionId: item.id_follow,
      questionName: item.name,
    });
  };

  removeFollowerHandler = (item) => {
    this.setState({
      questionRemove: true,
      questionId: item.id_follow,
      questionName: item.name,
    });
  };

  cancleHandler = (type) => {
    if (type === 1) {
      this.setState({
        questionUnfollow: false,
        questionId: null,
        questionName: null,
      });
    } else {
      this.setState({
        questionRemove: false,
        questionId: null,
        questionName: null,
      });
    }
  };

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
              <FollowerCard
                profileImage={item.image}
                onPressSection={() => this.viewProfile(item.id)}
                name={item.name}
                username={item.username}
                onPressUnfollow={() => this.unfollowHandler(item)}
              />
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
              <FollowerCard
                profileImage={item.image}
                onPressSection={() => this.viewProfile(item.id)}
                name={item.name}
                username={item.username}
                onPressUnfollow={() => this.removeFollowerHandler(item)}
              />
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
          <FollowerTabs
            onTabPress={() => this.setState({ activeTab: true })}
            title="Followers"
            leftTab={true}
            isActive={this.state.activeTab}
          />
          <FollowerTabs
            onTabPress={() => this.setState({ activeTab: false })}
            title="Following"
            leftTab={false}
            isActive={!this.state.activeTab}
          />
        </View>
        <View>
          <Input
            placeholder={"Search"}
            value={this.state.search}
            onChangeText={(sValue) => {
              this.setState({ search: sValue });
            }}
            inputStyle={styles.textInput}
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
              <Pressable
                onPress={() => this.cancleHandler(1)}
                style={[ToastQuestionStyles.button, styles.buttonDefault]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.unfollow()}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: SignUpColor },
                ]}
              >
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
              <Pressable
                onPress={() => this.cancleHandler(2)}
                style={[ToastQuestionStyles.button, styles.buttonDefault]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.remove()}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: SignUpColor },
                ]}
              >
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
    height: 30,
    padding: 7,
    borderRadius: 5,
    margin: 10,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: "#777777",
    fontSize: 14,
  },
  buttonDefault: {
    backgroundColor: GreenFitrecColor,
    marginRight: 10,
  },
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
