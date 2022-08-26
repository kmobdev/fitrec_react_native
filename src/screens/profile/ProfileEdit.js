import React, { Component, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Keyboard,
  Pressable,
} from "react-native";
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
import { connect, useDispatch, useSelector } from "react-redux";
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

const ProfileEdit = (props) => {
  const scrollView = useRef();

  const activity = useSelector((state) => state.reducerActivity);
  const profile = useSelector((state) => state.reducerProfile);
  const session = useSelector((state) => state.reducerSession);

  const dispatch = useDispatch();

  const [user, setUser] = useState({
    ...props.navigation.getParam("user", null),
    activitiesSelect: null,
  });
  const [errors, setErrors] = useState({
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
  });
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [showCoverPhoto, setShowCoverPhoto] = useState(false);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastText, setToastText] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImageBackground, setNewImageBackground] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [gymsName, setGymsName] = useState([]);
  const [newGym, setNewGym] = useState(false);
  const [newGymName, setNewGymName] = useState("");
  const [previewBackground, setPreviewBackground] = useState();

  useEffect(() => {
    props.navigation.setParams({ saveProfile: saveProfile });
    setNewImage(null);
    dispatch(actionGetAllActivities());
    dispatch(actionGetGyms());
  }, []);

  useEffect(() => {
    if (null === user.activitiesSelect && activity.activities.length > 0) {
      checkActivitiesSelect(activity.activities);
      setUser({
        ...user,
        activitiesSelect: activity.activities,
      });
    }
    if (profile.statusUpdateProfile) {
      dispatch(actionUpdateProfileResetState());
      props.navigation.navigate("ProfileViewDetailsProfile");
    } else if (
      !profile.statusUpdateProfile &&
      "" !== profile.messageErrorUpdate
    ) {
      showToast(profile.messageErrorUpdate);
    }
    if (activity.gyms.length > 0) {
      let aGymsName = ["None"];
      activity.gyms.forEach((oGym) => {
        aGymsName.push(oGym.name);
      });
      setGyms(activity.gyms);
      setGymsName(aGymsName);
    }
    setLoading(false);
  }, []);

  const scrollToEnd = () => {
    if (null !== scrollView && undefined !== scrollView)
      scrollView.current.scrollToEnd({ animated: true });
  };

  const checkActivitiesSelect = (lActivities) => {
    lActivities.map((lActivity) => {
      if (
        user.activities.filter(
          (lUserActivity) => lActivity.id === lUserActivity.id
        ).length > 0
      ) {
        lActivity.selected = true;
      }
    });
    setUser({
      ...user,
      activities: lActivities,
    });
  };

  const showActivitySelectorHandler = () => {
    setShowActivitySelector(true);
  };

  const closeActivitySelector = () => {
    setShowActivitySelector(false);
  };

  const setDate = (date) => {
    setUser({
      ...user,
      age: date,
    });
  };

  const saveProfile = () => {
    setUser({
      ...user,
      showPassword: false,
    });

    let lErrors = validateFieldsProfile(
      {
        ...user,
        activities: user.activities.filter(
          (element) => element.selected === true
        ),
      },
      true
    );
    if (lErrors.haveError) {
      setErrors(lErrors);
    } else {
      let sImage = null,
        sImageBackground = null,
        nUserId = session.account.id,
        sUserKey = session.account.key,
        sName = user.name,
        bDisplayAge = user.display_age,
        sAge = user.age,
        sSex = user.sex,
        sLevel = user.level,
        sHeight = user.height,
        bDisplayWight = user.display_weight,
        sWeight = user.weight,
        sGoals = user.goals.trim(),
        nGymId = user.gym_id,
        bPersonalTrainer = user.personal_trainer,
        bNewGym = newGym,
        sGymName = newGymName,
        aActivities = user.activities.filter(
          (element) => element.selected === true
        );
      if (newImage !== null) sImage = newImage;
      if (newImageBackground !== null) sImageBackground = newImageBackground;
      if (newGym) {
        nGymId = 0;
        sGymName = newGymName;
      }
      dispatch(
        actionUpdateProfile(
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
        )
      );
    }
  };

  const getSexLabel = () => {
    switch (user.sex) {
      case "M":
        return "Male";
      case "F":
        return "Female";
    }
    return "";
  };

  const getSexValue = (value) => {
    switch (value) {
      case "Male":
        return "M";
      case "Female":
        return "F";
    }
    return "";
  };

  const getFitnessLevelLabel = () => {
    switch (user.level) {
      case "B":
        return "Beginner";
      case "M":
        return "Intermediate";
      case "A":
        return "Advance";
    }
    return "";
  };

  const getFitnessLevelValue = (value) => {
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

  const addImagePerfil = (sType) => {
    setShowProfilePhoto(false);
    setLoading(true);
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
        (image) => {
          setNewImage(image.data);
          setLoading(false);
        },
        (cancel) => {
          setLoading(false);
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        (image) => {
          setNewImage(image.data);
          setLoading(false);
        },
        (cancel) => {
          setLoading(false);
        }
      );
    }
  };

  const addImageCover = (sType) => {
    setShowCoverPhoto(false);
    setLoading(true);
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
        (image) => {
          setNewImageBackground(image.data);
          setLoading(false);
        },
        (cancel) => {
          setLoading(false);
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        (image) => {
          setNewImageBackground(image.data);
          setLoading(false);
        },
        (cancel) => {
          setLoading(false);
        }
      );
    }
  };

  const showProfilePhotoHandler = () => {
    setShowProfilePhoto(true);
  };

  const showCoverPhotoHandler = () => {
    setShowCoverPhoto(true);
  };

  const showToast = (text) => {
    setToastText(text);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  const newGymHandler = () => {
    setNewGym(!newGym);
  };

  const getSelectGymName = () => {
    let sValue = "None";
    gyms.forEach((oGym) => {
      if (user.gym_id == oGym.id) sValue = oGym.name;
    });
    return sValue;
  };

  const selectGym = (value) => {
    let nGymId = null;
    gyms.forEach((oGym) => {
      if (value == oGym.name) nGymId = oGym.id;
    });
    setUser({
      ...user,
      gym_name: value,
      gym_id: nGymId,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {null !== user ? (
        <View>
          <ScrollView ref={scrollView}>
            <View
              style={[
                GlobalStyles.viewSection,
                GlobalStyles.photoProfileViewSectionPhotos,
                styles.contentImages,
              ]}>
              {null !== newImageBackground ? (
                <Image
                  style={GlobalStyles.photoProfileCoverPreviewPhoto}
                  source={{
                    uri: "data:image/jpeg;base64," + newImageBackground,
                  }}
                />
              ) : null !== user &&
                undefined !== user.background &&
                null !== user.background &&
                "" !== user.background ? (
                <FastImage
                  style={GlobalStyles.photoProfileCoverPreviewPhoto}
                  source={{
                    uri: previewBackground
                      ? "data:image/jpeg;base64," + user.background
                      : user.background,
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
                {null !== newImage ? (
                  <Image
                    style={GlobalStyles.photoProfileProfilePreviewPhoto}
                    source={{
                      uri: "data:image/jpeg;base64," + newImage,
                    }}
                  />
                ) : null !== user && user.image ? (
                  <FastImage
                    style={GlobalStyles.photoProfileProfilePreviewPhoto}
                    source={{
                      uri: user.image,
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
                      showProfilePhotoHandler();
                    }}>
                    <Icon
                      style={{
                        textAlign: "center",
                      }}
                      name="touch-app"
                      size={22}></Icon>
                    <Text style={{ fontSize: 12 }}>UPDATE</Text>
                  </Pressable>
                </View>
              </View>
              <UpdateCoverPhoto
                press={() => {
                  showCoverPhotoHandler();
                }}
              />
            </View>
            <View>
              <InputText title="Email" value={user.email} readonly={true} />
              <InputText
                title="Username"
                value={user.username}
                readonly={true}
              />
              <InputText
                title="Name"
                value={user.name}
                onChange={(text) => {
                  setUser({
                    ...user,
                    name: text,
                  });
                }}
                error={errors.showNameError}
              />
              <DatePickerSelect
                title="Age"
                value={user.age}
                setDate={(date) => {
                  setDate(date);
                }}
              />
              <CheckBox
                title="Display age?"
                value={user.display_age}
                onPress={() => {
                  setUser({
                    ...user,
                    display_age: !user.display_age,
                  });
                }}
              />
              <SelectCombo
                title={"Sex"}
                items={["Male", "Female"]}
                value={user.sex}
                textSelect={getSexLabel()}
                onValueChange={(value) => {
                  setUser({
                    ...user,
                    sex: getSexValue(value),
                  });
                }}
              />
              <SelectCombo
                title={"Fitness Level"}
                items={["Beginner", "Intermediate", "Advance"]}
                value={user.level}
                textSelect={getFitnessLevelLabel()}
                onValueChange={(value) => {
                  setUser({
                    ...user,
                    level: getFitnessLevelValue(value),
                  });
                }}
                error={errors.showLevelError}
              />
              {!newGym && (
                <SelectCombo
                  title={"Gym"}
                  items={gymsName}
                  value={user.gym_name}
                  textSelect={getSelectGymName()}
                  onValueChange={(value) => selectGym(value)}
                />
              )}
              <CheckBox
                title="Can't find your gym?"
                value={!newGym}
                onPress={newGymHandler}
              />
              {newGym && (
                <InputText
                  title="Name Gym"
                  value={newGymName}
                  onChange={(text) => setNewGymName(text)}
                />
              )}
              <SelectCombo
                title={"Height"}
                items={lHeightSizes}
                value={user.height}
                textSelect={user.height}
                onValueChange={(value) => {
                  setUser({
                    ...user,
                    height: value,
                  });
                }}
              />
              <InputText
                title="Weight"
                ph="lbs"
                value={user.weight}
                type={"number-pad"}
                error={errors.showWeightError}
                onChange={(text) => {
                  setUser({
                    ...user,
                    weight: text,
                  });
                }}
              />
              <CheckBox
                title="Display weight?"
                value={user.display_weight}
                onPress={() => {
                  setUser({
                    ...user,
                    display_weight: !user.display_weight,
                  });
                }}
              />
              <ShowActivities
                activities={user.activities}
                press={() => showActivitySelectorHandler()}
                error={errors.showActivitiesError}
              />
              <CheckBox
                title="Do you have a personal trainer?"
                stylesText={{ width: "40%" }}
                stylesView={{ paddingTop: 20 }}
                value={user.personal_trainer}
                onPress={() => {
                  setUser({
                    ...user,
                    personal_trainer: !user.personal_trainer,
                  });
                }}
              />
              <InputTextArea
                title="About me/Goals (upto 500 words)"
                ph="What do you want to say?"
                value={user.goals}
                onChange={(text) => {
                  setUser({
                    ...user,
                    goals: text,
                  });
                }}
                onFocus={() => scrollToEnd()}
              />
            </View>
            {/* Por el momento queda comentado, yo no le veo sentido que este aca esto
                                F.M 05_02_20, consultar con ellos si lo ven viable

                                    <View style={[GlobalStyles.viewSection, { borderBottomWidth: 0 }]}>
                                        <ButtonFacebook login={false} title="Link your facebook account"
                                            onPress={() => loginFB()} />
                                    </View>
                                */}
          </ScrollView>
        </View>
      ) : (
        <LoadingSpinner visible={true} />
      )}
      <ToastQuestion
        visible={showProfilePhoto}
        functionCamera={() => addImagePerfil("camera")}
        functionGallery={() => addImagePerfil("gallery")}
      />
      <ToastQuestion
        visible={showCoverPhoto}
        functionCamera={() => addImageCover("camera")}
        functionGallery={() => addImageCover("gallery")}
      />
      <SelectActivities
        visible={showActivitySelector}
        activities={user.activities}
        close={() => closeActivitySelector()}
      />
      <LoadingSpinner visible={loading} />
      <Toast toastText={toastText} />
    </View>
  );
};

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

export default ProfileEdit;
