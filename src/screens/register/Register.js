import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Pressable,
  Platform, SafeAreaView,
} from "react-native";
import { ButtonFacebook } from "../../components/shared/ButtonFacebook";
import { Toast } from "../../components/shared/Toast";
import moment from "moment/min/moment-with-locales";
import {
  WhiteColor,
  SignUpColor,
  PlaceholderColor,
  GlobalStyles,
} from "../../Styles";
import ImagePicker from "react-native-image-crop-picker";
import { ToastQuestion } from "../../components/shared/ToastQuestion";
import { GlobalCheckBox } from "../../components/shared/GlobalCheckBox";
import { useDispatch, useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import {
  actionUserRegisterValidate,
  actionUserLoginFB,
} from "../../redux/actions/UserActions";
import { UpdateCoverPhoto } from "../../components/shared/UpdateCoverPhoto";
import { actionGetGyms } from "../../redux/actions/ActivityActions";
import SelectDropdown from "react-native-select-dropdown";
import Input from "../../components/login/Input";

const Register = ({ navigation }) => {
  let lUserFBData = navigation.getParam("userFBData", null);
  let aAppleData = navigation.getParam("appleCredentials", null);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const nameRef = useRef();
  const scrollViewRef = useRef();

  const register = useSelector((state) => state.reducerRegister);
  const login = useSelector((state) => state.reducerSession);
  const activity = useSelector((state) => state.reducerActivity);

  const dispatch = useDispatch();

  const [dateSelect, setDateSelect] = useState(
    moment().subtract(16, "years").format("YYYY-MM-DD")
  );
  const [errors, setErrors] = useState({});
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [showCoverPhoto, setShowCoverPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(
    lUserFBData !== null ? false : true
  );
  const [user, setUser] = useState({
    username:
      null !== lUserFBData
        ? lUserFBData.name.replace(" ", "")
        : aAppleData !== null
        ? aAppleData.name
        : "",
    email:
      null !== lUserFBData
        ? lUserFBData.email
        : aAppleData !== null
        ? aAppleData.email
        : "",
    password:
      null !== lUserFBData
        ? lUserFBData.id.replace(0, "z").replace(2, "A")
        : "",
    confirmPassword:
      null !== lUserFBData
        ? lUserFBData.id.replace(0, "z").replace(2, "A")
        : "",
    name: null !== lUserFBData ? lUserFBData.name : "",
    age: null,
    displayAge: false,
    sex: null,
    level: null,
    image: null !== lUserFBData ? lUserFBData.picture.data.url : null,
    background: null,
    userFacebookId: null !== lUserFBData ? lUserFBData.id : "",
    gym: null,
    gymId: 0,
    newGym: false,
  });
  const [age, setAge] = useState([
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
    35, 36, 37,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastText, setToastText] = useState("");
  const [sex, setSex] = useState(["MALE", "FEMALE"]);
  const [level, setLevel] = useState(["BEGINNER", "INTERMEDIATE", "ADVANCE"]);
  const [gymsName, setGymsName] = useState({});
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    getFacebookPhoto();
    dispatch(actionGetGyms());
  }, []);

  useEffect(() => {
    if (!login.status && login.redirectSignIn && login.appleAccount === null) {
      let lUserFBData = login.userFBData;
      setShowPassword(null !== lUserFBData ? false : true);
      setErrors({});
      setUser({
        username: null !== lUserFBData ? lUserFBData.name.replace(" ", "") : "",
        email: null !== lUserFBData ? lUserFBData.email : "",
        password: lUserFBData.id.replace(0, "z").replace(2, "A"),
        confirmPassword: lUserFBData.id.replace(0, "z").replace(2, "A"),
        name: null !== lUserFBData ? lUserFBData.name : "",
        age: null,
        displayAge: false,
        sex: null,
        level: null,
        image: null !== lUserFBData ? lUserFBData.picture.data.url : null,
        background: null,
        userFacebookId: null !== lUserFBData ? lUserFBData.id : "",
      });
      getFacebookPhoto();
    }
  }, [login]);

  useEffect(() => {
    if (
      null === register.redirectConditions &&
      undefined !== register.messageError &&
      "" !== register.messageError
    ) {
      showToast(register.messageError);
    }
    if (register.redirectConditions) {
      if (user.newGym) {
        user.gymId = 0;
        if (null === user.gym || "" === user.gym.trim()) user.gym = null;
      } else {
        if ("None" === user.gym) user.gym = null;
        else
          gyms.forEach((oGym) => {
            if (oGym.name === user.gym) user.gymId = oGym.id;
          });
      }
      navigation.navigate("Conditions", { user: user });
    }
  }, [register]);

  useEffect(() => {
    if (activity.gyms.length > 0 && gyms.length === 0) {
      let aGymsName = [];
      activity.gyms.forEach((oGym) => {
        aGymsName.push(oGym.name);
      });
      setGyms(activity.gyms);
      setGymsName(aGymsName);
    }
  }, [activity]);

  const scrollToEnd = () => {
    if (null !== scrollViewRef && undefined !== scrollViewRef)
      scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const getFacebookPhoto = async () => {
    if (!showPassword) {
      await RNFetchBlob.fetch("GET", user.image, {}).then(async (res) => {
        let status = res.info().status;
        if (status == 200) {
          setUser({
            ...user,
            image: res.base64(),
          });
        }
      });
    }
  };

  const addImagePerfil = (sType) => {
    setShowProfilePhoto(false);
    let oOptions = {
      cropping: true,
      width: 600,
      height: 600,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    if ("camera" === sType) {
      ImagePicker.openCamera(oOptions)
        .then((image) => {
          setUser({
            ...user,
            background: image.data,
          });
        })
        .catch((error) => {});
    } else {
      ImagePicker.openPicker(oOptions)
        .then((image) => {
          setUser({
            ...user,
            background: image.data,
          });
        })
        .catch((error) => {});
    }
  };

  const addImageCover = (sType) => {
    setShowCoverPhoto(false);
    let oOptions = {
      cropping: true,
      width: 500,
      height: 250,
      loadingLabelText: "Upload image",
      forceJpg: true,
      includeBase64: true,
    };
    if ("camera" === sType) {
      ImagePicker.openCamera(oOptions)
        .then((image) => {
          setUser({
            ...user,
            background: image.data,
          });
        })
        .catch((error) => {});
    } else {
      ImagePicker.openPicker(oOptions)
        .then((image) => {
          setUser({
            ...user,
            background: image.data,
          });
        })
        .catch((error) => {});
    }
  };

  const registerHandler = async () => {
    setUser({
      ...user,
      name: user.name.trim(),
      email: user.email.trim(),
    });
    let lErrors = await validate(user);
    if (lErrors.haveError) {
      setErrors(lErrors);
      if ("" !== lErrors.messageError) {
        showToast(lErrors.messageError);
      }
    } else {
      dispatch(actionUserRegisterValidate(user.email, user.username));
    }
  };

  const validate = async (lValues) => {
    let lErrors = {
      showUsernameError: false,
      showEmailError: false,
      showPasswordError: false,
      showConfirmPasswordError: false,
      showNameError: false,
      showAgeError: false,
      showSexError: false,
      showLevelError: false,
      messageError: "",
      haveError: false,
    };
    //LEVEL
    if (null === lValues.level) {
      lErrors.showLevelError = true;
      lErrors.haveError = true;
      lErrors.messageError = "Fitness Level is required";
    }
    //SEX
    if (null === lValues.sex) {
      lErrors.showSexError = true;
      lErrors.haveError = true;
      lErrors.messageError = "Sex is required";
    }
    //AGE
    if (null === lValues.age) {
      lErrors.showAgeError = true;
      lErrors.haveError = true;
      lErrors.messageError = "Age is required";
    }
    //NAME
    if ("" === lValues.name.trim()) {
      lErrors.showNameError = true;
      lErrors.haveError = true;
      lErrors.messageError = "The name is required";
    }
    if (showPassword) {
      //PASSWORD
      if ("" === lValues.password || lValues.password.length < 7) {
        lErrors.showPasswordError = true;
        lErrors.haveError = true;
        if (lValues.password.length < 7) {
          if (lValues.password.length < 7 && "" !== lErrors.messageError) {
            lErrors.messageError =
              "The username and password must have more than 6 characters";
          } else {
            lErrors.messageError =
              "The password must have more than 6 characters";
          }
        }
      }
      //CONFIRM PASSWORD
      if (
        "" === lValues.confirmPassword ||
        lValues.confirmPassword !== lValues.password
      ) {
        lErrors.showConfirmPasswordError = true;
        lErrors.messageError =
          "" === lValues.confirmPassword
            ? "Password confirmation is empty"
            : "Password confirmation does not match password";
        lErrors.haveError = true;
      }
    }
    //EMAIL
    if ("" === lValues.email) {
      lErrors.haveError = true;
      lErrors.showEmailError = true;
      lErrors.messageError = "The email is required";
    } else {
      let sEmailValidator =
        /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (!sEmailValidator.test(lValues.email)) {
        lErrors.haveError = true;
        lErrors.showEmailError = true;
        lErrors.messageError = "The email format is incorrect";
      }
    }
    //USERNAME
    if ("" === lValues.username || lValues.username.length < 7) {
      lErrors.showUsernameError = true;
      lErrors.haveError = true;
      if (lValues.username.length < 7) {
        lErrors.messageError = "The username must have more than 6 characters";
      }
    }
    return lErrors;
  };

  const showProfilePhotoHandler = () => {
    setShowProfilePhoto(true);
  };

  const showCoverPhotoHandler = () => {
    setShowCoverPhoto(true);
  };

  const showToast = (text) => {
    setIsLoading(true);
    setToastText(text);
    setTimeout(() => {
      setIsLoading(false);
      setToastText("");
    }, 2000);
  };

  /**
   * Login with facebook
   * if not exist account load data
   * else login with account
   */
  const loginFB = () => {
    dispatch(actionUserLoginFB());
  };

  const getAgeItems = () => {
    let nCount = 9,
      aAges = [];
    while (nCount < 121) {
      aAges.push("" + nCount);
      nCount++;
    }
    console.log("aAges ====>>>>> ", aAges);
    return aAges;
  };

  const handleOnPressLabel = (oRef) => {
    oRef.current.focus();
  };

  const onDropdownSelectionHandler = (selectedItem, index) => {
    setUser({
      ...user,
      age: selectedItem,
    });
    console.log(selectedItem, index);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView ref={scrollViewRef}>
        <View style={GlobalStyles.photoProfileViewSectionPhotos}>
          {null !== user.background ? (
            <Image
              resizeMode="cover"
              source={{
                uri: "data:image/png;base64," + user.background,
              }}
              style={GlobalStyles.photoProfileCoverPreviewPhoto}
            />
          ) : (
            <View
              style={[
                GlobalStyles.photoProfileCoverPreviewPhoto,
                { backgroundColor: "gray" },
              ]}
            />
          )}
          <Pressable onPress={showProfilePhotoHandler}>
            {user.image ? (
              <Image
                style={GlobalStyles.photoProfileProfilePreviewPhoto}
                source={{
                  uri: "data:image/png;base64," + user.image,
                }}
              />
            ) : (
              <Image
                style={GlobalStyles.photoProfileImagePerfil}
                source={require("../../assets/imgProfile2.png")}
              />
            )}
          </Pressable>
          <UpdateCoverPhoto press={showCoverPhotoHandler} />
        </View>
        {
          // TODO: Login with Facebook commented to solve Apple Review - Leandro Curbelo August 24
          Platform.OS === "android" && showPassword && (
            <View style={[styles.viewSection, { borderBottomWidth: 0 }]}>
              <ButtonFacebook
                login={false}
                title="Login facebook account"
                onPress={() => loginFB()}
              />
            </View>
          )
        }
        <View
          style={[
            errors.showUsernameError && GlobalStyles.errorBorder,
            styles.row,
          ]}
        >
          <Pressable
            style={styles.colLabel}
            onPress={() => handleOnPressLabel(usernameRef)}
            activeOpacity={1}
          >
            <Text style={styles.textLabelColumn}>Username</Text>
          </Pressable>
          <View style={styles.colInput}>
            <View style={styles.containerTextInput}>
              <Input
                inputStyle={styles.textInput}
                textContentType={"username"}
                ref={usernameRef}
                onChangeText={(text) => {
                  setUser({
                    ...user,
                    username: text.trim().replace(" ", ""),
                  });
                }}
                value={user.username}
                autoCapitalize="none"
                onSubmitEditing={() => handleOnPressLabel(emailRef)}
              />
            </View>
          </View>
        </View>
        <View
          style={[
            errors.showEmailError && GlobalStyles.errorBorder,
            styles.row,
          ]}
        >
          <Pressable
            style={styles.colLabel}
            onPress={() => handleOnPressLabel(emailRef)}
            activeOpacity={1}
          >
            <Text style={styles.textLabelColumn}>Email</Text>
          </Pressable>
          <View style={styles.colInput}>
            <View style={styles.containerTextInput}>
              <Input
                inputStyle={[
                  styles.textInput,
                  !showPassword && styles.placeholderColor,
                ]}
                ref={emailRef}
                onChangeText={(text) => {
                  setUser({
                    ...user,
                    email: text.trim().replace(" ", ""),
                  });
                }}
                value={user.email}
                editable={showPassword ? true : false}
                onSubmitEditing={() => handleOnPressLabel(passwordRef)}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType={"emailAddress"}
              />
            </View>
          </View>
        </View>
        {showPassword && (
          <>
            <View
              style={[
                errors.showPasswordError && GlobalStyles.errorBorder,
                styles.row,
              ]}
            >
              <Pressable
                style={styles.colLabel}
                onPress={() => handleOnPressLabel(passwordRef)}
                activeOpacity={1}
              >
                <Text style={styles.textLabelColumn}>Password</Text>
              </Pressable>
              <View style={styles.colInput}>
                <View style={styles.containerTextInput}>
                  <Input
                    inputStyle={styles.textInput}
                    textContentType={"newPassword"}
                    ref={passwordRef}
                    onChangeText={(text) => {
                      setUser({
                        ...user,
                        password: text,
                      });
                    }}
                    value={user.password}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onSubmitEditing={() =>
                      handleOnPressLabel(confirmPasswordRef)
                    }
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                errors.showConfirmPasswordError && GlobalStyles.errorBorder,
                styles.row,
              ]}
            >
              <Pressable
                style={styles.colLabel}
                onPress={() => handleOnPressLabel(confirmPasswordRef)}
                activeOpacity={1}
              >
                <Text style={styles.textLabelColumn}>Confirm Password</Text>
              </Pressable>
              <View style={styles.colInput}>
                <View style={styles.containerTextInput}>
                  <Input
                    inputStyle={styles.textInput}
                    textContentType={"newPassword"}
                    ref={confirmPasswordRef}
                    onChangeText={(text) => {
                      setUser({
                        ...user,
                        confirmPassword: text,
                      });
                    }}
                    value={user.confirmPassword}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onSubmitEditing={() => handleOnPressLabel(nameRef)}
                  />
                </View>
              </View>
            </View>
          </>
        )}
        <View
          style={[
            errors.showEmailError && GlobalStyles.errorBorder,
            styles.row,
          ]}
        >
          <Pressable
            style={styles.colLabel}
            onPress={() => handleOnPressLabel(nameRef)}
            activeOpacity={1}
          >
            <Text style={styles.textLabelColumn}>Name</Text>
          </Pressable>
          <View style={styles.colInput}>
            <View style={styles.containerTextInput}>
              <Input
                inputStyle={styles.textInput}
                textContentType={"name"}
                ref={nameRef}
                onChangeText={(text) => {
                  setUser({
                    ...user,
                    name: text,
                  });
                }}
                value={user.name}
                autoCapitalize="none"
                onSubmitEditing={() => handleOnPressLabel(nameRef)}
              />
            </View>
          </View>
        </View>
        <View
          style={[
            styles.viewSection,
            styles.checkInput,
            { alignItems: "flex-end" },
            errors.showAgeError && GlobalStyles.errorBorder,
          ]}
        >
          <Text style={styles.textLabel}>Age</Text>
          <View style={styles.dropdownSelect}>
            <SelectDropdown
              data={age}
              onSelect={(selectedItem, index) =>
                onDropdownSelectionHandler(selectedItem, index)
              }
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
        </View>
        <View style={[styles.viewSection, styles.displayAge]}>
          <Text style={styles.textLabel}>Display Age?</Text>
          <GlobalCheckBox
            onPress={() => {
              setUser({
                ...user,
                displayAge: !user.displayAge,
              });
            }}
            isCheck={!user.displayAge ? true : false}
            title="Yes"
          />
          <GlobalCheckBox
            onPress={() => {
              setUser({
                ...user,
                displayAge: !user.displayAge,
              });
            }}
            isCheck={user.displayAge ? true : false}
            title="No"
          />
        </View>
        <View
          style={[
            styles.viewSection,
            styles.checkInput,
            { alignItems: "flex-end" },
            errors.showSexError && GlobalStyles.errorBorder,
          ]}
        >
          <Text style={styles.textLabel}>Sex</Text>
          <View style={styles.dropdownSelect}>
            <SelectDropdown
              data={sex}
              onSelect={(selectedItem, index) => {
                setUser({
                  ...user,
                  sex: selectedItem,
                });
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
        </View>
        <View
          style={[
            styles.viewSection,
            styles.checkInput,
            styles.aligItemsRight,
            errors.showLevelError && GlobalStyles.errorBorder,
          ]}
        >
          <Text style={styles.textLabel}>Fitness level</Text>
          <View style={styles.dropdownSelect}>
            <SelectDropdown
              data={level}
              onSelect={(selectedItem, index) => {
                setUser({
                  ...user,
                  level: selectedItem,
                });
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
        </View>
        {!user.newGym && (
          <View
            style={[
              styles.viewSection,
              styles.checkInput,
              styles.aligItemsRight,
            ]}
          >
            <Text style={styles.textLabel}>Gym</Text>
            <View style={styles.dropdownSelect}>
              <SelectDropdown
                data={gymsName}
                onSelect={(selectedItem, index) => {
                  setUser({
                    ...user,
                    gym: selectedItem,
                  });
                  console.log(selectedItem, index);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
              />
            </View>
          </View>
        )}
        <View style={[styles.viewSection, styles.displayAge]}>
          <Text style={styles.textLabel}>Can't find your gym?</Text>
          <View style={{ marginRight: 20 }}>
            <GlobalCheckBox
              onPress={() => {
                setUser({
                  ...user,
                  newGym: !user.newGym,
                  gym: null,
                });
              }}
              isCheck={user.newGym ? true : false}
              title={null}
            />
          </View>
        </View>
        {user.newGym && (
          <View style={[styles.viewSection, styles.displayAge]}>
            <Text style={styles.textLabel}>Name Gym</Text>
            <TextInput
              inputStyle={styles.textInput}
              onFocus={scrollToEnd()}
              onChangeText={(text) => {
                setUser({
                  ...user,
                  gym: text,
                });
              }}
              value={user.gym}
            />
          </View>
        )}
        <View style={[styles.viewSection, styles.viewSignUpButton]}>
          <Pressable onPress={registerHandler} style={styles.signUpButton}>
            <Text style={styles.signUpText}>SIGN UP</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Toast visible={isLoading} toastText={toastText} />
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
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  viewSection: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    zIndex: 0,
  },
  textLabel: {
    position: "absolute",
    left: 20,
    bottom: 13,
    color: PlaceholderColor,
  },
  checkInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    marginTop: 5,
    color: "black",
  },
  containerTextInput: {
    width: "100%",
    alignItems: "flex-end",
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  displayAge: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
  },
  dropdownSelect: {
    fontWeight: "50",
    position: "absolute",
    bottom: -4,

    alignItems: "flex-end",
  },
  viewSignUpButton: {
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  signUpButton: {
    width: "95%",
    borderRadius: 5,
    paddingTop: 15,
    paddingBottom: 15,
    fontWeight: "500",
    backgroundColor: SignUpColor,
    alignItems: "center",
    marginTop: 20,
  },
  signUpText: {
    color: WhiteColor,
  },
  iconSelect: {
    marginLeft: 10,
    marginTop: -2,
  },
  icon: {
    marginRight: 5,
  },
  aligItemsRight: {
    alignItems: "flex-end",
  },
  placeholderColor: {
    color: PlaceholderColor,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    padding: 2,
  },
  colLabel: {
    flex: 5,
    justifyContent: "center",
  },
  colInput: {
    flex: 8,
  },
  textLabelColumn: {
    color: PlaceholderColor,
    paddingStart: 15,
  },
});
