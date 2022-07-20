import React, { Component } from "react";
import { View, StyleSheet, Image, Text, Keyboard, Pressable } from "react-native";
import { ScrollView } from "react-native";
import { GlobalStyles, WhiteColor, PlaceholderColor } from "../../Styles";
import { UpdateCoverPhoto } from "../../components/shared/UpdateCoverPhoto";
import Icon from "react-native-vector-icons/MaterialIcons";
import { InputText } from "../../components/register/InputText";
import { InputTextArea } from "../../components/register/InputTextArea";
import ShowActivities from "../../components/register/ShowActivities";
import { CheckBox } from "../../components/register/CheckBox";
import SelectCombo from "../../components/register/SelectCombo";
import { lHeightSizes } from "../../Constants";
import DatePickerSelect from "../../components/register/DatePickerSelect";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { validateFieldsProfile } from "../../components/shared/SharedFunctions";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import { connect } from "react-redux";
import {
  actionGetAllActivities,
  actionGetGyms,
} from "../../redux/actions/ActivityActions";
import SelectActivities from "../../components/register/SelectActivities";
import {
  actionUpdateProfile,
  actionUpdateProfileResetState,
} from "../../redux/actions/ProfileActions";
import { Toast } from "../../components/shared/Toast";
import FastImage from "react-native-fast-image";
import ImagePicker from "react-native-image-crop-picker";

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        ...this.props.navigation.getParam("user", null),
        activitiesSelect: null,
      },
      errors: {
        showUsernameError: false,
        showEmailError: false,
        showPasswordError: false,
        showConfirmPasswordError: false,
        showNameError: false,
        showAgeError: false,
        showSexError: false,
        showLevelError: false,
        showWeightError: false,
        showActivitiesError: false,
      },
      showProfilePhoto: false,
      showCoverPhoto: false,
      showActivitySelector: false,
      loading: true,
      toastText: "",
      newImage: null,
      newImageBackground: null,
      gyms: [],
      gymsName: [],
      newGym: false,
      newGymName: "",
      keyboardOffset: 0,
    };

    this.getKeyboardOffsetStyle = this.getKeyboardOffsetStyle.bind(this);
    this.handleKeyboardShow = this.handleKeyboardShow.bind(this);
    this.handleKeyboardHide = this.handleKeyboardHide.bind(this);

    this.oKeyboardListenerWillShow = Keyboard.addListener(
      "keyboardWillShow",
      this.handleKeyboardShow
    );
    this.oKeyboardListenerWillHide = Keyboard.addListener(
      "keyboardWillHide",
      this.handleKeyboardHide
    );
  }

  handleKeyboardShow = async ({ endCoordinates: { height } }) => {
    await this.setState({ keyboardOffset: height });
  };

  handleKeyboardHide = async () => {
    await this.setState({ keyboardOffset: 0 });
  };

  scrollToEnd = (sval = null) => {
    if (null !== this.scrollView && undefined !== this.scrollView)
      this.scrollView.scrollToEnd({ animated: true });
  };

  getKeyboardOffsetStyle() {
    const { keyboardOffset } = this.state;
    return Platform.select({
      ios: () => ({ paddingBottom: keyboardOffset }),
      android: () => ({}),
    })();
  }

  componentWillUnmount = () => {
    this.oKeyboardListenerWillShow && this.oKeyboardListenerWillShow.remove();
    this.oKeyboardListenerWillHide && this.oKeyboardListenerWillHide.remove();
  };

  componentDidMount = async () => {
    this.props.navigation.setParams({ saveProfile: this.saveProfile });
    await this.setState({
      newImage: null,
    });
    this.props.getAllActivities();
    this.props.getGyms();
  };

  componentWillReceiveProps = async (nextProps) => {
    if (
      null === this.state.user.activitiesSelect &&
      nextProps.activity.activities.length > 0
    ) {
      this.checkActivitiesSelect(nextProps.activity.activities);
      await this.setState({
        user: {
          ...this.state.user,
          activitiesSelect: nextProps.activity.activities,
        },
      });
    }
    if (nextProps.profile.statusUpdateProfile) {
      this.props.resetStateUpdateProfile();
      this.props.navigation.navigate("ProfileViewDetailsProfile");
    } else if (
      !nextProps.profile.statusUpdateProfile &&
      "" !== nextProps.profile.messageErrorUpdate
    ) {
      this.showToast(nextProps.profile.messageErrorUpdate);
    }
    if (nextProps.activity.gyms.length > 0) {
      let aGymsName = ["None"];
      nextProps.activity.gyms.forEach((oGym) => {
        aGymsName.push(oGym.name);
      });
      await this.setState({
        gyms: nextProps.activity.gyms,
        gymsName: aGymsName,
      });
    }
    await this.setState({
      loading: false,
    });
  };

  checkActivitiesSelect = async (lActivities) => {
    await lActivities.map((lActivity) => {
      if (
        this.state.user.activities.filter(
          (lUserActivity) => lActivity.id === lUserActivity.id
        ).length > 0
      ) {
        lActivity.selected = true;
      }
    });
    await this.setState({
      user: {
        ...this.state.user,
        activities: lActivities,
      },
    });
  };

  showActivitySelector = async () => {
    await this.setState({
      showActivitySelector: true,
    });
  };

  closeActivitySelector = async () => {
    await this.setState({
      showActivitySelector: false,
    });
  };

  setDate = async (date) => {
    await this.setState({
      user: {
        ...this.state.user,
        age: date,
      },
    });
  };

  saveProfile = async () => {
    await this.setState({
      user: {
        ...this.state.user,
        showPassword: false,
      },
    });

    let lErrors = await validateFieldsProfile(
      {
        ...this.state.user,
        activities: this.state.user.activities.filter(
          (element) => element.selected === true
        ),
      },
      true
    );
    if (lErrors.haveError) {
      await this.setState({
        errors: lErrors,
      });
    } else {
      let sImage = null,
        sImageBackground = null,
        nUserId = this.props.session.account.id,
        sUserKey = this.props.session.account.key,
        sName = this.state.user.name,
        bDisplayAge = this.state.user.display_age,
        sAge = this.state.user.age,
        sSex = this.state.user.sex,
        sLevel = this.state.user.level,
        sHeight = this.state.user.height,
        bDisplayWight = this.state.user.display_weight,
        sWeight = this.state.user.weight,
        sGoals = this.state.user.goals.trim(),
        nGymId = this.state.user.gym_id,
        bPersonalTrainer = this.state.user.personal_trainer,
        bNewGym = this.state.newGym,
        sGymName = this.state.newGymName,
        aActivities = this.state.user.activities.filter(
          (element) => element.selected === true
        );
      if (this.state.newImage !== null) sImage = this.state.newImage;
      if (this.state.newImageBackground !== null)
        sImageBackground = this.state.newImageBackground;
      if (this.state.newGym) {
        nGymId = 0;
        sGymName = this.state.newGymName;
      }
      this.props.updateProfile(
        nUserId,
        sUserKey,
        sName,
        bDisplayAge,
        sAge,
        sSex,
        sLevel,
        sHeight,
        bDisplayWight,
        sWeight,
        sGoals,
        nGymId,
        bNewGym,
        sGymName,
        bPersonalTrainer,
        aActivities,
        sImage,
        sImageBackground
      );
    }
  };

  getSexLabel = () => {
    switch (this.state.user.sex) {
      case "M":
        return "Male";
      case "F":
        return "Female";
    }
    return "";
  };

  getSexValue = (value) => {
    switch (value) {
      case "Male":
        return "M";
      case "Female":
        return "F";
    }
    return "";
  };

  getFitnessLevelLabel = () => {
    switch (this.state.user.level) {
      case "B":
        return "Beginner";
      case "M":
        return "Intermediate";
      case "A":
        return "Advance";
    }
    return "";
  };

  getFitnessLevelValue = (value) => {
    switch (value) {
      case "Beginner":
        return "B";
      case "Intermediate":
        return "M";
      case "Advance":
        return "A";
    }
    return "";
  };

  addImagePerfil = async (sType) => {
    await this.setState({
      showProfilePhoto: false,
      loading: true,
    });
    let oOptions = {
      cropping: true,
      width: 600,
      height: 600,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    if ("camera" === sType) {
      ImagePicker.openCamera(oOptions).then(
        async (image) => {
          await this.setState({
            newImage: image.data,
            loading: false,
          });
        },
        async (cancel) => {
          await this.setState({
            loading: false,
          });
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        async (image) => {
          await this.setState({
            newImage: image.data,
            loading: false,
          });
        },
        async (cancel) => {
          await this.setState({
            loading: false,
          });
        }
      );
    }
  };

  addImageCover = async (sType) => {
    await this.setState({
      showCoverPhoto: false,
      loading: true,
    });
    let oOptions = {
      cropping: true,
      width: 500,
      height: 250,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    if ("camera" === sType) {
      ImagePicker.openCamera(oOptions).then(
        async (image) => {
          await this.setState({
            newImageBackground: image.data,
            loading: false,
          });
        },
        async (cancel) => {
          await this.setState({
            loading: false,
          });
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        async (image) => {
          await this.setState({
            newImageBackground: image.data,
            loading: false,
          });
        },
        async (cancel) => {
          await this.setState({
            loading: false,
          });
        }
      );
    }
  };

  showProfilePhoto = async () => {
    await this.setState({
      showProfilePhoto: true,
    });
  };

  showCoverPhoto = async () => {
    await this.setState({
      showCoverPhoto: true,
    });
  };

  showToast = async (sText) => {
    this.setState({
      toastText: sText,
      loading: false,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
    }, 2000);
  };

  newGym = () => {
    this.setState({
      newGym: !this.state.newGym,
    });
  };

  getSelectGymName = () => {
    let sValue = "None";
    this.state.gyms.forEach((oGym) => {
      if (this.state.user.gym_id == oGym.id) sValue = oGym.name;
    });
    return sValue;
  };

  selectGym = (value) => {
    let nGymId = null;
    this.state.gyms.forEach((oGym) => {
      if (value == oGym.name) nGymId = oGym.id;
    });
    this.setState({
      user: {
        ...this.state.user,
        gym_name: value,
        gym_id: nGymId,
      },
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {null !== this.state.user ? (
          <View style={this.getKeyboardOffsetStyle()}>
            <ScrollView ref={(ref) => (this.scrollView = ref)}>
              <View
                style={[
                  GlobalStyles.viewSection,
                  GlobalStyles.photoProfileViewSectionPhotos,
                  styles.contentImages,
                ]}
              >
                {null !== this.state.newImageBackground ? (
                  <Image
                    style={GlobalStyles.photoProfileCoverPreviewPhoto}
                    source={{
                      uri:
                        "data:image/jpeg;base64," +
                        this.state.newImageBackground,
                    }}
                  />
                ) : null !== this.state.user &&
                  undefined !== this.state.user.background &&
                  null !== this.state.user.background &&
                  "" !== this.state.user.background ? (
                  <FastImage
                    style={GlobalStyles.photoProfileCoverPreviewPhoto}
                    source={{
                      uri: this.state.previewBackground
                        ? "data:image/jpeg;base64," + this.state.user.background
                        : this.state.user.background,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View
                    style={[
                      GlobalStyles.photoProfileCoverPreviewPhoto,
                      { backgroundColor: "grey" },
                    ]}
                  />
                )}
                <View>
                  {null !== this.state.newImage ? (
                    <Image
                      style={GlobalStyles.photoProfileProfilePreviewPhoto}
                      source={{
                        uri: "data:image/jpeg;base64," + this.state.newImage,
                      }}
                    />
                  ) : null !== this.state.user && this.state.user.image ? (
                    <FastImage
                      style={GlobalStyles.photoProfileProfilePreviewPhoto}
                      source={{
                        uri: this.state.user.image,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : (
                    <Image
                      style={GlobalStyles.photoProfileImagePerfil}
                      source={require("../../assets/imgProfileReadOnly.png")}
                    />
                  )}
                  <View style={styles.buttonUpdateProfileImage}>
                    <Pressable
                      onPress={() => {
                        this.showProfilePhoto();
                      }}
                    >
                      <Icon
                        style={{
                          textAlign: "center",
                        }}
                        name="touch-app"
                        size={22}
                      ></Icon>
                      <Text style={{ fontSize: 12 }}>UPDATE</Text>
                    </Pressable>
                  </View>
                </View>
                <UpdateCoverPhoto
                  press={() => {
                    this.showCoverPhoto();
                  }}
                />
              </View>
              <View>
                <InputText
                  title="Email"
                  value={this.state.user.email}
                  readonly={true}
                />
                <InputText
                  title="Username"
                  value={this.state.user.username}
                  readonly={true}
                />
                <InputText
                  title="Name"
                  value={this.state.user.name}
                  onChange={(text) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        name: text,
                      },
                    });
                  }}
                  error={this.state.errors.showNameError}
                />
                <DatePickerSelect
                  title="Age"
                  value={this.state.user.age}
                  setDate={(date) => {
                    this.setDate(date);
                  }}
                />
                <CheckBox
                  title="Display age?"
                  value={this.state.user.display_age}
                  onPress={() => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        display_age: !this.state.user.display_age,
                      },
                    });
                  }}
                />
                <SelectCombo
                  title={"Sex"}
                  items={["Male", "Female"]}
                  textSelect={null}
                  value={this.state.user.sex}
                  textSelect={this.getSexLabel()}
                  onValueChange={(value) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        sex: this.getSexValue(value),
                      },
                    });
                  }}
                />
                <SelectCombo
                  title={"Fitness Level"}
                  items={["Beginner", "Intermediate", "Advance"]}
                  value={this.state.user.level}
                  textSelect={this.getFitnessLevelLabel()}
                  onValueChange={(value) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        level: this.getFitnessLevelValue(value),
                      },
                    });
                  }}
                  error={this.state.errors.showLevelError}
                />
                {!this.state.newGym && (
                  <SelectCombo
                    title={"Gym"}
                    items={this.state.gymsName}
                    value={this.state.user.gym_name}
                    textSelect={this.getSelectGymName()}
                    onValueChange={(value) => this.selectGym(value)}
                  />
                )}
                <CheckBox
                  title="Can't find your gym?"
                  value={!this.state.newGym}
                  onPress={() => this.newGym()}
                />
                {this.state.newGym && (
                  <InputText
                    title="Name Gym"
                    value={this.state.newGymName}
                    onChange={(text) => {
                      this.setState({
                        newGymName: text,
                      });
                    }}
                  />
                )}
                <SelectCombo
                  title={"Height"}
                  items={lHeightSizes}
                  value={this.state.user.height}
                  textSelect={this.state.user.height}
                  onValueChange={(value) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        height: value,
                      },
                    });
                  }}
                />
                <InputText
                  title="Weight"
                  ph="lbs"
                  value={this.state.user.weight}
                  type={"number-pad"}
                  error={this.state.errors.showWeightError}
                  onChange={(text) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        weight: text,
                      },
                    });
                  }}
                />
                <CheckBox
                  title="Display weight?"
                  value={this.state.user.display_weight}
                  onPress={() => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        display_weight: !this.state.user.display_weight,
                      },
                    });
                  }}
                />
                <ShowActivities
                  activities={this.state.user.activities}
                  press={() => this.showActivitySelector()}
                  error={this.state.errors.showActivitiesError}
                />
                <CheckBox
                  title="Do you have a personal trainer?"
                  stylesText={{ width: "40%" }}
                  stylesView={{ paddingTop: 20 }}
                  value={this.state.user.personal_trainer}
                  onPress={() => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        personal_trainer: !this.state.user.personal_trainer,
                      },
                    });
                  }}
                />
                <InputTextArea
                  title="About me/Goals (upto 500 words)"
                  ph="What do you want to say?"
                  value={this.state.user.goals}
                  onChange={(text) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        goals: text,
                      },
                    });
                  }}
                  onFocus={() => this.scrollToEnd()}
                />
              </View>
              {/* Por el momento queda comentado, yo no le veo sentido que este aca esto
                                F.M 05_02_20, consultar con ellos si lo ven viable

                                    <View style={[GlobalStyles.viewSection, { borderBottomWidth: 0 }]}>
                                        <ButtonFacebook login={false} title="Link your facebook account"
                                            onPress={() => this.loginFB()} />
                                    </View>
                                */}
            </ScrollView>
          </View>
        ) : (
          <LoadingSpinner visible={true} />
        )}
        <ToastQuestion
          visible={this.state.showProfilePhoto}
          functionCamera={() => this.addImagePerfil("camera")}
          functionGallery={() => this.addImagePerfil("gallery")}
        />
        <ToastQuestion
          visible={this.state.showCoverPhoto}
          functionCamera={() => this.addImageCover("camera")}
          functionGallery={() => this.addImageCover("gallery")}
        />
        <SelectActivities
          visible={this.state.showActivitySelector}
          activities={this.state.user.activities}
          close={() => this.closeActivitySelector()}
        />
        <LoadingSpinner visible={this.state.loading} />
        <Toast toastText={this.state.toastText} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonUpdateProfileImage: {
    position: "absolute",
    backgroundColor: WhiteColor,
    borderColor: PlaceholderColor,
    padding: 5,
    borderRadius: 5,
    bottom: 5,
    right: 0,
  },
  contentImages: {
    backgroundColor: "gray",
  },
});

const mapStateToProps = (state) => ({
  activity: state.reducerActivity,
  profile: state.reducerProfile,
  session: state.reducerSession,
});

const mapDispatchToProps = (dispatch) => ({
  getAllActivities: () => {
    dispatch(actionGetAllActivities());
  },
  updateProfile: (
    nUserId,
    sKey,
    sName,
    bDisplayAge,
    sAge,
    sSex,
    sLevel,
    sHeight,
    bDisplayWight,
    sWeight,
    sGoals,
    nGymId,
    bNewGym,
    sGymName,
    bPersonalTrainer,
    aActivities,
    sImage,
    sImageBackground
  ) => {
    dispatch(
      actionUpdateProfile(
        nUserId,
        sKey,
        sName,
        bDisplayAge,
        sAge,
        sSex,
        sLevel,
        sHeight,
        bDisplayWight,
        sWeight,
        sGoals,
        nGymId,
        bNewGym,
        sGymName,
        bPersonalTrainer,
        aActivities,
        sImage,
        sImageBackground
      )
    );
  },
  resetStateUpdateProfile: () => {
    dispatch(actionUpdateProfileResetState());
  },
  getGyms: () => {
    dispatch(actionGetGyms());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);
