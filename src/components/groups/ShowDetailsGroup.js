import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import {
  GlobalStyles,
  GlobalModal,
  GreenFitrecColor,
  WhiteColor,
  PlaceholderColor,
  SignUpColor,
  GlobalMessages,
  ToastQuestionGenericStyles,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import {
  actionSendNotificationCapitan,
  actionCheckReadMessageGroup,
  actionChangePhoto,
  actionUpdateGroup,
  actionUpdateCapitans,
  actionRemoveMembers,
} from "../../redux/actions/GroupActions";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { Toast } from "../shared/Toast";
import ConversationGroup from "../chat/ConversationGroup";
import ImagePicker from "react-native-image-crop-picker";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import { SearchUsername } from "../chat/SearchUsername";
import { ToastQuestionGeneric } from "../shared/ToastQuestionGeneric";
import FastImage from "react-native-fast-image";
import { MESSAGE_ERROR, OPTIONS_IMAGE_CROP_PROFILE } from "../../Constants";
import { actionExpandImage } from "../../redux/actions/SharedActions";

class ShowDetailsGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSendNotification: false,
      loading: false,
      textNotification: "",
      toastText: "",
      showMessages: false,
      showGroupPhoto: false,
      previewImage: null,
      search: "",
      showConfirmLeaveGroup: false,
      images: [],
      showOptions: false,
      changeInformation: false,
      editInformationInput: false,
      editInformationType: 0,
      editInformationValue: "",
      changeCapitans: false,
      capitansList: [],
      othersMembers: [],
      searchCapitan: "",
      removeMember: false,
      membersToRemove: [],
      countRemoved: 0,
      removeMeCapitans: false,
    };
  }

  componentDidMount = async () => {
    await this.setState({
      search: "",
      images: [],
    });
  };

  sendNotification = async () => {
    if ("" === this.state.textNotification) {
      this.showToast("The text for the notification is required");
    } else {
      await this.setState({ loading: true });
      this.props.sendNotification({
        userSend: this.props.session.account.id,
        username: this.props.session.account.name,
        userReceived: this.props.group.participants.filter(
          (element) => element.id !== this.props.session.account.id
        ),
        type: 3,
        view: 0,
        idGroupJoin: this.props.group.id,
        groupKey: this.props.group.key,
        description: this.state.textNotification,
        groupName: this.props.group.name,
      });
    }
  };

  componentWillReceiveProps = async (nextProps) => {
    if (this.props.sendNotificationProps !== nextProps.sendNotificationProps) {
      if (
        null !== nextProps.sendNotificationProps.status &&
        !nextProps.sendNotificationProps.status
      ) {
        this.showToast(nextProps.sendNotificationProps.messageError);
      } else if (
        null !== nextProps.sendNotificationProps.status &&
        nextProps.sendNotificationProps.status
      ) {
        await this.setState({
          showSendNotification: false,
          textNotification: "",
        });
      }
    }
    await this.setState({
      loading: false,
    });
  };

  showToast = async (sText) => {
    await this.setState({
      toastText: sText,
      loading: false,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
    }, 2000);
  };

  showMessages = async () => {
    var images = [];
    this.props.group.participants.map((oParticipant) => {
      if (undefined !== oParticipant.image) {
        images.push({
          key: oParticipant.key,
          image: oParticipant.image,
        });
      }
    });
    await this.setState({
      images: images,
    });
    this.props.checkMessageRead({
      accountId: this.props.session.account.key,
      groupId: this.props.group.key,
    });
    await this.setState({
      showMessages: true,
    });
  };

  addImageGroup = async (sType) => {
    await this.setState({
      showGroupPhoto: false,
    });
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_PROFILE)
        .then(async (oResponse) => {
          var nGroupKey = this.props.group.key,
            sImage = oResponse.data;
          this.props.changeInformtaion(nGroupKey, null, null, sImage);
        })
        .catch(() => {
          this.showToast(MESSAGE_ERROR);
        });
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_PROFILE)
        .then(async (oResponse) => {
          var nGroupKey = this.props.group.key,
            sImage = oResponse.data;
          this.props.changeInformtaion(nGroupKey, null, null, sImage);
        })
        .catch(() => {
          this.showToast(MESSAGE_ERROR);
        });
    }
  };

  showConfirmationLeaveGroup = async () => {
    await this.setState({
      showConfirmLeaveGroup: true,
    });
  };

  confirmChangeInformation = async () => {
    if (
      (1 === this.state.editInformationType &&
        this.state.editInformationValue.trim() !== this.props.group.name) ||
      (2 === this.state.editInformationType &&
        this.state.editInformationValue.trim() !== this.props.group.description)
    ) {
      if (this.state.editInformationValue.trim() !== "") {
        var nGroupKey = this.props.group.key,
          sName =
            1 === this.state.editInformationType
              ? this.state.editInformationValue.trim()
              : null,
          sDescription =
            2 === this.state.editInformationType
              ? this.state.editInformationValue.trim()
              : null;
        this.props.changeInformtaion(nGroupKey, sName, sDescription, null);
        await this.setState({
          showOptions: false,
          changeInformation: false,
          editInformationInput: false,
          editInformationType: 0,
          editInformationValue: "",
          loading: true,
        });
      } else {
        if (1 === this.state.editInformationType)
          this.showToast("The group name cannot be empty.");
        else this.showToast("The group description cannot be empty.");
        await this.setState({
          editInformationValue:
            1 === this.state.editInformationType
              ? this.props.group.name
              : this.props.group.description,
        });
      }
    } else {
      await this.setState({
        showOptions: false,
        changeInformation: false,
        editInformationInput: false,
        editInformationType: 0,
        editInformationValue: "",
      });
    }
  };

  updateCaptiansList = async () => {
    await this.setState({
      capitansList: [],
      othersMembers: [],
    });
    this.props.group.participants.forEach(async (oParticipant) => {
      if (this.props.group.capitans.includes(oParticipant)) {
        await this.setState({
          capitansList: [...this.state.capitansList, oParticipant],
        });
      } else {
        await this.setState({
          othersMembers: [...this.state.othersMembers, oParticipant],
        });
      }
    });
  };

  removeCapitan = async (oCapitan) => {
    if (oCapitan.key !== this.props.group.userCreated) {
      var aParticipants = await this.state.capitansList.filter(
        (oParticipant) => {
          return oParticipant.key !== oCapitan.key;
        }
      );
      await this.setState({
        othersMembers: [...this.state.othersMembers, oCapitan],
        capitansList: aParticipants,
      });
    } else {
      this.showToast("You can't remove the principal captain");
    }
  };

  addCapitan = async (oMember) => {
    if (this.state.capitansList.length < 3) {
      var aParticipants = await this.state.othersMembers.filter(
        (oParticipant) => {
          return oParticipant.key !== oMember.key;
        }
      );
      await this.setState({
        capitansList: [...this.state.capitansList, oMember],
        othersMembers: aParticipants,
        searchCapitan: "",
      });
    } else {
      this.showToast("Only three captains are allowed per group");
    }
  };

  confirmUpdateCapitans = async () => {
    var aCapitans = [];
    this.state.capitansList.forEach((oCapitan) => {
      aCapitans.push({ key: oCapitan.key, id: oCapitan.id });
    });
    this.props.updateCapitans(
      this.props.group.key,
      this.props.group.id,
      aCapitans
    );
    await this.setState({
      showOptions: false,
      updateCaptians: false,
      othersMembers: [],
      capitansList: [],
      changeCapitans: false,
      loading: true,
    });
  };

  removeMembersView = () => {
    var aParticipants = [];
    this.props.group.participants.forEach((oParticipant) => {
      oParticipant.isRemoved = false;
      aParticipants.push(oParticipant);
    });
    this.setState({
      removeMember: true,
      showOptions: false,
      membersToRemove: aParticipants,
      countRemoved: 0,
    });
  };

  selectMember = async (oMemberSelected) => {
    if (oMemberSelected.key !== this.props.group.userCreated) {
      if (!this.props.group.capitans.includes(oMemberSelected)) {
        var aMembers = [],
          nAddRemoveMember = 0;
        this.state.membersToRemove.forEach((oMember) => {
          if (oMember.key === oMemberSelected.key) {
            if (
              undefined === oMember.isRemoved ||
              oMember.isRemoved === false
            ) {
              oMember.isRemoved = true;
              nAddRemoveMember = 1;
            } else {
              oMember.isRemoved = false;
              nAddRemoveMember = -1;
            }
          }
          aMembers.push(oMember);
        });
        await this.setState({
          membersToRemove: aMembers,
          countRemoved: this.state.countRemoved + nAddRemoveMember,
          searchCapitan: "",
        });
      } else this.showToast("Not is possible remove at captain of the group");
    } else
      this.showToast(
        "Not is possible remove at principal captain of the group"
      );
  };

  confirmRemoveMembers = async () => {
    if (this.state.countRemoved > 0) {
      let nGroupId = this.props.group.id,
        sGroupKey = this.props.group.key,
        sUserName,
        sUserKey = this.props.userLoginKey,
        aMembers = [],
        aMembersToRemove = [];
      this.state.membersToRemove.forEach((oParticipant) => {
        if (this.props.userLoginKey === oParticipant.key)
          sUserName = oParticipant.name;
        if (oParticipant.isRemoved)
          aMembersToRemove.push({ key: oParticipant.key, id: oParticipant.id });
      });
      this.props.removeMembers(
        nGroupId,
        sGroupKey,
        sUserName,
        sUserKey,
        aMembersToRemove
      );
    }
    await this.setState({
      searchCapitan: "",
      removeMember: false,
      membersToRemove: [],
      countRemoved: 0,
    });
  };

  confirmRemoveMeCapitans = async () => {
    await this.setState({
      removeMeCapitans: false,
      loading: true,
    });
    var aCapitans = [];
    this.props.group.participants.forEach(async (oParticipant) => {
      if (
        this.props.group.capitans.includes(oParticipant) &&
        oParticipant.key !== this.props.userLoginKey
      )
        aCapitans.push({ key: oParticipant.key, id: oParticipant.id });
    });
    this.props.updateCapitans(
      this.props.group.key,
      this.props.group.id,
      aCapitans
    );
  };

  expandImage = async (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  render() {
    return (
      this.props.visible && (
        <View style={GlobalModal.viewContent}>
          <View
            style={
              (GlobalModal.viewHead,
              {
                justifyContent: "center",
                alignContent: "center",
                borderBottomColor: PlaceholderColor,
                borderBottomWidth: 0.5,
              })
            }
          >
            {this.props.isParticipant && !this.props.isCapitan && (
              <Pressable
                style={GlobalModal.buttonLeft}
                onPress={() => this.showMessages()}
              >
                {undefined !== this.props.group.messagesRead &&
                  this.props.group.messagesRead > 0 && (
                    <View style={styles.badgeTop}>
                      <Text style={GlobalMessages.text}>
                        {this.props.group.messagesRead}
                      </Text>
                    </View>
                  )}
                <Text style={GlobalModal.titleClose}>Messages</Text>
              </Pressable>
            )}
            <Text style={GlobalModal.headTitle}>Group</Text>
            <Pressable
              style={GlobalModal.buttonClose}
              onPress={() => {
                this.props.close();
                this.setState({
                  showOptions: false,
                  updateCaptians: false,
                  othersMembers: [],
                  capitansList: [],
                  changeCapitans: false,
                  removeMeCapitans: false,
                  previewImage: null,
                });
              }}
            >
              <Text style={GlobalModal.titleClose}>Close</Text>
            </Pressable>
          </View>
          <ScrollView style={{ padding: 10 }}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ alignItems: "center" }}>
                {null !== this.state.previewImage ? (
                  <Image
                    style={{
                      borderRadius: 100,
                      margin: 10,
                      height: 150,
                      width: 150,
                    }}
                    source={{
                      uri: "data:image/png;base64," + this.state.previewImage,
                    }}
                  />
                ) : this.props.group.image === null ? (
                  <Image
                    style={{
                      borderRadius: 100,
                      margin: 10,
                      height: 150,
                      width: 150,
                    }}
                    source={require("../../assets/imgGroup.png")}
                  />
                ) : (
                  <Pressable
                    onPress={() => this.expandImage(this.props.group.image)}
                  >
                    <FastImage
                      style={{
                        borderRadius: 100,
                        margin: 10,
                        height: 150,
                        width: 150,
                      }}
                      source={{
                        uri: this.props.group.image,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </Pressable>
                )}
                {this.props.isCapitan && (
                  <Pressable
                    onPress={() => this.setState({ showGroupPhoto: true })}
                    style={{
                      borderColor: SignUpColor,
                      borderRadius: 10,
                      borderWidth: 0.5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: SignUpColor,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Change Group Photo
                    </Text>
                  </Pressable>
                )}
                <Text
                  style={{
                    color: GreenFitrecColor,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  {this.props.group.type === 1
                    ? "Private Group"
                    : "Public Group"}
                </Text>
              </View>
              <View style={{ justifyContent: "flex-start", marginTop: 0 }}>
                {this.props.isParticipant && this.props.isCapitan ? (
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: GreenFitrecColor,
                          fontSize: 18,
                        }}
                      >
                        {this.props.group.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginRight: "auto",
                        marginLeft: "auto",
                      }}
                    >
                      <Pressable
                        onPress={() =>
                          this.setState({
                            showOptions: true,
                            removeMember: false,
                            changeCapitans: false,
                            changeInformation: false,
                            editInformationInput: false,
                            editInformationType: 0,
                            editInformationValue: "",
                            capitansList: [],
                            othersMembers: [],
                            searchCapitan: "",
                          })
                        }
                      >
                        <Icon
                          name="ellipsis-vertical"
                          size={22}
                          color={GreenFitrecColor}
                        />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: GreenFitrecColor,
                      fontSize: 18,
                      marginRight: 175,
                    }}
                  >
                    {this.props.group.name}
                  </Text>
                )}
                <View>
                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: "bold",
                      color: PlaceholderColor,
                    }}
                  >
                    Description
                  </Text>
                  {"" !== this.props.group.description ? (
                    <Text
                      style={{
                        fontWeight: "normal",
                        marginRight: 175,
                        textAlign: "justify",
                      }}
                    >
                      {this.props.group.description}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontWeight: "normal",
                        marginRight: 175,
                        textAlign: "justify",
                        fontStyle: "italic",
                      }}
                    >
                      No associated description
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {!this.state.changeCapitans && !this.state.removeMember ? (
              <View>
                {this.props.isParticipant && this.props.isCapitan ? (
                  <View>
                    {!this.props.isAddParticipant ? (
                      <View style={{ flexDirection: "row" }}>
                        <Pressable
                          onPress={() =>
                            this.setState({ showSendNotification: true })
                          }
                          style={{ flex: 6, marginRight: 5 }}
                        >
                          <View style={GlobalStyles.buttonCancel}>
                            <Text style={GlobalStyles.textButton}>
                              Notification
                            </Text>
                          </View>
                        </Pressable>
                        <Pressable
                          onPress={() => this.showMessages()}
                          style={{ flex: 6, marginLeft: 5 }}
                        >
                          <View style={GlobalStyles.buttonConfirm}>
                            <Text style={GlobalStyles.textButton}>Message</Text>
                            {undefined !== this.props.group.messagesRead &&
                              this.props.group.messagesRead > 0 && (
                                <View style={styles.badge}>
                                  <Text style={GlobalMessages.text}>
                                    {this.props.group.messagesRead}
                                  </Text>
                                </View>
                              )}
                          </View>
                        </Pressable>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <Pressable
                          onPress={() => {
                            this.props.addMember();
                            this.setState({ search: "" });
                          }}
                          style={{ flex: 6, marginRight: 5 }}
                        >
                          <View style={GlobalStyles.buttonCancel}>
                            <Text style={GlobalStyles.textButton}>Cancel</Text>
                          </View>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            this.props.confirmAddMember();
                            this.setState({ search: "" });
                          }}
                          style={{ flex: 6, marginLeft: 5 }}
                        >
                          <View style={GlobalStyles.buttonConfirm}>
                            <Text style={GlobalStyles.textButton}>
                              Confirm{" "}
                              {undefined !==
                                this.props.newParticipants.length &&
                              null !== this.props.newParticipants.length &&
                              this.props.newParticipants.length > 0
                                ? " (" +
                                  this.props.newParticipants.length.toString() +
                                  ")"
                                : ""}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  </View>
                ) : (
                  this.props.isParticipant &&
                  this.props.isAddParticipant &&
                  (this.props.group.type == 0 || this.props.isCapitan) && (
                    <View style={{ flexDirection: "row" }}>
                      <Pressable
                        onPress={() => {
                          this.props.addMember();
                          this.setState({ search: "" });
                        }}
                        style={{ flex: 6, marginRight: 5 }}
                      >
                        <View style={GlobalStyles.buttonCancel}>
                          <Text style={GlobalStyles.textButton}>Cancel</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          this.props.confirmAddMember();
                          this.setState({ search: "" });
                        }}
                        style={{ flex: 6, marginLeft: 5 }}
                      >
                        <View style={GlobalStyles.buttonConfirm}>
                          <Text style={GlobalStyles.textButton}>
                            Confirm{" "}
                            {undefined !== this.props.newParticipants.length &&
                            null !== this.props.newParticipants.length &&
                            this.props.newParticipants.length > 0
                              ? "(" +
                                this.props.newParticipants.length.toString() +
                                ")"
                              : ""}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )
                )}
                {this.props.isParticipant &&
                  !this.props.isAddParticipant &&
                  (this.props.group.type == 0 || this.props.isCapitan) && (
                    <View>
                      <Pressable onPress={() => this.props.addMember()}>
                        <View style={GlobalStyles.buttonConfirm}>
                          <Text style={GlobalStyles.textButton}>
                            Add Member
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    alignSelf: "center",
                  }}
                >
                  <Icon name="ios-people" size={40} color={PlaceholderColor} />
                  <View style={{ justifyContent: "center", marginLeft: "5%" }}>
                    <Text style={{ fontSize: 16, color: GreenFitrecColor }}>
                      PARTICIPANTS:{" "}
                      {undefined !== this.props.group.participants &&
                        this.props.group.participants.length}
                    </Text>
                  </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                  {!this.props.isAddParticipant ? (
                    <FlatList
                      data={this.props.group.participants}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => {
                        return (
                          <View style={styles.viewNotificaton}>
                            <Pressable
                              onPress={() => {
                                this.props.viewProfile(item);
                              }}
                              style={{ flexDirection: "row", width: "100%" }}
                            >
                              <View style={{ margin: 10 }}>
                                {null !== item.image ? (
                                  <FastImage
                                    style={GlobalStyles.photoProfileCardList}
                                    source={{
                                      uri: item.image,
                                      priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                  />
                                ) : (
                                  <Image
                                    style={GlobalStyles.photoProfileCardList}
                                    source={require("../../assets/imgGroup.png")}
                                  />
                                )}
                              </View>
                              <View
                                style={{
                                  justifyContent: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <Text style={styles.textUserReference}>
                                  {this.props.userLoginKey === item.key
                                    ? "You"
                                    : item.name}
                                </Text>
                                <Text>
                                  @
                                  {this.props.userLoginKey === item.key
                                    ? "You"
                                    : item.username}
                                </Text>
                              </View>
                              {this.props.group.capitans.includes(item) && (
                                <View style={styles.viewIconRight}>
                                  <View style={{ flexDirection: "row" }}>
                                    <Icon
                                      name="ios-help-buoy"
                                      size={18}
                                      color={SignUpColor}
                                    />
                                    <Text style={{ marginLeft: 2 }}>
                                      Captain
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </Pressable>
                          </View>
                        );
                      }}
                    />
                  ) : (
                    <View>
                      <SearchUsername
                        ph={"Search for people or username"}
                        value={this.state.search}
                        change={(text) => {
                          this.setState({ search: text });
                        }}
                        blur={() => this.props.searchUsers(this.state.search)}
                        clean={() => {
                          this.setState({ search: "" });
                          this.props.searchUsers("");
                        }}
                      />
                      {"" === this.state.search &&
                        this.props.newParticipants.length > 0 && (
                          <View>
                            <View style={styles.containerTextList}>
                              <Text style={styles.textList}>
                                List of invitations
                              </Text>
                            </View>
                            <FlatList
                              data={this.props.newParticipants}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => {
                                return (
                                  <Pressable
                                    onPress={() =>
                                      this.props.addParticipant(item)
                                    }
                                    style={{
                                      flexDirection: "row",
                                      width: "100%",
                                    }}
                                  >
                                    <View style={{ margin: 10 }}>
                                      {null !== item.image ? (
                                        <FastImage
                                          style={
                                            GlobalStyles.photoProfileCardList
                                          }
                                          source={{
                                            uri: item.image,
                                            priority: FastImage.priority.high,
                                          }}
                                          resizeMode={
                                            FastImage.resizeMode.cover
                                          }
                                        />
                                      ) : (
                                        <Image
                                          style={
                                            GlobalStyles.photoProfileCardList
                                          }
                                          source={require("../../assets/imgGroup.png")}
                                        />
                                      )}
                                    </View>
                                    <View
                                      style={{
                                        justifyContent: "center",
                                        marginLeft: 10,
                                      }}
                                    >
                                      <Text style={styles.textUserReference}>
                                        {item.name}
                                      </Text>
                                      <Text>@{item.username}</Text>
                                    </View>
                                    {this.props.newParticipants.filter(
                                      (element) => element.key === item.key
                                    ).length > 0 && (
                                      <View style={styles.viewIconRight}>
                                        <View style={{ flexDirection: "row" }}>
                                          <Icon
                                            name="md-checkmark-circle"
                                            size={24}
                                            color={SignUpColor}
                                          />
                                        </View>
                                      </View>
                                    )}
                                  </Pressable>
                                );
                              }}
                            />
                          </View>
                        )}
                      {"" === this.state.search &&
                        this.props.newParticipants.length > 0 &&
                        this.props.friends.filter(
                          (oElement) =>
                            !oElement.invitationsGroup.includes(
                              this.props.group.key
                            ) &&
                            !this.props.group.users.includes(oElement.key) &&
                            !this.props.newParticipants.filter(
                              (element) => element.key === oElement.key
                            ).length > 0
                        ).length > 0 && (
                          <View style={styles.containerTextList}>
                            <Text style={styles.textList}>List of pals</Text>
                          </View>
                        )}
                      <FlatList
                        data={this.props.friends}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                          return !item.invitationsGroup.includes(
                            this.props.group.key
                          ) && !this.props.group.users.includes(item.key) ? (
                            <View>
                              {!this.props.newParticipants.filter(
                                (element) => element.key === item.key
                              ).length > 0 && (
                                <Pressable
                                  onPress={() =>
                                    this.props.addParticipant(item)
                                  }
                                  style={{
                                    flexDirection: "row",
                                    width: "100%",
                                  }}
                                >
                                  <View style={{ margin: 10 }}>
                                    {null !== item.image ? (
                                      <FastImage
                                        style={
                                          GlobalStyles.photoProfileCardList
                                        }
                                        source={{
                                          uri: item.image,
                                          priority: FastImage.priority.high,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                      />
                                    ) : (
                                      <Image
                                        style={
                                          GlobalStyles.photoProfileCardList
                                        }
                                        source={require("../../assets/imgGroup.png")}
                                      />
                                    )}
                                  </View>
                                  <View
                                    style={{
                                      justifyContent: "center",
                                      marginLeft: 10,
                                    }}
                                  >
                                    <Text style={styles.textUserReference}>
                                      {item.name}
                                    </Text>
                                    <Text>@{item.username}</Text>
                                  </View>
                                  {this.props.newParticipants.filter(
                                    (element) => element.key === item.key
                                  ).length > 0 && (
                                    <View style={styles.viewIconRight}>
                                      <View style={{ flexDirection: "row" }}>
                                        <Icon
                                          name="md-checkmark-circle"
                                          size={24}
                                          color={SignUpColor}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </Pressable>
                              )}
                            </View>
                          ) : this.props.group.users.includes(item.key) ? (
                            <View
                              style={{ flexDirection: "row", width: "100%" }}
                            >
                              <View style={{ margin: 10 }}>
                                {null !== item.image ? (
                                  <FastImage
                                    style={GlobalStyles.photoProfileCardList}
                                    source={{
                                      uri: item.image,
                                      priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                  />
                                ) : (
                                  <Image
                                    style={GlobalStyles.photoProfileCardList}
                                    source={require("../../assets/imgGroup.png")}
                                  />
                                )}
                              </View>
                              <View
                                style={{
                                  justifyContent: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <Text style={styles.textUserReference}>
                                  {item.name}
                                </Text>
                                <Text>@{item.username}</Text>
                              </View>
                              {
                                <View
                                  style={[
                                    styles.viewIconRight,
                                    {
                                      flexDirection: "row",
                                      alignItems: "center",
                                    },
                                  ]}
                                >
                                  <Text style={{ color: SignUpColor }}>
                                    Member
                                  </Text>
                                  <Icon
                                    name="md-checkmark-circle"
                                    size={24}
                                    color={SignUpColor}
                                  />
                                </View>
                              }
                            </View>
                          ) : (
                            <View
                              style={{ flexDirection: "row", width: "100%" }}
                            >
                              <View style={{ margin: 10 }}>
                                {null !== item.image ? (
                                  <FastImage
                                    style={GlobalStyles.photoProfileCardList}
                                    source={{
                                      uri: item.image,
                                      priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                  />
                                ) : (
                                  <Image
                                    style={GlobalStyles.photoProfileCardList}
                                    source={require("../../assets/imgGroup.png")}
                                  />
                                )}
                              </View>
                              <View
                                style={{
                                  justifyContent: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <Text style={styles.textUserReference}>
                                  {item.name}
                                </Text>
                                <Text>@{item.username}</Text>
                              </View>
                              {
                                <View
                                  style={[
                                    styles.viewIconRight,
                                    {
                                      flexDirection: "row",
                                      alignItems: "center",
                                    },
                                  ]}
                                >
                                  <Text style={{ color: SignUpColor }}>
                                    Invited{" "}
                                  </Text>
                                  <Icon
                                    name="md-checkmark-circle"
                                    size={24}
                                    color={SignUpColor}
                                  />
                                </View>
                              }
                            </View>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            ) : this.state.changeCapitans ? (
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    onPress={() => this.setState({ changeCapitans: false })}
                    style={{ flex: 6, marginRight: 5 }}
                  >
                    <View style={GlobalStyles.buttonCancel}>
                      <Text style={GlobalStyles.textButton}>Cancel</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      this.confirmUpdateCapitans();
                    }}
                    style={{ flex: 6, marginLeft: 5 }}
                  >
                    <View style={GlobalStyles.buttonConfirm}>
                      <Text style={GlobalStyles.textButton}>Confirm</Text>
                    </View>
                  </Pressable>
                </View>
                <View>
                  <SearchUsername
                    ph={"Search people on group"}
                    value={this.state.searchCapitan}
                    change={(text) => {
                      this.setState({ searchCapitan: text });
                    }}
                    blur={() => {}}
                    clean={() => {
                      this.setState({ searchCapitan: "" });
                    }}
                  />
                  {
                    <View>
                      <View style={styles.containerTextList}>
                        <Text style={styles.textList}>List of Captains</Text>
                      </View>
                      <View
                        style={[
                          styles.viewActivitiesSelected,
                          styles.margin,
                          {
                            alignItems: "center",
                            marginLeft: "auto",
                            marginRight: "auto",
                          },
                        ]}
                      >
                        {this.state.capitansList.map((item) => (
                          <Pressable
                            key={item.key}
                            onPress={() => {
                              this.removeCapitan(item);
                            }}
                          >
                            <View
                              style={[
                                styles.margin,
                                { alignItems: "center", textAlign: "center" },
                              ]}
                            >
                              <View>
                                {item.image === null ||
                                item.image === undefined ? (
                                  <Image
                                    style={GlobalStyles.photoProfileCardList}
                                    source={require("../../assets/imgGroup.png")}
                                  />
                                ) : (
                                  <FastImage
                                    style={GlobalStyles.photoProfileCardList}
                                    source={{
                                      uri: item.image,
                                      priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                  />
                                )}
                                {item.key === this.props.group.userCreated ? (
                                  <View style={styles.iconUser}>
                                    <Icon
                                      name="md-star"
                                      size={24}
                                      color={SignUpColor}
                                    />
                                  </View>
                                ) : (
                                  <View style={styles.iconUser}>
                                    <Icon
                                      name="md-checkmark-circle"
                                      size={24}
                                      color={SignUpColor}
                                    />
                                  </View>
                                )}
                              </View>
                              <View>
                                <Text>{item.username}</Text>
                              </View>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  }
                  {this.state.othersMembers.length > 0 ? (
                    <View style={styles.containerTextList}>
                      <Text style={styles.textList}>List of Members</Text>
                    </View>
                  ) : (
                    <View style={styles.containerTextList}>
                      <Text style={styles.textList}>
                        The all members are captains
                      </Text>
                    </View>
                  )}
                  <FlatList
                    data={this.state.othersMembers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      return this.state.searchCapitan === "" ? (
                        <Pressable
                          onPress={() => this.addCapitan(item)}
                          style={{ flexDirection: "row", width: "100%" }}
                        >
                          <View style={{ margin: 10 }}>
                            {null !== item.image ? (
                              <FastImage
                                style={GlobalStyles.photoProfileCardList}
                                source={{
                                  uri: item.image,
                                  priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            ) : (
                              <Image
                                style={GlobalStyles.photoProfileCardList}
                                source={require("../../assets/imgGroup.png")}
                              />
                            )}
                          </View>
                          <View
                            style={{ justifyContent: "center", marginLeft: 10 }}
                          >
                            <Text style={styles.textUserReference}>
                              {item.name}
                            </Text>
                            <Text>@{item.username}</Text>
                          </View>
                        </Pressable>
                      ) : (
                        (item.username
                          .toLowerCase()
                          .includes(this.state.searchCapitan.toLowerCase()) ||
                          item.name
                            .toLowerCase()
                            .includes(
                              this.state.searchCapitan.toLowerCase()
                            )) && (
                          <Pressable
                            onPress={() => this.addCapitan(item)}
                            style={{ flexDirection: "row", width: "100%" }}
                          >
                            <View style={{ margin: 10 }}>
                              {null !== item.image ? (
                                <FastImage
                                  style={GlobalStyles.photoProfileCardList}
                                  source={{
                                    uri: item.image,
                                    priority: FastImage.priority.high,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              ) : (
                                <Image
                                  style={GlobalStyles.photoProfileCardList}
                                  source={require("../../assets/imgGroup.png")}
                                />
                              )}
                            </View>
                            <View
                              style={{
                                justifyContent: "center",
                                marginLeft: 10,
                              }}
                            >
                              <Text style={styles.textUserReference}>
                                {item.name}
                              </Text>
                              <Text>@{item.username}</Text>
                            </View>
                          </Pressable>
                        )
                      );
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    onPress={() =>
                      this.setState({
                        removeMember: false,
                        membersToRemove: [],
                      })
                    }
                    style={{ flex: 6, marginRight: 5 }}
                  >
                    <View style={GlobalStyles.buttonCancel}>
                      <Text style={GlobalStyles.textButton}>Cancel</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      this.confirmRemoveMembers();
                    }}
                    style={{ flex: 6, marginLeft: 5 }}
                  >
                    <View style={GlobalStyles.buttonConfirm}>
                      <Text style={GlobalStyles.textButton}>
                        Confirm{" "}
                        {this.state.countRemoved > 0
                          ? "(" + this.state.countRemoved.toString() + ")"
                          : ""}
                      </Text>
                    </View>
                  </Pressable>
                </View>
                <View>
                  <FlatList
                    data={this.state.membersToRemove}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      return this.state.searchCapitan === "" ? (
                        <Pressable
                          onPress={() => this.selectMember(item)}
                          style={{ flexDirection: "row", width: "100%" }}
                        >
                          <View style={{ margin: 10 }}>
                            {null !== item.image ? (
                              <FastImage
                                style={GlobalStyles.photoProfileCardList}
                                source={{
                                  uri: item.image,
                                  priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            ) : (
                              <Image
                                style={GlobalStyles.photoProfileCardList}
                                source={require("../../assets/imgGroup.png")}
                              />
                            )}
                          </View>
                          <View
                            style={{ justifyContent: "center", marginLeft: 10 }}
                          >
                            <Text style={styles.textUserReference}>
                              {item.name}
                            </Text>
                            <Text>@{item.username}</Text>
                          </View>
                          {item.key === this.props.group.userCreated ? (
                            <View style={styles.viewIconRight}>
                              <View style={{ flexDirection: "row" }}>
                                <Icon
                                  name="md-star"
                                  size={24}
                                  color={SignUpColor}
                                />
                              </View>
                            </View>
                          ) : this.props.group.capitans.includes(item) ? (
                            <View style={styles.viewIconRight}>
                              <View style={{ flexDirection: "row" }}>
                                <Icon
                                  name="ios-help-buoy"
                                  size={24}
                                  color={SignUpColor}
                                />
                              </View>
                            </View>
                          ) : (
                            undefined !== item.isRemoved &&
                            item.isRemoved === true && (
                              <View style={styles.viewIconRight}>
                                <View style={{ flexDirection: "row" }}>
                                  <Icon
                                    name="md-checkmark-circle"
                                    size={24}
                                    color={SignUpColor}
                                  />
                                </View>
                              </View>
                            )
                          )}
                        </Pressable>
                      ) : (
                        (item.username
                          .toLowerCase()
                          .includes(this.state.searchCapitan.toLowerCase()) ||
                          item.name
                            .toLowerCase()
                            .includes(
                              this.state.searchCapitan.toLowerCase()
                            )) && (
                          <Pressable
                            onPress={() => this.addCapitan(item)}
                            style={{ flexDirection: "row", width: "100%" }}
                          >
                            <View style={{ margin: 10 }}>
                              {null !== item.image ? (
                                <FastImage
                                  style={GlobalStyles.photoProfileCardList}
                                  source={{
                                    uri: item.image,
                                    priority: FastImage.priority.high,
                                  }}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              ) : (
                                <Image
                                  style={GlobalStyles.photoProfileCardList}
                                  source={require("../../assets/imgGroup.png")}
                                />
                              )}
                            </View>
                            <View
                              style={{
                                justifyContent: "center",
                                marginLeft: 10,
                              }}
                            >
                              <Text style={styles.textUserReference}>
                                {item.name}
                              </Text>
                              <Text>@{item.username}</Text>
                            </View>
                            {undefined !== item.isRemoved &&
                              item.isRemoved === true && (
                                <View style={styles.viewIconRight}>
                                  <View style={{ flexDirection: "row" }}>
                                    <Icon
                                      name="md-checkmark-circle"
                                      size={24}
                                      color={SignUpColor}
                                    />
                                  </View>
                                </View>
                              )}
                          </Pressable>
                        )
                      );
                    }}
                  />
                </View>
              </View>
            )}
          </ScrollView>
          {this.props.group.users.includes(this.props.session.account.key) ? (
            <Pressable
              onPress={() => this.setState({ showConfirmLeaveGroup: true })}
            >
              <View
                style={{
                  backgroundColor: SignUpColor,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text style={GlobalStyles.textButton}>Leave the group</Text>
              </View>
            </Pressable>
          ) : this.props.group.type ? (
            <Pressable onPress={this.props.requestJoinGroup}>
              <View
                style={{
                  backgroundColor: GreenFitrecColor,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text style={GlobalStyles.textButton}>Send request join</Text>
              </View>
            </Pressable>
          ) : (
            <Pressable onPress={this.props.joinGroup}>
              <View
                style={{
                  backgroundColor: GreenFitrecColor,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text style={GlobalStyles.textButton}>Join the group</Text>
              </View>
            </Pressable>
          )}
          {this.state.showSendNotification && (
            <View style={ToastQuestionGenericStyles.contentToast}>
              <View style={ToastQuestionGenericStyles.viewToast}>
                <TextInput
                  numberOfLines={4}
                  multiline={true}
                  style={ToastQuestionGenericStyles.inputLarge}
                  value={this.state.textNotification}
                  onChangeText={(text) =>
                    this.setState({ textNotification: text })
                  }
                />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonCancel}
                      onPress={() =>
                        this.setState({ showSendNotification: false })
                      }
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonConfirm}
                      onPress={() => this.sendNotification()}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Send
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
          {this.state.showConfirmLeaveGroup && (
            <View style={ToastQuestionGenericStyles.contentToastConfirm}>
              <View style={ToastQuestionGenericStyles.viewToast}>
                <Text style={ToastQuestionGenericStyles.textToast}>
                  Sure you want to leave the group?
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonCancel}
                      onPress={() =>
                        this.setState({ showConfirmLeaveGroup: false })
                      }
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonConfirm}
                      onPress={() => {
                        this.setState({ showConfirmLeaveGroup: false }),
                          this.props.leaveGroup();
                      }}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Confirm
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
          <ToastQuestionGeneric
            visible={this.state.showOptions}
            options={
              <View style={{ padding: 10 }}>
                <Pressable
                  onPress={() =>
                    this.setState({
                      changeInformation: true,
                      showOptions: false,
                    })
                  }
                >
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Icon name="ios-create" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Edit information
                    </Text>
                  </View>
                </Pressable>
                {this.props.isCapitan &&
                this.props.group.userCreated === this.props.userLoginKey ? (
                  <Pressable
                    onPress={() => {
                      this.setState({
                        changeCapitans: true,
                        showOptions: false,
                      });
                      this.updateCaptiansList();
                    }}
                  >
                    <View style={ToastQuestionGenericStyles.viewButtonOption}>
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Modify captains
                      </Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      this.setState({
                        removeMeCapitans: true,
                        showOptions: false,
                      });
                      this.updateCaptiansList();
                    }}
                  >
                    <View style={ToastQuestionGenericStyles.viewButtonOption}>
                      <Text
                        style={ToastQuestionGenericStyles.viewButtonOptionText}
                      >
                        Stop being captain
                      </Text>
                    </View>
                  </Pressable>
                )}
                <Pressable onPress={() => this.removeMembersView()}>
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Remove Member
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => this.setState({ showOptions: false })}
                >
                  <View
                    style={[
                      ToastQuestionGenericStyles.viewButtonOption,
                      { marginBottom: 0 },
                    ]}
                  >
                    <Icon name="md-close" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Close
                    </Text>
                  </View>
                </Pressable>
              </View>
            }
            close={() => this.setState({ showOptions: false })}
          />
          <ToastQuestionGeneric
            visible={this.state.changeInformation}
            options={
              <View style={{ padding: 10 }}>
                <Pressable
                  onPress={() =>
                    this.setState({
                      editInformationType: 1,
                      changeInformation: false,
                      editInformationInput: true,
                      editInformationValue: this.props.group.name,
                    })
                  }
                >
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Title
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() =>
                    this.setState({
                      editInformationType: 2,
                      changeInformation: false,
                      editInformationInput: true,
                      editInformationValue: this.props.group.description,
                    })
                  }
                >
                  <View style={ToastQuestionGenericStyles.viewButtonOption}>
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Description
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() =>
                    this.setState({
                      changeInformation: false,
                      showOptions: true,
                    })
                  }
                >
                  <View
                    style={[
                      ToastQuestionGenericStyles.viewButtonOption,
                      { marginBottom: 0 },
                    ]}
                  >
                    <Icon name="md-arrow-back" size={22} color={WhiteColor} />
                    <Text
                      style={ToastQuestionGenericStyles.viewButtonOptionText}
                    >
                      Back
                    </Text>
                  </View>
                </Pressable>
              </View>
            }
            close={() => this.setState({ changeInformation: false })}
          />
          {this.state.editInformationInput && (
            <View style={ToastQuestionGenericStyles.contentToast}>
              <View style={ToastQuestionGenericStyles.viewToast}>
                <TextInput
                  numberOfLines={4}
                  multiline={true}
                  style={ToastQuestionGenericStyles.inputLarge}
                  value={this.state.editInformationValue}
                  onChangeText={(text) =>
                    this.setState({ editInformationValue: text })
                  }
                />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonCancel}
                      onPress={() =>
                        this.setState({
                          editInformationValue: "",
                          editInformationInput: false,
                          changeInformation: true,
                        })
                      }
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonConfirm}
                      onPress={() => {
                        this.confirmChangeInformation();
                      }}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Confirm
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
          {this.state.removeMeCapitans && (
            <View style={ToastQuestionGenericStyles.contentToastConfirm}>
              <View style={ToastQuestionGenericStyles.viewToast}>
                <Text style={ToastQuestionGenericStyles.textToast}>
                  Are you sure you want to leave the captain role?
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonCancel}
                      onPress={() => this.setState({ removeMeCapitans: false })}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Pressable
                      style={ToastQuestionGenericStyles.buttonConfirm}
                      onPress={() => this.confirmRemoveMeCapitans()}
                    >
                      <Text style={ToastQuestionGenericStyles.buttonText}>
                        Confirm
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
          <LoadingSpinner visible={this.state.loading} />
          <Toast toastText={this.state.toastText} />
          <ConversationGroup
            visible={this.state.showMessages}
            group={this.props.group}
            close={() => this.setState({ showMessages: false })}
            images={this.state.images}
            viewProfile={(item) => this.props.viewProfile(item)}
          />
          <ToastQuestion
            visible={this.state.showGroupPhoto}
            functionCamera={() => this.addImageGroup("camera")}
            functionGallery={() => this.addImageGroup("gallery")}
          />
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  viewNotificaton: {
    flexDirection: "row",
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
  viewIconRight: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  textList: {
    justifyContent: "center",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
    fontSize: 14,
    color: GreenFitrecColor,
  },
  containerTextList: {
    borderBottomColor: GreenFitrecColor,
    borderBottomWidth: 2,
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 5,
    backgroundColor: SignUpColor,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeTop: {
    position: "absolute",
    top: 8,
    right: -15,
    backgroundColor: SignUpColor,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  textPhoto: {
    color: SignUpColor,
    fontWeight: "100",
    textAlign: "center",
    fontSize: 16,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  view: {
    width: "100%",
    alignItems: "flex-start",
    marginStart: 35,
    flexDirection: "row",
    alignItems: "center",
  },
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 10,
    color: PlaceholderColor,
    fontSize: 15,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  margin: {
    margin: 5,
  },
  viewActivitiesSelected: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconUser: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  sendNotificationProps: state.reducerSendNotification,
});

const mapDispatchToProps = (dispatch) => ({
  sendNotification: (data) => {
    dispatch(actionSendNotificationCapitan(data));
  },
  checkMessageRead: (data) => {
    dispatch(actionCheckReadMessageGroup(data));
  },
  changeInformtaion: (nGroupKey, sName, sDescription, sImage) => {
    dispatch(actionUpdateGroup(nGroupKey, sName, sDescription, sImage));
  },
  updateCapitans: (sGroupKey, nGroupId, aCapitans) => {
    dispatch(actionUpdateCapitans(sGroupKey, nGroupId, aCapitans));
  },
  removeMembers: (
    nGroupId,
    sGroupKey,
    sUserName,
    sUserKey,
    aMembersToRemove
  ) => {
    dispatch(
      actionRemoveMembers(
        nGroupId,
        sGroupKey,
        sUserName,
        sUserKey,
        aMembersToRemove
      )
    );
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowDetailsGroup);
