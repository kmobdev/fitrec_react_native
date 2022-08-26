import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  RefreshControl,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
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

const Followers = (props) => {
  const oFollowers = useSelector((state) => state.reducerFollower);
  const session = useSelector((state) => state.reducerSession);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(
    props.navigation.getParam("tab", true)
  );
  const [refresh, setRefresh] = useState(false);
  const [question, setQuestion] = useState(false);
  const [questionUnfollow, setQuestionUnfollow] = useState(false);
  const [questionRemove, setQuestionRemove] = useState(false);
  const [questionName, setQuestionName] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(actionGetFollowers());
    dispatch(actionGetFollowing());
    props.navigation.setParams({ navigateBack: navigateBack });
  }, []);

  const navigateBack = () => {
    dispatch(actionCleanFollowers());
    props.navigation.goBack();
  };

  const remove = () => {
    dispatch(actionRemoveFollower(questionId, session.account.id));
    setQuestionRemove(false);
    setQuestionId(null);
    setQuestionName(null);
  };

  const unfollow = () => {
    dispatch(actionUnFollow(questionId, session.account.id));
    setQuestionUnfollow(false);
    setQuestionId(null);
    setQuestionName(null);
  };

  const onRefresh = () => {
    dispatch(actionGetFollowers());
    dispatch(actionGetFollowing());
    setRefresh(false);
  };
  /**
   * Function that redirected the user to the selected profile
   *
   * @param {number} userId Main Identifier of the selected profile
   *
   * @author Leandro Curbelo
   */
  const viewProfile = (userId) => {
    dispatch(actionGetProfile(userId, true));
    props.navigation.navigate("ProfileViewDetails");
  };
  /**
   * Function that filters the data based on the tab in which the user is.
   *
   * @param {number} nType Identifier for the case of data you want to filter
   *
   * @author Leandro Curbelo
   */
  const getData = (nType) => {
    if (nType === 1)
      return oFollowers.following.filter(
        (element) =>
          element.name.toUpperCase().includes(search.toUpperCase()) ||
          element.username.toUpperCase().includes(search.toUpperCase())
      );
    else
      return oFollowers.followers.filter(
        (element) =>
          element.name.toUpperCase().includes(search.toUpperCase()) ||
          element.username.toUpperCase().includes(search.toUpperCase())
      );
  };

  const unfollowHandler = (item) => {
    setQuestionUnfollow(true);
    setQuestionId(item.id_follow);
    setQuestionName(item.name);
  };

  const removeFollowerHandler = (item) => {
    setQuestionRemove(true);
    setQuestionId(item.id_follow);
    setQuestionName(item.name);
  };

  const cancleHandler = (type) => {
    if (type === 1) {
      setQuestionUnfollow(false);
      setQuestionId(null);
      setQuestionName(null);
    } else {
      setQuestionRemove(false);
      setQuestionId(null);
      setQuestionName(null);
    }
  };

  const renderFollowing = () => {
    return (
      <>
        {oFollowers.following.length > 0 && getData(1).length > 0 ? (
          <FlatList
            data={getData(1)}
            keyExtractor={(item, index) => index.toString()}
            extraData={refresh}
            renderItem={({ item }) => (
              <FollowerCard
                profileImage={item.image}
                onPressSection={() => viewProfile(item.id)}
                name={item.name}
                username={item.username}
                onPressUnfollow={() => unfollowHandler(item)}
              />
            )}
          />
        ) : oFollowers.following.length > 0 ? (
          <Text style={styles.textEmptyData}>No results found</Text>
        ) : (
          <Text style={styles.textEmptyData}>
            You still do not follow any user
          </Text>
        )}
      </>
    );
  };

  const renderFollowers = () => {
    return (
      <>
        {oFollowers.followers.length > 0 && getData(2).length > 0 ? (
          <FlatList
            data={getData(2)}
            keyExtractor={(item, index) => index.toString()}
            extraData={refresh}
            renderItem={({ item }) => (
              <FollowerCard
                profileImage={item.image}
                onPressSection={() => viewProfile(item.id)}
                name={item.name}
                username={item.username}
                onPressUnfollow={() => removeFollowerHandler(item)}
              />
            )}
          />
        ) : oFollowers.followers.length > 0 ? (
          <Text style={styles.textEmptyData}>No results found</Text>
        ) : (
          <Text style={styles.textEmptyData}>You still have no followers</Text>
        )}
      </>
    );
  };

  const renderQuestions = () => {
    return (
      <>
        <ToastQuestionGeneric
          visible={questionUnfollow}
          titleBig="Unfollow User"
          title={"Are you sure you want to unfollow " + questionName + "?"}
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => cancleHandler(1)}
                style={[ToastQuestionStyles.button, styles.buttonDefault]}>
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={unfollow}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: SignUpColor },
                ]}>
                <Text style={ToastQuestionStyles.textButton}>Ok</Text>
              </Pressable>
            </View>
          }
        />
        <ToastQuestionGeneric
          visible={questionRemove}
          titleBig="Unfollow User"
          title={
            "Are you sure you want to remove " +
            questionName +
            " from your followers?"
          }
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => cancleHandler(2)}
                style={[ToastQuestionStyles.button, styles.buttonDefault]}>
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={remove}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: SignUpColor },
                ]}>
                <Text style={ToastQuestionStyles.textButton}>Ok</Text>
              </Pressable>
            </View>
          }
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={GlobalTabs.viewTabs}>
        <FollowerTabs
          onTabPress={() => setActiveTab(true)}
          title="Followers"
          leftTab={true}
          isActive={activeTab}
        />
        <FollowerTabs
          onTabPress={() => setActiveTab(false)}
          title="Following"
          leftTab={false}
          isActive={!activeTab}
        />
      </View>
      <View>
        <Input
          placeholder={"Search"}
          value={search}
          onChangeText={(value) => setSearch(value)}
          inputStyle={styles.textInput}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            tintColor={GreenFitrecColor}
            title="Pull to refresh..."
          />
        }>
        {activeTab ? renderFollowers() : renderFollowing()}
      </ScrollView>
      {renderQuestions()}
    </View>
  );
};

export default Followers;

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
