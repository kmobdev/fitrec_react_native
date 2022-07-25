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

class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      bShowQuestion: false,
      sQuestionName: null,
      nQuestionId: null,
      search: "",
    };
    this.props.get();
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ navigateBack: this.navigateBack });
  };

  componentWillUnmount = () => {
    this.navigateBack();
  };

  navigateBack = () => {
    this.props.clean();
    this.props.navigation.goBack();
  };

  onRefresh = async () => {
    this.props.get();
    await this.setState({ refresh: false });
  };
  /**
   * Function that filters the data based on the tab in which the user is.
   *
   * @author Leandro Curbelo
   */
  getData = () => {
    return this.props.oBlocks.blocks.filter(
      (element) =>
        element.name.toUpperCase().includes(this.state.search.toUpperCase()) ||
        element.username.toUpperCase().includes(this.state.search.toUpperCase())
    );
  };

  unblock = () => {
    let nUserId = this.state.nQuestionId;
    this.props.unblock(nUserId);
    this.setState({
      bShowQuestion: false,
      nQuestionId: null,
      sQuestionName: null,
    });
  };

  onCancleHandler = () => {
    this.setState({
      bShowQuestion: false,
      nQuestionId: null,
      sQuestionName: null,
    })
  }

  onLockHandler = (item) => {
    this.setState({
      bShowQuestion: true,
      nQuestionId: item.id,
      sQuestionName: item.username,
    })
  }

  renderBlocks = () => {
    return (
      <>
        {this.props.oBlocks.blocks.length > 0 && this.getData().length > 0 ? (
          <FlatList
            data={this.getData()}
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
                  <View style={styles.sectionText}>
                    <Text style={styles.textName}>{item.name}</Text>
                    <Text style={styles.textUsername}>@{item.username}</Text>
                  </View>
                  <View style={styles.sectionButton}>
                    <Pressable
                      onPress={() => this.onLockHandler(item)}
                      style={styles.removeButton}
                      activeOpacity={0.8}
                    >
                      <Icon
                        name="lock-open"
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
        ) : this.props.oBlocks.blocks.length > 0 ? (
          <Text style={styles.textEmptyData}>No results found</Text>
        ) : (
          <Text style={styles.textEmptyData}>You have no blocked users</Text>
        )}
      </>
    );
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            placeholder={"Search"}
            value={this.state.search}
            onChangeText={(sValue) => {
              this.setState({ search: sValue });
            }}
            style={{
              backgroundColor: WhiteColor,
              width: "auto",
              padding: 7,
              borderRadius: 5,
              margin: 10,
              marginTop: 20,
              borderWidth: 0.5,
              borderColor: "#777777",
            }}
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
          {this.renderBlocks()}
        </ScrollView>
        {this.renderQuestions()}
      </View>
    );
  };

  renderQuestions = () => {
    return (
      <>
        <ToastQuestionGeneric
          visible={this.state.bShowQuestion}
          titleBig="Unblock User"
          title={
            "Are you sure you want to unblock " + this.state.sQuestionName + "?"
          }
          options={
            <View style={ToastQuestionStyles.viewButtons}>
              <Pressable
                onPress={() =>
                  this.setState({
                    bShowQuestion: false,
                    nQuestionId: null,
                    sQuestionName: null,
                  })
                }
                style={[
                  ToastQuestionStyles.button,
                  { backgroundColor: GreenFitrecColor, marginRight: 10 },
                ]}
              >
                <Text style={ToastQuestionStyles.textButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => this.unblock()}
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
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  oBlocks: state.reducerBlock,
});

const mapDispatchToProps = (dispatch) => ({
  get: () => {
    dispatch(actionGetBlocks());
  },
  unblock: (nUserId) => {
    dispatch(actionUnblockUser(nUserId));
  },
  clean: () => {
    dispatch(actionCleanBlock());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
