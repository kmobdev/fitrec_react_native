import React, { Component } from "react";
import {
  GlobalStyles,
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
  ToastQuestionGenericStyles,
  WhiteColor,
} from "../../Styles";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Keyboard,
  TextInput,
} from "react-native";
import {
  actionExpandImage,
  actionMessage,
} from "../../redux/actions/SharedActions";
import {
  actionAddMember,
  actionGetGroup,
  actionGetMessages,
  actionJoinGroup,
  actionLeaveGroup,
  actionRemoveMembers,
  actionRequestJoinGroup,
  actionSendNotificationCapitan,
  actionUpdateCapitans,
  actionUpdateGroup,
  actionAssignAnotherCaptainToLeave,
  actionDeleteGroup,
  actionReadMessageActualGroup,
} from "../../redux/actions/GroupActions";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import ImagePicker from "react-native-image-crop-picker";
import { MESSAGE_ERROR, OPTIONS_IMAGE_CROP_PROFILE } from "../../Constants";
import { ToastQuestionGeneric } from "../../components/shared/ToastQuestionGeneric";
import Icon from "react-native-vector-icons/Ionicons";
import {
  actionGetMyFriends,
  actionGetProfile,
} from "../../redux/actions/ProfileActions";
import { SearchUsername } from "../../components/chat/SearchUsername";
import { actionGetPeopleGroup } from "../../redux/actions/MyPalsActions";
import { actionCleanNavigation } from "../../redux/actions/NavigationActions";
import { GROUP_PRIVATE, GROUP_PUBLIC } from "../../constants/Groups";

const GroupImageDefault = require("../../assets/imgGroup.png");
const UserImageDefault = require("../../assets/profile.png");

const EDIT_INFORMATION_TYPE_NAME = 1;
const EDIT_INFORMATION_TYPE_DESCRIPTION = 2;

const oInitialState = {
  sPreviewImage: null,
  bShowGroupPhoto: false,
  bShowOptions: false,
  bIsAddParticipants: false,
  bShowSendNotification: false,
  sTextNotification: "",
  bChangeInformation: false,
  sEditInformationValue: "",
  bShowEditInformationInput: false,
  nEditInformationType: 0,
  bRemoveMeCaptains: false,
  bChangeCaptains: false,
  aParticipants: [],
  bRemoveMembers: false,
  sSearch: "",
  aNewMembers: [],
  aPalsList: [],
  nKeyboardPadding: 0,
  bAsignMessageFunction: false,
  bShowConfirmLeaveGroup: false,
  bShowConfirmSendRequest: false,
  bShowConfirmJoin: false,
  bShowQuestionLeavePrincipalCaptain: false,
  bShowAssignCaptain: false,
  bConfirmationDeleteGroup: false,
  aLastCaptains: [],
};

class ShowDetailsGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { ...oInitialState, nMessageCount: null };
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ goBack: this.goBack, messages: null });
    this.oKeyboardListenerWillShow = Keyboard.addListener(
      "keyboardWillShow",
      this.openKeyboard
    );
    this.oKeyboardListenerWillHide = Keyboard.addListener(
      "keyboardWillHide",
      this.closeKeyboard
    );
  };

  componentWillUnmount = () => {
    this.oKeyboardListenerWillShow && this.oKeyboardListenerWillShow.remove();
    this.oKeyboardListenerWillHide && this.oKeyboardListenerWillHide.remove();
    this.props.cleanGroup();
  };

  componentDidUpdate = () => {
    if (this.getIsParticipant() && !this.state.bAsignMessageFunction) {
      this.props.navigation.setParams({
        goBack: this.goBack,
        messages: this.showMessages,
      });
      this.setState({ bAsignMessageFunction: true });
    }
    if (this.props.groupProps.bDeleted) this.goBack();
    if (this.props.groupProps.bLeave) {
      this.props.clean();
      this.props.navigation.setParams({ goBack: this.goBack, messages: null });
    }
    if (
      this.props.groupProps.oGroup &&
      (this.state.nMessageCount === null ||
        this.state.nMessageCount !== this.props.groupProps.oGroup.messagesRead)
    ) {
      this.setState({
        nMessageCount: this.props.groupProps.oGroup.messagesRead,
      });
      this.props.navigation.setParams({
        countMessages: this.props.groupProps.oGroup.messagesRead,
      });
    }
  };

  openKeyboard = ({ endCoordinates: { height } }) => {
    this.setState({ nKeyboardPadding: height });
  };

  closeKeyboard = ({ endCoordinates: { height } }) => {
    this.setState({ nKeyboardPadding: 0 });
  };

  goBack = () => {
    this.props.cleanGroup();
    this.props.navigation.goBack();
  };

  expandImage = (sUrlToImage) => {
    this.props.expandImage(sUrlToImage);
  };

  getIsCaptain = () => {
    const { oGroup } = this.props.groupProps;
    if (oGroup) {
      const { participants: aParticipants } = oGroup;
      const { key: sUserKey } = this.props.session.account;
      let oUser = aParticipants.filter(
        (oParticipant) => oParticipant.key === sUserKey
      );
      return oUser.length > 0 ? oUser[0].isCaptain : false;
    }
    return false;
  };

  getIsParticipant = () => {
    const { oGroup } = this.props.groupProps;
    if (oGroup) {
      const { participants: aParticipants } = oGroup;
      const { key: sUserKey } = this.props.session.account;
      let oUser = aParticipants.filter(
        (oParticipant) => oParticipant.key === sUserKey
      );
      return oUser.length > 0 ? true : false;
    }
    return false;
  };

  getIsRequestUser = () => {
    const { oGroup } = this.props.groupProps;
    if (oGroup) {
      const { requests: aRequests } = oGroup;
      const { key: sUserKey } = this.props.session.account;
      return aRequests.indexOf(sUserKey) >= 0 ? true : false;
    }
    return false;
  };

  addImageGroup = (sType) => {
    const { oGroup } = this.props.groupProps;
    this.setState({
      bShowGroupPhoto: false,
    });
    if ("camera" === sType) {
      ImagePicker.openCamera(OPTIONS_IMAGE_CROP_PROFILE)
        .then((oResponse) => {
          let nGroupKey = oGroup.key,
            sImage = oResponse.data;
          this.props.changeInformtaion(nGroupKey, null, null, sImage);
        })
        .catch((oError) => {
          if (oError.code !== "E_PICKER_CANCELLED")
            this.props.message(MESSAGE_ERROR);
        });
    } else {
      ImagePicker.openPicker(OPTIONS_IMAGE_CROP_PROFILE)
        .then((oResponse) => {
          let nGroupKey = oGroup.key,
            sImage = oResponse.data;
          this.props.changeInformtaion(nGroupKey, null, null, sImage);
        })
        .catch((oError) => {
          if (oError.code !== "E_PICKER_CANCELLED")
            this.props.message(MESSAGE_ERROR);
        });
    }
  };

  showMessages = () => {
    const { conversation: sConversationKey, key: sGroupKey } =
      this.props.groupProps.oGroup;
    const { key: sUserKey } = this.props.session.account;
    this.props.getMessagesGroup(sConversationKey, sGroupKey, sUserKey);
    this.props.readMessageActualGroup();
    this.props.navigation.navigate("MessagesGroup");
  };

  openOptions = () => {
    this.setState({
      ...oInitialState,
      bShowOptions: true,
    });
  };

  handleOnCancel = () => {
    const { bIsAddParticipants } = this.state;
    if (bIsAddParticipants) {
      const { aNewMembers } = this.state;
      aNewMembers.forEach((oMember) => {
        oMember.isSelected = false;
      });
    }
    this.setState(oInitialState);
  };

  handleOnConfirm = () => {
    const {
      bIsAddParticipants,
      bChangeCaptains,
      bRemoveMembers,
      bRemoveMeCaptains,
      bShowConfirmLeaveGroup,
      bShowConfirmSendRequest,
      bShowConfirmJoin,
      bShowAssignCaptain,
      bConfirmationDeleteGroup,
    } = this.state;
    const {
      id: nGroupId,
      key: sGroupKey,
      name: sGroupName,
      image: sGroupImage,
      captain: sMainCaptainKey,
    } = this.props.groupProps.oGroup;
    const {
      key: sUserKey,
      id: nUserId,
      name: sUserName,
      image: sImage,
      username: sUsername,
    } = this.props.session.account;
    if (bIsAddParticipants) {
      const { aNewMembers } = this.state;
      if (aNewMembers.length > 0)
        this.props.addMembers(
          nGroupId,
          sGroupKey,
          sGroupName,
          sGroupImage,
          aNewMembers,
          sUserKey
        );
    }
    if (bChangeCaptains) {
      const { aParticipants, aLastCaptains } = this.state;
      let aCapitans = [];
      aParticipants.forEach((oParticipant) => {
        if (oParticipant.isCaptain)
          aCapitans.push({
            key: oParticipant.key,
            id: oParticipant.id,
            pushId: oParticipant.pushId,
          });
      });
      let oNotification = {
        sUserName: sUserName,
        sGroupName: sGroupName,
      };
      this.props.updateCapitans(
        sGroupKey,
        nGroupId,
        aCapitans,
        aLastCaptains,
        oNotification
      );
    }
    if (bRemoveMembers) {
      if (this.getCountRemove() > 0) {
        const { aParticipants } = this.state;
        let aMembersToRemove = [];
        aParticipants.forEach((oParticipant) => {
          if (oParticipant.isSelected)
            aMembersToRemove.push({
              key: oParticipant.key,
              id: oParticipant.id,
            });
        });
        this.props.removeMembers(
          nGroupId,
          sGroupKey,
          sUserName,
          sUserKey,
          aMembersToRemove
        );
      }
    }
    if (bRemoveMeCaptains) {
      const { aParticipants } = this.state;
      let aCapitans = [];
      aParticipants.forEach((oParticipant) => {
        if (oParticipant.isCaptain && oParticipant.key !== sUserKey)
          aCapitans.push({ key: oParticipant.key, id: oParticipant.id });
      });
      this.props.updateCapitans(sGroupKey, nGroupId, aCapitans);
    }
    if (bShowConfirmLeaveGroup) {
      if (sUserKey === sMainCaptainKey)
        return this.setState({
          bShowQuestionLeavePrincipalCaptain: true,
          bShowConfirmLeaveGroup: false,
        });
      this.props.leaveGroup(sUserKey, sGroupKey, nGroupId);
    }
    if (bShowAssignCaptain) {
      const { aParticipants } = this.state;
      let aCaptain = aParticipants.filter(
        (oParticipant) => oParticipant.isSelected
      );
      if (aCaptain.length === 0)
        return this.props.message("You must assign a new main captain");
      let oCaptain = aCaptain[0],
        oNotification = {
          nUserId: oCaptain.id,
          sGroupName: sGroupName,
          sPushId: oCaptain.pushId,
        };
      this.props.assignAnotherCaptain(
        sGroupKey,
        nGroupId,
        oCaptain.key,
        sUserKey,
        oNotification
      );
    }
    if (bShowConfirmSendRequest)
      this.props.requestJoinGroup(
        sGroupKey,
        nGroupId,
        sGroupName,
        sUserKey,
        nUserId,
        sImage,
        sUserName,
        sUsername
      );
    if (bShowConfirmJoin)
      this.props.joinGroup(sUserKey, sUserName, nUserId, sGroupKey, nGroupId);
    if (bConfirmationDeleteGroup) {
      if (sMainCaptainKey === sUserKey)
        this.props.deleteGroup(sGroupKey, nGroupId, sUserKey);
      else this.props.message("Not authorized");
    }
    this.handleOnCancel();
  };

  getCountRemove = () => {
    const { aParticipants } = this.state;
    return aParticipants.filter((oParticipant) => oParticipant.isSelected)
      .length;
  };

  getCaptainsList = () => {
    const { aParticipants } = this.state;
    return aParticipants.filter((oParticipant) => oParticipant.isCaptain);
  };

  getMembersList = () => {
    const { aParticipants } = this.state;
    return aParticipants.filter((oParticipant) => !oParticipant.isCaptain);
  };

  updateCaptain = (oCaptain) => {
    const { captain: sMainCaptainKey } = this.props.groupProps.oGroup;
    if (!oCaptain.isCaptain && this.getCaptainsList().length > 2)
      return this.props.message(`Only three captains are allowed per group`);
    if (oCaptain.isCaptain && oCaptain.key === sMainCaptainKey)
      return this.props.message(`You can't remove the principal captain`);
    const { aParticipants } = this.state;
    let oUser = aParticipants.filter(
      (oParticipant) => oParticipant.key === oCaptain.key
    );
    if (oUser.length > 0) oUser[0].isCaptain = !oUser[0].isCaptain;
    this.setState({ aParticipants: aParticipants });
  };

  filterParticipants = (aParticipants) => {
    const { sSearch } = this.state;
    return aParticipants.filter(
      (oParticipant) =>
        oParticipant.name.toLowerCase().includes(sSearch.toLowerCase()) ||
        oParticipant.username.toLowerCase().includes(sSearch.toLowerCase())
    );
  };

  handleChangeSearch = (sText) => {
    this.setState({ sSearch: sText });
  };

  handleFocusSearch = () => {};

  handleCleanSearch = () => {
    this.setState({ sSearch: "" });
  };

  sendNotification = () => {
    let { sTextNotification } = this.state;
    const { account: oAccount } = this.props.session;
    const { oGroup } = this.props.groupProps;
    if ("" === sTextNotification.trim())
      return this.props.message("The text for the notification is required");
    this.props.sendNotification({
      userSend: oAccount.id,
      username: oAccount.name,
      userReceived: oGroup.participants.filter(
        (element) => element.id !== oAccount.id
      ),
      type: 3,
      view: 0,
      idGroupJoin: oGroup.id,
      groupKey: oGroup.key,
      description: sTextNotification.trim(),
      groupName: oGroup.name,
    });
    this.handleOnCancel();
  };

  confirmChangeInformation = () => {
    const { nEditInformationType, sEditInformationValue } = this.state;
    const { oGroup } = this.props.groupProps;
    if (
      (1 === nEditInformationType &&
        sEditInformationValue.trim() !== oGroup.name) ||
      (2 === nEditInformationType &&
        sEditInformationValue.trim() !== oGroup.description)
    ) {
      if (sEditInformationValue.trim() !== "") {
        let nGroupKey = oGroup.key,
          sName =
            1 === nEditInformationType ? sEditInformationValue.trim() : null,
          sDescription =
            2 === nEditInformationType ? sEditInformationValue.trim() : null;
        this.props.changeInformtaion(nGroupKey, sName, sDescription, null);
        this.setState({
          bShowOptions: false,
          bChangeInformation: false,
          bShowEditInformationInput: false,
          nEditInformationType: 0,
          sEditInformationValue: "",
        });
      } else {
        if (1 === nEditInformationType)
          this.props.message("The group name cannot be empty.");
        else this.props.message("The group description cannot be empty.");
        this.setState({
          sEditInformationValue:
            1 === nEditInformationType ? oGroup.name : oGroup.description,
        });
      }
    } else {
      this.setState({
        bShowOptions: false,
        bChangeInformation: false,
        bShowEditInformationInput: false,
        nEditInformationType: 0,
        sEditInformationValue: "",
      });
    }
  };

  updateCaptiansList = (bValue = true) => {
    const { oGroup } = this.props.groupProps;
    let aCaptains = oGroup.participants.filter(
      (oParticipant) => oParticipant.isCaptain
    );
    this.setState({
      bShowOptions: false,
      bChangeCaptains: bValue,
      aLastCaptains: JSON.parse(JSON.stringify(aCaptains)),
      aParticipants: JSON.parse(JSON.stringify(oGroup.participants)),
    });
  };

  updateRemoveMembers = () => {
    const { oGroup } = this.props.groupProps;
    this.setState({
      bShowOptions: false,
      bRemoveMembers: true,
      aParticipants: JSON.parse(JSON.stringify(oGroup.participants)),
    });
  };

  assignCaptain = () => {
    const { oGroup } = this.props.groupProps;
    let aParticipants = JSON.parse(JSON.stringify(oGroup.participants));
    let aOtherParticipants = aParticipants.filter(
      (oParticipant) =>
        oParticipant.key !== oGroup.captain && oParticipant.isCaptain
    );
    if (aOtherParticipants.length === 0)
      aOtherParticipants = aParticipants.filter(
        (oParticipant) => oParticipant.key !== oGroup.captain
      );
    if (aOtherParticipants.length === 0)
      return this.props.message("You are the only member of the group");
    this.setState({
      bShowQuestionLeavePrincipalCaptain: false,
      bShowAssignCaptain: true,
      aParticipants: aOtherParticipants,
    });
  };

  selectMemberToRemove = (oMember) => {
    if (oMember.isCaptain)
      return this.props.message(
        `Not is possible remove at captain of the group`
      );
    const { aParticipants } = this.state;
    let aUser = aParticipants.filter(
      (oParticipant) => oParticipant.key === oMember.key
    );
    if (aUser.length > 0) {
      let oUser = aUser[0];
      oUser.isSelected =
        oUser.isSelected !== undefined ? !oUser.isSelected : true;
    }
    this.setState({ aParticipants: aParticipants });
  };

  selectMemberToCaptain = (oMember) => {
    const { aParticipants } = this.state;
    let aUser = aParticipants.filter(
      (oParticipant) => oParticipant.key === oMember.key
    );
    aParticipants.forEach((oParticipant) => {
      oParticipant.isSelected = false;
    });
    if (aUser.length > 0) {
      let oUser = aUser[0];
      oUser.isSelected =
        oUser.isSelected !== undefined ? !oUser.isSelected : true;
    }
    this.setState({ aParticipants: aParticipants });
  };

  viewProfile = (oUser) => {
    this.props.getProfile(oUser.id);
    this.props.navigation.navigate("ProfileViewDetailsHome");
  };

  selectMemberToAdd = (oMember) => {
    const { oGroup } = this.props.groupProps;
    if (
      oMember.invitationsGroup &&
      oMember.invitationsGroup.includes(oGroup.key)
    )
      return this.props.message(
        `${oMember.name} was already invited to the group`
      );
    if (oGroup.users.includes(oMember.key))
      return this.props.message(
        `${oMember.name} is already a member of the group`
      );
    const { aNewMembers } = this.state;
    if (oMember.isSelected) {
      oMember.isSelected = false;
      let aMembers = aNewMembers.filter(
        (oParticipant) => oParticipant.key !== oMember.key
      );
      this.setState({ aNewMembers: aMembers });
    } else {
      oMember.isSelected = true;
      let aMembers = [...aNewMembers, oMember];
      this.setState({ aNewMembers: aMembers });
    }
  };

  render = () => {
    const { oGroup } = this.props.groupProps;
    return (
      <>
        {oGroup ? (
          <>
            {this.renderGroup()}
            {this.renderQuestions()}
            {this.renderButtonsFooter()}
          </>
        ) : (
          <View></View>
        )}
      </>
    );
  };

  renderGroup = () => {
    const { oGroup } = this.props.groupProps;
    const {
      sPreviewImage,
      bChangeCaptains,
      bRemoveMembers,
      nKeyboardPadding,
      bIsAddParticipants,
      bShowAssignCaptain,
    } = this.state;
    const bIsCaptain = this.getIsCaptain();
    return (
      <View style={{ flex: 1, backgroundColor: WhiteColor }}>
        <ScrollView
          contentContainerStyle={[
            oStyles.container,
            { paddingBottom: nKeyboardPadding },
          ]}
          ref={(oRef) => (this.oScrollRef = oRef)}
        >
          <View style={[oStyles.row, oStyles.mgB10]}>
            <View style={[oStyles.centerAlign, oStyles.headerLeft]}>
              {null !== sPreviewImage ? (
                <Image
                  style={oStyles.groupImage}
                  source={{ uri: "data:image/png;base64," + sPreviewImage }}
                />
              ) : oGroup.image === null ? (
                <Image style={oStyles.groupImage} source={GroupImageDefault} />
              ) : (
                <Pressable onPress={() => this.expandImage(oGroup.image)}>
                  <FastImage
                    style={oStyles.groupImage}
                    source={{
                      uri: oGroup.image,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </Pressable>
              )}
              {bIsCaptain && (
                <Pressable
                  onPress={() => this.setState({ bShowGroupPhoto: true })}
                  style={oStyles.border}
                >
                  <Text
                    style={[
                      oStyles.textRed,
                      oStyles.textBold,
                      oStyles.textCenter,
                    ]}
                  >
                    Change Group Photo
                  </Text>
                </Pressable>
              )}
              <Text
                style={[
                  oStyles.textGreen,
                  oStyles.textBold,
                  oStyles.textCenter,
                  oStyles.mgT5,
                ]}
              >
                {oGroup.type === GROUP_PRIVATE
                  ? "Private Group"
                  : "Public Group"}
              </Text>
            </View>
            <View style={oStyles.headerRight}>
              <Text
                style={[oStyles.textBold, oStyles.textGreen, oStyles.font18]}
              >
                {oGroup.name}
              </Text>
              <Text style={[oStyles.textGray, oStyles.textBold, oStyles.mgT5]}>
                Description
              </Text>
              <Text style={oStyles.textJustify}>{oGroup.description}</Text>
            </View>
          </View>
          {this.renderButtons(oGroup)}
          {!bChangeCaptains &&
          !bRemoveMembers &&
          !bIsAddParticipants &&
          !bShowAssignCaptain
            ? this.renderParticipants(oGroup)
            : bChangeCaptains
            ? this.renderChangeCaptains()
            : bRemoveMembers
            ? this.renderRemoveMembers()
            : bShowAssignCaptain
            ? this.renderAssignCaptain()
            : this.renderAddMembers()}
        </ScrollView>
      </View>
    );
  };

  renderButtons = (oGroup) => {
    const bIsCaptain = this.getIsCaptain();
    const bIsParticipant = this.getIsParticipant();
    const {
      bIsAddParticipants,
      bChangeCaptains,
      bRemoveMembers,
      bShowAssignCaptain,
    } = this.state;
    return (
      <View>
        {bIsCaptain &&
          !bIsAddParticipants &&
          !bChangeCaptains &&
          !bRemoveMembers &&
          !bShowAssignCaptain && (
            <View style={oStyles.row}>
              <Pressable
                onPress={() => this.setState({ bShowSendNotification: true })}
                style={[oStyles.middleFlex, oStyles.mgR5]}
              >
                <View style={GlobalStyles.buttonCancel}>
                  <Text style={GlobalStyles.textButton}>Notification</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => this.openOptions()}
                style={[oStyles.middleFlex, oStyles.mgL5]}
              >
                <View style={GlobalStyles.buttonConfirm}>
                  <Text style={GlobalStyles.textButton}>Options</Text>
                </View>
              </Pressable>
            </View>
          )}
        {(bIsCaptain || (bIsParticipant && oGroup.type === GROUP_PUBLIC)) && (
          <>
            {!bIsAddParticipants &&
            !bChangeCaptains &&
            !bRemoveMembers &&
            !bShowAssignCaptain ? (
              <Pressable
                onPress={() => this.setState({ bIsAddParticipants: true })}
              >
                <View style={GlobalStyles.buttonConfirm}>
                  <Text style={GlobalStyles.textButton}>Add Member</Text>
                </View>
              </Pressable>
            ) : (
              <View style={[oStyles.row]}>
                <Pressable
                  onPress={this.handleOnCancel}
                  style={[oStyles.middleFlex, oStyles.mgR5]}
                >
                  <View style={GlobalStyles.buttonCancel}>
                    <Text style={GlobalStyles.textButton}>Cancel</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={this.handleOnConfirm}
                  style={[oStyles.middleFlex, oStyles.mgL5]}
                >
                  <View style={GlobalStyles.buttonConfirm}>
                    <Text style={GlobalStyles.textButton}>
                      Confirm{bRemoveMembers && ` (${this.getCountRemove()})`}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  renderParticipants = (oGroup) => {
    const { participants } = oGroup;
    const { key: sActualParticipantKey } = this.props.session.account;
    return (
      <>
        <View style={[oStyles.row, oStyles.mgT5, oStyles.centerAlign]}>
          <Icon name="ios-people" size={40} color={PlaceholderColor} />
          <Text
            style={[
              oStyles.textGreen,
              oStyles.font18,
              oStyles.participantsLabel,
            ]}
          >
            PARTICIPANTS: {participants.length}
          </Text>
        </View>
        <FlatList
          data={participants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: oParticipant }) => {
            return this.renderItem(oParticipant, this.viewProfile);
          }}
        />
      </>
    );
  };

  renderChangeCaptains = () => {
    const { oGroup } = this.props.groupProps;
    const aCaptains = this.getCaptainsList();
    const aParticipants = this.getMembersList();
    const { key: sActualParticipantKey } = this.props.session.account;
    const { sSearch } = this.state;
    return (
      <>
        <SearchUsername
          ph={"Search people on group"}
          value={sSearch}
          onFocus={this.handleFocusSearch}
          change={(text) => this.handleChangeSearch(text)}
          clean={this.handleCleanSearch}
        />
        <View style={oStyles.borderBottom}>
          <Text
            style={[
              oStyles.centerJustify,
              oStyles.textCenter,
              oStyles.textBold,
              oStyles.font14,
              oStyles.textGreen,
              oStyles.p10,
            ]}
          >
            List of Captains
          </Text>
        </View>
        <View
          style={[
            oStyles.row,
            oStyles.flexWrap,
            oStyles.m5,
            oStyles.centerAlign,
            { marginLeft: "auto", marginRight: "auto" },
          ]}
        >
          {aCaptains.map((oParticipant) => (
            <Pressable
              activeOpacity={1}
              key={oParticipant.key}
              onPress={() => {
                this.updateCaptain(oParticipant);
              }}
            >
              <View
                style={[oStyles.m5, oStyles.centerAlign, oStyles.textCenter]}
              >
                <View>
                  {oParticipant.image === null ? (
                    <Image
                      style={GlobalStyles.photoProfileCardList}
                      source={UserImageDefault}
                    />
                  ) : (
                    <FastImage
                      style={GlobalStyles.photoProfileCardList}
                      source={{
                        uri: oParticipant.image,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                  <View style={oStyles.captainIcon}>
                    <Icon
                      name={
                        oParticipant.key === oGroup.captain
                          ? "md-star"
                          : "md-checkmark-circle"
                      }
                      size={24}
                      color={SignUpColor}
                    />
                  </View>
                </View>
                <View>
                  <Text>{oParticipant.username}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        {aParticipants.length > 0 ? (
          <View style={oStyles.borderBottom}>
            <Text
              style={[
                oStyles.centerJustify,
                oStyles.textCenter,
                oStyles.textBold,
                oStyles.font14,
                oStyles.textGreen,
                oStyles.p10,
              ]}
            >
              List of memebers
            </Text>
          </View>
        ) : (
          <View style={oStyles.borderBottom}>
            <Text
              style={[
                oStyles.centerJustify,
                oStyles.textCenter,
                oStyles.textBold,
                oStyles.font14,
                oStyles.textGreen,
                oStyles.p10,
              ]}
            >
              The all members are captains
            </Text>
          </View>
        )}
        <FlatList
          data={this.filterParticipants(aParticipants)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: oParticipant }) => {
            return this.renderItem(oParticipant, this.updateCaptain);
          }}
        />
      </>
    );
  };

  renderRemoveMembers = () => {
    const { aParticipants } = this.state;
    return (
      <>
        <FlatList
          data={aParticipants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: oParticipant }) => {
            return this.renderItem(oParticipant, this.selectMemberToRemove);
          }}
        />
      </>
    );
  };

  renderAssignCaptain = () => {
    const { aParticipants } = this.state;
    return (
      <>
        <FlatList
          data={aParticipants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: oParticipant }) => {
            return this.renderItem(oParticipant, this.selectMemberToCaptain);
          }}
        />
      </>
    );
  };

  renderAddMembers = () => {
    const { aNewMembers, sSearch } = this.state;
    const { myFriends: aPalsList } = this.props.palsProps;
    const { peopleFitrec: aPeopleFitrec } = this.props.peopleReducer;
    return (
      <>
        <SearchUsername
          ph={"Search for people or username"}
          value={sSearch}
          onFocus={this.handleFocusSearch}
          change={(text) => {
            this.handleChangeSearch(text);
            this.props.getPeople(text);
          }}
          clean={this.handleCleanSearch}
        />
        {sSearch === "" && aNewMembers.length > 0 && (
          <>
            <View style={oStyles.borderBottom}>
              <Text
                style={[
                  oStyles.centerJustify,
                  oStyles.textCenter,
                  oStyles.textBold,
                  oStyles.font14,
                  oStyles.textGreen,
                  oStyles.p10,
                ]}
              >
                List of invitations
              </Text>
            </View>
            <FlatList
              data={aNewMembers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: oParticipant }) => {
                return this.renderItem(oParticipant, this.selectMemberToAdd);
              }}
            />
          </>
        )}
        {sSearch === "" && aPalsList.length > 0 && (
          <>
            <View style={oStyles.borderBottom}>
              <Text
                style={[
                  oStyles.centerJustify,
                  oStyles.textCenter,
                  oStyles.textBold,
                  oStyles.font14,
                  oStyles.textGreen,
                  oStyles.p10,
                ]}
              >
                List of pals
              </Text>
            </View>
            <FlatList
              data={aPalsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: oParticipant }) => {
                return (
                  !aNewMembers.filter(
                    (oMember) => oMember.key === oParticipant.key
                  ).length > 0 &&
                  this.renderItem(oParticipant, this.selectMemberToAdd, true)
                );
              }}
            />
          </>
        )}
        {sSearch !== "" && aPeopleFitrec.length > 0 ? (
          <>
            <View style={oStyles.borderBottom}>
              <Text
                style={[
                  oStyles.centerJustify,
                  oStyles.textCenter,
                  oStyles.textBold,
                  oStyles.font14,
                  oStyles.textGreen,
                  oStyles.p10,
                ]}
              >
                List of people
              </Text>
            </View>
            <FlatList
              data={aPeopleFitrec}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: oParticipant }) => {
                return this.renderItem(
                  oParticipant,
                  this.selectMemberToAdd,
                  true
                );
              }}
            />
          </>
        ) : (
          sSearch !== "" && (
            <View style={oStyles.borderBottom}>
              <Text
                style={[
                  oStyles.centerJustify,
                  oStyles.textCenter,
                  oStyles.textBold,
                  oStyles.font14,
                  oStyles.textGreen,
                  oStyles.p10,
                ]}
              >
                No results for that search
              </Text>
            </View>
          )
        )}
      </>
    );
  };

  renderItem = (oParticipant, fAction, bIsListPeople = false) => {
    const { key: sActualParticipantKey } = this.props.session.account;
    const { oGroup } = this.props.groupProps;
    return (
      <View style={oStyles.row}>
        <Pressable
          activeOpacity={1}
          onPress={() => fAction(oParticipant)}
          style={[oStyles.row, oStyles.middleFlex]}
        >
          <View style={[oStyles.row, oStyles.flex10]}>
            <View style={oStyles.imageUserContainer}>
              {null !== oParticipant.image ? (
                <FastImage
                  style={GlobalStyles.photoProfileCardList}
                  source={{
                    uri: oParticipant.image,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  style={GlobalStyles.photoProfileCardList}
                  source={UserImageDefault}
                />
              )}
            </View>
            <View style={[oStyles.centerJustify, oStyles.mgL5]}>
              <Text style={[oStyles.textGreen, oStyles.font18, oStyles.mgB10]}>
                {sActualParticipantKey === oParticipant.key
                  ? "You"
                  : oParticipant.name}
              </Text>
              <Text>
                @
                {sActualParticipantKey === oParticipant.key
                  ? "You"
                  : oParticipant.username}
              </Text>
            </View>
          </View>
          {oParticipant.isCaptain && !oParticipant.isSelected && (
            <View style={[oStyles.row, oStyles.flex2]}>
              <View style={oStyles.centerJustify}>
                <View style={[oStyles.row, oStyles.centerAlign]}>
                  <Icon
                    name={
                      oParticipant.key === oGroup.captain
                        ? "md-star"
                        : "ios-help-buoy"
                    }
                    size={18}
                    color={SignUpColor}
                  />
                  <Text style={oStyles.textGreen}>Captain</Text>
                </View>
              </View>
            </View>
          )}
          {oParticipant.isSelected && (
            <View style={oStyles.checkIcon}>
              <View style={oStyles.centerJustify}>
                <Icon
                  name="md-checkmark-circle"
                  size={22}
                  color={SignUpColor}
                />
              </View>
            </View>
          )}
          {oParticipant.invitationsGroup &&
            oParticipant.invitationsGroup.includes(oGroup.key) && (
              <View style={oStyles.checkIcon}>
                <View style={oStyles.centerJustify}>
                  <View style={[oStyles.row, oStyles.centerAlign]}>
                    <Icon
                      name="md-checkmark-circle"
                      size={22}
                      color={SignUpColor}
                    />
                    <Text style={oStyles.textGreen}>Invited</Text>
                  </View>
                </View>
              </View>
            )}
          {bIsListPeople && oGroup.users.includes(oParticipant.key) && (
            <View style={oStyles.checkIcon}>
              <View style={oStyles.centerJustify}>
                <View style={[oStyles.row, oStyles.centerAlign]}>
                  <Icon
                    name="md-checkmark-circle"
                    size={22}
                    color={SignUpColor}
                  />
                  <Text style={oStyles.textGreen}>Member</Text>
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  renderQuestions = () => {
    const { oGroup } = this.props.groupProps;
    const bIsCaptain = this.getIsCaptain();
    const { account: oAccount } = this.props.session;
    const {
      bShowGroupPhoto,
      bShowOptions,
      bShowSendNotification,
      sTextNotification,
      nKeyboardPadding,
      bChangeInformation,
      bShowEditInformationInput,
      sEditInformationValue,
      bRemoveMeCaptains,
      bShowConfirmLeaveGroup,
      bShowConfirmSendRequest,
      bShowConfirmJoin,
      bShowQuestionLeavePrincipalCaptain,
      bConfirmationDeleteGroup,
    } = this.state;
    return (
      <>
        <ToastQuestion
          visible={bShowGroupPhoto}
          close={() => this.setState({ bShowGroupPhoto: false })}
          functionCamera={() => this.addImageGroup("camera")}
          functionGallery={() => this.addImageGroup("gallery")}
        />
        {/* // Modal where the text of a new group notification is filled */}
        <ToastQuestionGeneric
          visible={bShowSendNotification}
          options={
            <View style={ToastQuestionGenericStyles.containerInput}>
              <TextInput
                numberOfLines={4}
                multiline={true}
                style={ToastQuestionGenericStyles.inputLarge}
                value={sTextNotification}
                onChangeText={(text) =>
                  this.setState({ sTextNotification: text })
                }
              />
              <View style={oStyles.row}>
                <View style={oStyles.middleFlex}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() =>
                      this.setState({ bShowSendNotification: false })
                    }
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={oStyles.middleFlex}>
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
          }
          close={() => this.setState({ bShowSendNotification: false })}
          maxWidth={300}
          titleBig={"New notification"}
          padding={nKeyboardPadding}
        />
        {/* // Modal where the options can be handled by a captain */}
        <ToastQuestionGeneric
          visible={bShowOptions}
          options={
            <View style={oStyles.p10}>
              <Pressable
                onPress={() =>
                  this.setState({
                    bChangeInformation: true,
                    bShowOptions: false,
                  })
                }
              >
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Icon name="ios-create" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Edit information
                  </Text>
                </View>
              </Pressable>
              {bIsCaptain && oGroup.captain === oAccount.key ? (
                <Pressable onPress={() => this.updateCaptiansList()}>
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
                      bRemoveMeCaptains: true,
                      bShowOptions: false,
                    });
                    this.updateCaptiansList(false);
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
              <Pressable onPress={() => this.updateRemoveMembers()}>
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Remove Member
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => this.setState({ bShowOptions: false })}>
                <View
                  style={[
                    ToastQuestionGenericStyles.viewButtonOption,
                    { marginBottom: 0 },
                  ]}
                >
                  <Icon name="md-close" size={22} color={WhiteColor} />
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Close
                  </Text>
                </View>
              </Pressable>
            </View>
          }
          maxWidth={300}
          titleBig={"Options"}
          padding={nKeyboardPadding}
        />
        {/* // Modal with options to modify the group's information */}
        <ToastQuestionGeneric
          visible={bChangeInformation}
          options={
            <View style={oStyles.p10}>
              <Pressable
                onPress={() =>
                  this.setState({
                    nEditInformationType: EDIT_INFORMATION_TYPE_NAME,
                    bChangeInformation: false,
                    bShowEditInformationInput: true,
                    sEditInformationValue: oGroup.name,
                  })
                }
              >
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Title
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() =>
                  this.setState({
                    nEditInformationType: EDIT_INFORMATION_TYPE_DESCRIPTION,
                    bChangeInformation: false,
                    bShowEditInformationInput: true,
                    sEditInformationValue: oGroup.description,
                  })
                }
              >
                <View style={ToastQuestionGenericStyles.viewButtonOption}>
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Descripcion
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() =>
                  this.setState({
                    bChangeInformation: false,
                    bShowOptions: true,
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
                  <Text style={ToastQuestionGenericStyles.viewButtonOptionText}>
                    Back
                  </Text>
                </View>
              </Pressable>
            </View>
          }
          maxWidth={300}
          titleBig={"Edit information"}
          padding={nKeyboardPadding}
        />
        {/* // Modal to change information, it can be description or name group */}
        <ToastQuestionGeneric
          visible={bShowEditInformationInput}
          options={
            <View style={ToastQuestionGenericStyles.containerInput}>
              <TextInput
                numberOfLines={4}
                multiline={true}
                style={[
                  ToastQuestionGenericStyles.inputLarge,
                  { maxWidth: "100%" },
                ]}
                value={sEditInformationValue}
                onChangeText={(text) =>
                  this.setState({ sEditInformationValue: text })
                }
              />
              <View style={oStyles.row}>
                <View style={oStyles.middleFlex}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() =>
                      this.setState({
                        sEditInformationValue: "",
                        bShowEditInformationInput: false,
                        bChangeInformation: true,
                      })
                    }
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={oStyles.middleFlex}>
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
          }
          maxWidth={300}
          padding={nKeyboardPadding}
        />
        {/* // Modal to confirm the elimination of the group's captains */}
        {/* // Modal to confirm whether the user wants to leave the group or not */}
        <ToastQuestionGeneric
          visible={
            bShowConfirmLeaveGroup ||
            bRemoveMeCaptains ||
            bShowConfirmSendRequest ||
            bShowConfirmJoin ||
            bConfirmationDeleteGroup
          }
          options={
            <View style={oStyles.pxt10}>
              <Text style={ToastQuestionGenericStyles.textToast}>
                {this.getLabelQuestion()}
              </Text>
              <View style={oStyles.row}>
                <View style={oStyles.middleFlex}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() => this.setState(oInitialState)}
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <View style={oStyles.middleFlex}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => this.handleOnConfirm()}
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Confirm
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          }
          titleBig={this.getTitleQuestion()}
          maxWidth={300}
          padding={nKeyboardPadding}
        />
        {/* // Modal of question when the main captain of the group left */}
        <ToastQuestionGeneric
          visible={bShowQuestionLeavePrincipalCaptain}
          options={
            <View>
              <Text style={ToastQuestionGenericStyles.textToast}>
                {this.getLabelQuestion()}
              </Text>
              <View style={oStyles.row}>
                <View style={oStyles.middleFlex}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonCancel}
                    onPress={() =>
                      this.setState({
                        bConfirmationDeleteGroup: true,
                        bShowQuestionLeavePrincipalCaptain: false,
                      })
                    }
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
                <View style={oStyles.middleFlex}>
                  <Pressable
                    style={ToastQuestionGenericStyles.buttonConfirm}
                    onPress={() => this.assignCaptain()}
                  >
                    <Text style={ToastQuestionGenericStyles.buttonText}>
                      Assign
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          }
          bClose={true}
          close={() =>
            this.setState({ bShowQuestionLeavePrincipalCaptain: false })
          }
          titleBig={this.getTitleQuestion()}
          maxWidth={300}
          padding={nKeyboardPadding}
        />
      </>
    );
  };

  getLabelQuestion = () => {
    const {
      bShowConfirmLeaveGroup,
      bRemoveMeCaptains,
      bShowConfirmSendRequest,
      bShowConfirmJoin,
      bShowQuestionLeavePrincipalCaptain,
      bConfirmationDeleteGroup,
    } = this.state;
    const { name: sGroupName } = this.props.groupProps.oGroup;
    let sLabel = "";
    if (bShowConfirmLeaveGroup) sLabel = "Sure you want to leave the group?";
    if (bRemoveMeCaptains)
      sLabel = "Are you sure you want to leave the captain role?";
    if (bShowConfirmSendRequest)
      sLabel =
        "Do you want to confirm that an entry request is sent to the group?";
    if (bShowConfirmJoin)
      sLabel = "Do you want to confirm that you will join this group?";
    if (bShowQuestionLeavePrincipalCaptain)
      sLabel =
        "You are the main captain of the group, what do you want to do when you leave the group? Assign a new main captain or delete the group?";
    if (bConfirmationDeleteGroup)
      sLabel = `Are you sure you want to delete "${sGroupName}"?`;
    return sLabel;
  };

  getTitleQuestion = () => {
    const {
      bShowConfirmLeaveGroup,
      bRemoveMeCaptains,
      bShowConfirmSendRequest,
      bShowConfirmJoin,
      bShowQuestionLeavePrincipalCaptain,
      bConfirmationDeleteGroup,
    } = this.state;
    let sTitle = "";
    if (bShowConfirmLeaveGroup || bShowQuestionLeavePrincipalCaptain)
      sTitle = "Leave the Group";
    if (bRemoveMeCaptains) sTitle = null;
    if (bShowConfirmSendRequest) sTitle = "Send request";
    if (bShowConfirmJoin) sTitle = "Join Grupo";
    if (bConfirmationDeleteGroup) sTitle = "Delete Group";
    return sTitle;
  };

  renderButtonsFooter = () => {
    const { type: nGroupType } = this.props.groupProps.oGroup;
    const bIsParticipant = this.getIsParticipant();
    const {
      bChangeCaptains,
      bRemoveMembers,
      bIsAddParticipants,
      bShowAssignCaptain,
    } = this.state;
    return (
      <>
        {bIsParticipant ? (
          !bChangeCaptains &&
          !bRemoveMembers &&
          !bIsAddParticipants &&
          !bShowAssignCaptain ? (
            <Pressable
              onPress={() => this.setState({ bShowConfirmLeaveGroup: true })}
            >
              <View
                style={[
                  oStyles.p10,
                  { backgroundColor: SignUpColor, alignItems: "center" },
                ]}
              >
                <Text style={GlobalStyles.textButton}>Leave the group</Text>
              </View>
            </Pressable>
          ) : null
        ) : nGroupType === GROUP_PRIVATE ? (
          !this.getIsRequestUser() ? (
            <Pressable
              onPress={() => this.setState({ bShowConfirmSendRequest: true })}
            >
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
            <View
              style={{
                backgroundColor: GreenFitrecColor,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text style={GlobalStyles.textButton}>
                Your request has already been sent!
              </Text>
            </View>
          )
        ) : (
          <Pressable onPress={() => this.setState({ bShowConfirmJoin: true })}>
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
      </>
    );
  };
}

const oStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: WhiteColor,
  },
  flex10: {
    flex: 10,
  },
  flex2: {
    flex: 3,
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  middleFlex: {
    flex: 6,
  },
  row: {
    flexDirection: "row",
  },
  headerLeft: {
    flex: 4,
  },
  headerRight: {
    flex: 6,
    margin: "3%",
  },
  centerAlign: {
    alignItems: "center",
    alignSelf: "center",
  },
  centerJustify: {
    justifyContent: "center",
  },
  border: {
    borderColor: SignUpColor,
    borderRadius: 10,
    borderWidth: 0.5,
    padding: 5,
  },
  textRed: {
    color: SignUpColor,
  },
  textBold: {
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
  },
  textGreen: {
    color: GreenFitrecColor,
  },
  textGray: {
    color: PlaceholderColor,
  },
  font18: {
    fontSize: 18,
  },
  font14: {
    fontSize: 14,
  },
  mgT5: {
    marginTop: 5,
  },
  mgB10: {
    marginBottom: 10,
  },
  mg10: {
    margin: 10,
  },
  mgL5: {
    marginLeft: 5,
  },
  participantsLabel: {
    marginLeft: "5%",
  },
  mgR5: {
    marginRight: 5,
  },
  m5: {
    margin: 5,
  },
  p10: {
    padding: 10,
  },
  pxt10: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  textJustify: {
    textAlign: "justify",
  },
  groupImage: {
    borderRadius: 100,
    margin: 10,
    height: 150,
    width: 150,
    borderColor: GreenFitrecColor,
    borderWidth: 0.8,
  },
  imageUserContainer: {
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  borderBottom: {
    borderBottomColor: GreenFitrecColor,
    borderBottomWidth: 2,
  },
  captainIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  checkIcon: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  w50: {
    width: "50%",
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  groupProps: state.reducerDetailsGroup,
  palsProps: state.reducerMyPals,
  peopleReducer: state.reducerRequests,
});

const mapDispatchToProps = (dispatch) => ({
  message: (sMessage) => {
    dispatch(actionMessage(sMessage));
  },
  clean: () => {
    dispatch(actionCleanNavigation());
  },
  cleanGroup: () => {
    dispatch(actionGetGroup());
  },
  expandImage: (sImage) => {
    dispatch(actionExpandImage(sImage));
  },
  changeInformtaion: (nGroupKey, sName, sDescription, sImage) => {
    dispatch(actionUpdateGroup(nGroupKey, sName, sDescription, sImage));
  },
  sendNotification: (data) => {
    dispatch(actionSendNotificationCapitan(data));
  },
  getProfile: (data) => {
    dispatch(actionGetProfile(data, true));
  },
  updateCapitans: (
    sGroupKey,
    nGroupId,
    aCapitans,
    aLastCaptains = null,
    oNotification = null
  ) => {
    dispatch(
      actionUpdateCapitans(
        sGroupKey,
        nGroupId,
        aCapitans,
        aLastCaptains,
        oNotification
      )
    );
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
  getPeople: (sFilter) => {
    dispatch(actionGetPeopleGroup(sFilter));
  },
  addMembers: (
    nGroupId,
    sGroupKey,
    sGroupName,
    sGroupImage,
    aMembers,
    sUserKey
  ) => {
    dispatch(
      actionAddMember(
        nGroupId,
        sGroupKey,
        sGroupName,
        sGroupImage,
        aMembers,
        sUserKey
      )
    );
  },
  getMyFriends: (sUserKey) => {
    dispatch(actionGetMyFriends(sUserKey));
  },
  getMessagesGroup: (sConversationKey, sGroupKey, sUserKey) => {
    dispatch(actionGetMessages(sConversationKey, sGroupKey, sUserKey));
  },
  leaveGroup: (sUserKey, sGroupKey, nGroupId) => {
    dispatch(actionLeaveGroup(sUserKey, sGroupKey, nGroupId));
  },
  requestJoinGroup: (
    sGroupKey,
    nGroupId,
    sGroupName,
    sUserKey,
    nUserId,
    sUserImage,
    sUserName,
    sUserUsername
  ) => {
    dispatch(
      actionRequestJoinGroup(
        sGroupKey,
        nGroupId,
        sGroupName,
        sUserKey,
        nUserId,
        sUserImage,
        sUserName,
        sUserUsername
      )
    );
  },
  joinGroup: (sUserKey, sUserName, nUserId, sGroupKey, nGroupId) => {
    dispatch(
      actionJoinGroup(sUserKey, sUserName, nUserId, sGroupKey, nGroupId)
    );
  },
  assignAnotherCaptain: (
    sGroupKey,
    nGroupId,
    sNewCaptainKey,
    sUserKey,
    oNotification
  ) => {
    dispatch(
      actionAssignAnotherCaptainToLeave(
        sGroupKey,
        nGroupId,
        sNewCaptainKey,
        sUserKey,
        oNotification
      )
    );
  },
  deleteGroup: (sGroupKey, nGroupId, sUserKey) => {
    dispatch(actionDeleteGroup(sGroupKey, nGroupId, sUserKey));
  },
  readMessageActualGroup: () => {
    dispatch(actionReadMessageActualGroup());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowDetailsGroup);
