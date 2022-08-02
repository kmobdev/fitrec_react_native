import React, { Component } from "react";
import NavigationGuest from "./Guest";
import NavigationLogged from "./Logged";
import { connect } from "react-redux";
import { text } from "react-native";
import {
  actionUserIsLogged,
  actionSetIdOneSignalCode,
  actionLoadNotificationsFirebase,
  actionSetGeoLocation,
  actionGetNotifications,
  actionUpdateChanges,
  actionClearNotificationsFirebase,
} from "../redux/actions/UserActions";
import { actionCountMessageRead } from "../redux/actions/ChatActions";
import OneSignal from "react-native-onesignal";
import { actionGetRequests } from "../redux/actions/MyPalsActions";
import { actionGetMyFriends } from "../redux/actions/ProfileActions";
import Geolocation from "@react-native-community/geolocation";
import { Toast } from "../components/shared/Toast";
import {
  actionMessage,
  actionCloseImage,
} from "../redux/actions/SharedActions";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ExpandImage } from "../components/shared/ExpandImage";
import ExpandStory from "../components/stories/ExpandStory";
import { PreviewStory } from "../components/stories/PreviewStory";
import { actionUploadStory } from "../redux/actions/StoryActions";
import { OPTIONS_GEOLOCATION_GET_POSITION } from "../Constants";

class SelectRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      expandImage: false,
      image: null,
      confirmationDeletestory: false,
    };
    // NativeModules.DevMenu.show();
    // OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addSubscriptionObserver((event) => {
      this.onIds(event.to);
    });
  }

  onIds = (device) => {
    this.props.setIdOneSignalCode({
      oneSignalCode: device.userId,
    });
  };

  componentDidMount = async () => {
    // this.onIds(deviceState)
    this.setState({
      loading: true,
      callUpdateFunction: false,
    });
    this.props.userIsLogged();
    this.checkNewMessages();
    setInterval(() => {
      if (null !== this.props.session.account) {
        this.checkNewNotifications();
        if (
          null !== this.props.session.account &&
          !this.state.callUpdateFunction
        ) {
          this.setState({
            callUpdateFunction: true,
          });
          this.props.loadDataNotifications({
            accountId: this.props.session.account.key,
          });
          this.props.updateChanges({
            accountId: this.props.session.account.key,
          });
        }
      } else {
        if (this.state.callUpdateFunction) {
          this.props.clearNotifications();
        }
        this.setState({
          callUpdateFunction: false,
        });
      }
    }, 10000);
    setInterval(() => {
      this.checkLocation();
    }, 20000);
  };

  checkNewMessages = () => {
    if (null !== this.props.session.account) {
      this.props.checkNewMessages({
        accountId: this.props.session.account.key,
      });
    }
  };

  checkRequestAndFriends = () => {
    if (null !== this.props.session.account) {
      this.props.getMyFriends(this.props.session.account.key);
      this.props.getRequests(this.props.session.account.key);
    }
  };

  checkLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (
          null !== this.props.session.account &&
          position &&
          undefined !== position.coords
        )
          this.props.setGeoLocation(
            position.coords.longitude,
            position.coords.latitude
          );
      },
      (error) => {},
      OPTIONS_GEOLOCATION_GET_POSITION
    );
  };

  checkNewNotifications = () => {
    if (null !== this.props.session.account) {
      this.props.checkNewNotifications();
    }
  };

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.oShared.message && "" !== nextProps.oShared.message.trim()) {
      setTimeout(() => {
        this.props.clearMessage();
      }, 2000);
    }
    await this.setState({
      loading: false,
    });
  };

  closeImage = () => {
    this.props.closeImage();
  };

  uploadStory = () => {
    if (!this.props.oShared.loading) {
      this.props.uploadStory(
        this.props.oStory.type,
        this.props.oStory.imagePreview,
        this.props.oStory.videoName
      );
    }
  };

  render() {
    return (
      <>
        {!this.state.loading ? (
          undefined !== this.props.session.account &&
          null !== this.props.session.account ? (
            <NavigationLogged />
          ) : (
            <NavigationGuest />
          )
        ) : null}
        <Toast toastText={this.props.oShared.message} />
        <LoadingSpinner
          visible={
            this.props.oShared.loading && this.props.oShared.message === ""
          }
        />
        <ExpandImage
          show={this.props.oShared.expandImage}
          image={this.props.oShared.image}
          close={() => this.closeImage()}
        />
        <ExpandStory />
        <PreviewStory
          show={this.props.oStory.imagePreview !== null}
          image={this.props.oStory.imagePreview}
          type={this.props.oStory.type}
          close={() => this.closeImage()}
          upload={() => this.uploadStory()}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  oShared: state.reducerShared,
  oStory: state.reducerStory,
});

const mapDispatchToProps = (dispatch) => ({
  userIsLogged: () => {
    dispatch(actionUserIsLogged());
  },

  checkNewMessages: (data) => {
    dispatch(actionCountMessageRead(data));
  },
  setIdOneSignalCode: (data) => {
    dispatch(actionSetIdOneSignalCode(data));
  },
  getMyFriends: (sUserKey) => {
    dispatch(actionGetMyFriends(sUserKey));
  },
  getRequests: (sUserKey) => {
    dispatch(actionGetRequests(sUserKey));
  },
  setGeoLocation: (nLongitude, nLatitude) => {
    dispatch(actionSetGeoLocation(nLongitude, nLatitude));
  },
  checkNewNotifications: () => {
    dispatch(actionGetNotifications());
  },
  updateChanges: (data) => {
    dispatch(actionUpdateChanges(data));
  },
  loadDataNotifications: (data) => {
    dispatch(actionLoadNotificationsFirebase(data));
  },
  clearNotifications: () => {
    dispatch(actionClearNotificationsFirebase());
  },
  clearMessage: () => {
    dispatch(actionMessage(""));
  },
  closeImage: () => {
    dispatch(actionCloseImage());
  },
  uploadStory: (nType, sImage, sVideoName) => {
    dispatch(actionUploadStory(nType, sImage, sVideoName));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRoutes);
