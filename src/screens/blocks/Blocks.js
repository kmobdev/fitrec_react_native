import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  RefreshControl,
  FlatList,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import {
  GlobalStyles,
  GreenFitrecColor,
  SignUpColor,
  ToastQuestionStyles,
  WhiteColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import {
  actionCleanBlock,
  actionGetBlocks,
  actionUnblockUser,
} from "../../redux/actions/BlockActions";
import { Input } from "../../components";

const Blocks = (props) => {
  const oBlocks = useSelector((state) => state.reducerBlock);

  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionName, setQuestionName] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(actionGetBlocks());
    props.navigation.setParams({ navigateBack: navigateBack });
    return () => {
      navigateBack();
    };
  }, []);

  const navigateBack = () => {
    dispatch(actionCleanBlock());
    props.navigation.goBack();
  };

  const onRefresh = () => {
    dispatch(actionGetBlocks());
    setRefresh(false);
  };
  /**
   * Function that filters the data based on the tab in which the user is.
   *
   * @author Leandro Curbelo
   */
  const getData = () => {
    return oBlocks.blocks.filter(
      (element) =>
        element.name.toUpperCase().includes(search.toUpperCase()) ||
        element.username.toUpperCase().includes(search.toUpperCase())
    );
  };

  const unblock = () => {
    let userId = questionId;
    dispatch(actionUnblockUser(userId));
    setShowQuestion(false);
    setQuestionId(null);
    setQuestionName(null);
  };

  const onCancleHandler = () => {
    setShowQuestion(false);
    setQuestionId(null);
    setQuestionName(null);
  };

  const onLockHandler = (item) => {
    setShowQuestion(true);
    setQuestionId(item.id);
    setQuestionName(item.username);
  };

  const renderBlocks = () => {
    return (
      <>
        {oBlocks.blocks.length > 0 && getData().length > 0 ? (
          <FlatList
            data={getData()}
            keyExtractor={(item, index) => index.toString()}
            extraData={refresh}
            renderItem={({ item }) => (
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
                <View style={styles.sectionText}>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Text style={styles.textUsername}>@{item.username}</Text>
                </View>
                <View style={styles.sectionButton}>
                  <Pressable
                    onPress={() => onLockHandler(item)}
                    style={styles.removeButton}
                    activeOpacity={0.8}>
                    <Icon
                      name="lock-open"
                      size={24}
                      color={SignUpColor}
                      style={styles.textCenter}
                    />
                  </Pressable>
                </View>
              </View>
            )}
          />
        ) : oBlocks.blocks.length > 0 ? (
          <Text style={styles.textEmptyData}>No results found</Text>
        ) : (
          <Text style={styles.textEmptyData}>You have no blocked users</Text>
        )}
      </>
    );
  };

  const renderQuestions = () => {
    return (
      <>
        <ToastQuestionGeneric
          visible={showQuestion}
          titleBig="Unblock User"
          title={"Are you sure you want to unblock " + questionName + "?"}
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() => {
                  setShowQuestion(false);
                  setQuestionId(null);
                  setQuestionName(null);
                }}
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}>
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => unblock()}
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
      <View style={styles.inputContainer}>
        <Input
          placeholder={"Search"}
          value={search}
          onChangeText={(value) => setSearch(value)}
          style={styles.textInput}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => onRefresh()}
            tintColor={GreenFitrecColor}
            title="Pull to refresh..."
          />
        }>
        {renderBlocks()}
      </ScrollView>
      {renderQuestions()}
    </View>
  );
};

export default Blocks;

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
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: "#777777",
    width: "97%",
  },
  inputContainer: {
    alignItems: "center",
  },
});
