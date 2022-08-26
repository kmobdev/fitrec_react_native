import React, { Component } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import { BlackColor, GreenFitrecColor, WhiteColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import {
  actionExpandStory,
  actionResetActionsStory,
  actionResetControlStory,
} from "../../redux/actions/StoryActions";
import NoProfileImage from "../../assets/imgProfileReadOnly2.png";
import { actionCloseImage } from "../../redux/actions/SharedActions";

const sNoProfileImage = Image.resolveAssetSource(NoProfileImage).uri;

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStory: false,
      loading: false,
      interval: null,
      myStory: null,
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    // Sentencia para adelantar la visualizacion de una historia de usuario
    if (nextProps.oActions.next) {
      this.props.resetControlStory();
      this.expandStory(this.state.story, this.state.index);
    }
    // Sentencia para atrasar la visualizacion de una historia de usuario
    if (nextProps.oActions.previous) {
      this.props.resetControlStory();
      this.expandStory(this.state.story, this.state.index - 2);
    }
    // Sentencia para atrasar la visualizacion de una historia de usuario
    if (nextProps.oActions.view) {
      this.props.resetActions();
      this.expandStory(this.props.oStory.stories[0]);
    }
  };

  expandStory = async (oStory, nIndex = null) => {
    let aStories = oStory.total_stories;
    if (nIndex == null) {
      let nIndexView = 0,
        bFindViewIndex = false;
      aStories.forEach((oStoryElement) => {
        if (oStoryElement.view) {
          nIndexView += 1;
        } else {
          if (!bFindViewIndex) nIndex = nIndexView;
          bFindViewIndex = true;
          nIndexView += 1;
        }
      });
      if (!bFindViewIndex) nIndex = 0;
    }
    if (nIndex <= -1) nIndex = 0;
    if (aStories.length > 0) {
      await this.setState({ index: nIndex, story: oStory });
      if (this.state.index <= aStories.length - 1) {
        let sProfileImage =
            oStory.image !== null ? oStory.image : sNoProfileImage,
          sUsername = oStory.username,
          sLevel = oStory.level;
        FastImage.preload([{ uri: aStories[this.state.index].image }]);
        this.props.expandStory(
          aStories[this.state.index].id,
          aStories[this.state.index].image,
          sProfileImage,
          sUsername,
          aStories[this.state.index].created_at,
          sLevel,
          oStory.id === this.props.oSession.account.id,
          aStories[this.state.index].type,
          this.state.index,
          aStories.length
        );
        aStories[this.state.index].view = true;
        this.setState({ index: this.state.index + 1 });
        if (this.state.index <= aStories.length - 1)
          FastImage.preload([{ uri: aStories[this.state.index].image }]);
        else oStory.view = true;
      } else {
        this.props.closeStory();
      }
    } else {
      this.props.closeStory();
    }
  };

  openMeStory = async (oStory) => {
    if (oStory.total_stories.length > 0) {
      await this.setState({ myStory: oStory });
      this.props.options();
    } else this.props.new();
  };

  render = () => {
    return this.props.oStory.stories.length > 0 ? (
      <>
        <ScrollView
          horizontal={true}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContent}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.props.oStory.stories}
            extraData={this.state.refresh}
            refreshing={this.state.refresh}
            horizontal={true}
            renderItem={({ item }) =>
              item.id == this.props.oSession.account.id ? (
                <Pressable
                  style={styles.actionStyle}
                  onPress={() => this.openMeStory(item)}>
                  <View
                    style={[
                      styles.imageContent,
                      item.view
                        ? styles.borderStoryView
                        : styles.borderStoryNotView,
                    ]}>
                    <FastImage
                      style={styles.imageStyle}
                      source={{
                        uri: item.image !== null ? item.image : sNoProfileImage,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}>
                      <View style={styles.shadowView}></View>
                    </FastImage>
                    <View style={styles.containerIconPlus}>
                      <Icon
                        name="add-circle"
                        size={23}
                        color={"gray"}
                        style={styles.iconPlus}
                      />
                    </View>
                  </View>
                  <Text numberOfLines={1} style={styles.usernameStyle}>
                    You
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.actionStyle}
                  onPress={() => this.expandStory(item)}>
                  <View
                    style={[
                      styles.imageContent,
                      item.view
                        ? styles.borderStoryView
                        : styles.borderStoryNotView,
                    ]}>
                    <FastImage
                      style={styles.imageStyle}
                      source={{
                        uri: item.image !== null ? item.image : sNoProfileImage,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}>
                      {item.view && <View style={styles.shadowView}></View>}
                    </FastImage>
                  </View>
                  <Text numberOfLines={1} style={styles.usernameStyle}>
                    {item.username}
                  </Text>
                </Pressable>
              )
            }
          />
        </ScrollView>
      </>
    ) : null;
  };
}

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: WhiteColor,
    height: 95,
    paddingLeft: 5,
  },
  actionStyle: {
    width: 90,
    alignItems: "center",
  },
  imageContent: {
    borderWidth: 2,
    padding: 30,
    height: 66,
    width: 66,
    borderRadius: 100,
    marginTop: 10,
  },
  borderStoryView: {
    borderColor: "#AAA",
  },
  borderStoryNotView: {
    borderColor: GreenFitrecColor,
  },
  imageStyle: {
    marginTop: 1,
    height: 60,
    width: 60,
    borderRadius: 100,
    position: "absolute",
    alignSelf: "center",
  },
  shadowView: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(80, 80, 80, 0.15)",
  },
  iconMyStoryStyle: {
    alignSelf: "center",
    marginTop: 8,
    marginLeft: 3,
  },
  usernameStyle: {
    fontSize: 12,
    top: 1,
    alignItems: "center",
    color: BlackColor,
  },
  toastText: {
    color: WhiteColor,
    fontWeight: "bold",
    fontSize: 16,
  },
  containerIconPlus: {
    backgroundColor: WhiteColor,
    width: 22,
    height: 22,
    borderRadius: 100,
    position: "absolute",
    bottom: -3,
    right: -5,
  },
  iconPlus: {
    position: "absolute",
    top: -1.5,
  },
  contentToast: {
    zIndex: 3,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
  },
});

const mapStateToProps = (state) => ({
  oSession: state.reducerSession,
  oStory: state.reducerStory,
  oActions: state.reducerStoryActions,
});

const mapDispatchToProps = (dispatch) => ({
  expandStory: (
    nStoryId,
    sImage,
    sProfileImage,
    sUsername,
    sDate,
    sLevel,
    bIsOwner,
    nType,
    nIndex,
    nTotalStories
  ) => {
    dispatch(
      actionExpandStory(
        nStoryId,
        sImage,
        sProfileImage,
        sUsername,
        sDate,
        sLevel,
        bIsOwner,
        nType,
        nIndex,
        nTotalStories
      )
    );
  },
  closeStory: () => {
    dispatch(actionCloseImage());
  },
  resetControlStory: () => {
    dispatch(actionResetControlStory(true));
  },
  resetActions: () => {
    dispatch(actionResetActionsStory());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Stories);
