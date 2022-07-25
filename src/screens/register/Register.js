import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Pressable,
  Platform,
  Keyboard,
} from "react-native";
import { ButtonFacebook } from "../../components/shared/ButtonFacebook";
import DatePicker from "react-native-datepicker";
import Icon from "react-native-vector-icons/Ionicons";
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
import { connect } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import {
  actionUserRegisterValidate,
  actionUserLoginFB,
} from "../../redux/actions/UserActions";
import { Toast } from "../../components/shared/Toast";
import { UpdateCoverPhoto } from "../../components/shared/UpdateCoverPhoto";
import { actionGetGyms } from "../../redux/actions/ActivityActions";
import SelectDropdown from "react-native-select-dropdown";

class Register extends Component {
  constructor(props) {
    super(props);
    let lUserFBData = this.props.navigation.getParam("userFBData", null);
    let aAppleData = this.props.navigation.getParam("appleCredentials", null);
    this.state = {
      dateSelect: moment().subtract(16, "years").format("YYYY-MM-DD"),
      errors: {},
      showProfilePhoto: false,
      showCoverPhoto: false,
      showPassword: null !== lUserFBData ? false : true,
      user: {
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
      },
      toastText: "",
      gyms: [],
      gymsName: [],
      keyboardOffset: 0,
    };

    this.age = [
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
      34, 35, 36, 37,
    ];
    this.sex = ["MALE", "FEMALE"];
    this.level = ["BEGINNER", "INTERMEDIATE", "ADVANCE"];
    this.gims = "";

    this.getKeyboardOffsetStyle = this.getKeyboardOffsetStyle.bind(this);
    this.handleKeyboardShow = this.handleKeyboardShow.bind(this);
    this.handleKeyboardHide = this.handleKeyboardHide.bind(this);

    Keyboard.addListener("keyboardDidShow", this.handleKeyboardShow);
    Keyboard.addListener("keyboardWillShow", this.handleKeyboardShow);
    Keyboard.addListener("keyboardWillHide", this.handleKeyboardHide);
    Keyboard.addListener("keyboardDidHide", this.handleKeyboardHide);
  }

  handleKeyboardShow = async ({ endCoordinates: { height } }) => {
    this.setState({ keyboardOffset: height });
  };

  handleKeyboardHide = async () => {
    this.setState({ keyboardOffset: 0 });
  };

  scrollToEnd = () => {
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

  componentDidMount = async () => {
    this.getFacebookPhoto();
    this.props.getGyms();
  };

  getFacebookPhoto = async () => {
    if (!this.state.showPassword) {
      await RNFetchBlob.fetch("GET", this.state.user.image, {}).then(
        async (res) => {
          let status = res.info().status;
          if (status == 200) {
            this.setState({
              user: {
                ...this.state.user,
                image: res.base64(),
              },
            });
          }
        }
      );
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (
      null === nextProps.register.redirectConditions &&
      undefined !== nextProps.register.messageError &&
      "" !== nextProps.register.messageError
    ) {
      this.showToast(nextProps.register.messageError);
    }
    if (nextProps.register.redirectConditions) {
      if (this.state.user.newGym) {
        this.state.user.gymId = 0;
        if (null === this.state.user.gym || "" === this.state.user.gym.trim())
          this.state.user.gym = null;
      } else {
        if ("None" === this.state.user.gym) this.state.user.gym = null;
        else
          this.state.gyms.forEach((oGym) => {
            if (oGym.name === this.state.user.gym)
              this.state.user.gymId = oGym.id;
          });
      }
      this.props.navigation.navigate("Conditions", { user: this.state.user });
    }
    if (nextProps.activity.gyms.length > 0 && this.state.gyms.length === 0) {
      let aGymsName = ["None"];
      nextProps.activity.gyms.forEach((oGym) => {
        aGymsName.push(oGym.name);
      });
      this.setState({
        gyms: nextProps.activity.gyms,
        gymsName: aGymsName,
      });
    }
    if (
      !nextProps.login.status &&
      nextProps.login.redirectSignIn &&
      nextProps.login.appleAccount === null
    ) {
      let lUserFBData = nextProps.login.userFBData;
      this.setState({
        showPassword: null !== lUserFBData ? false : true,
        errors: {},
        user: {
          username:
            null !== lUserFBData ? lUserFBData.name.replace(" ", "") : "",
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
        },
      });
      this.getFacebookPhoto();
    }
  };

  changeDate = (sDate) => {
    this.setState({
      dateSelect: sDate,
      user: {
        ...this.state.user,
        age: moment().diff(sDate, "years"),
      },
    });
  };

  addImagePerfil = (sType) => {
    this.setState({
      showProfilePhoto: false,
      loadingImage: true,
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
          this.setState({
            user: {
              ...this.state.user,
              image: image.data,
            },
            loadingImage: false,
          });
        },
        async (cancel) => {
          this.setState({
            loadingImage: false,
          });
        }
      );
    } else {
      ImagePicker.openPicker(oOptions).then(
        async (image) => {
          this.setState({
            user: {
              ...this.state.user,
              image: image.data,
            },
            loadingImage: false,
          });
        },
        async (cancel) => {
          this.setState({
            loadingImage: false,
          });
        }
      );
    }
  };

  addImageCover = (sType) => {
    this.setState({
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
          this.setState({
            user: {
              ...this.state.user,
              background: image.data,
            },
            loadingImage: false,
          });
        },
        async (cancel) => {
          this.setState({
            loadingImage: false,
          });
        }
      );
    } else {
      ImagePicker.openPicker(oOptions)
        .then((image) => {
          this.setState({
            user: {
              ...this.state.user,
              background: image.data,
            },
            loadingImage: false,
          });
        },
          (cancel) => {
            this.setState({
              loadingImage: false,
            });
          }
        );
    }
  };

  register = async () => {
    this.setState({
      user: {
        ...this.state.user,
        name: this.state.user.name.trim(),
        email: this.state.user.email.trim(),
      },
    });
    let lErrors = await this.validate(this.state.user);
    if (lErrors.haveError) {
      this.setState({
        errors: lErrors,
      });
      if ("" !== lErrors.messageError) {
        this.showToast(lErrors.messageError);
      }
    } else {
      this.props.userRegisterValidate(
        this.state.user.email,
        this.state.user.username
      );
    }
  };

  validate = async (lValues) => {
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
    if (this.state.showPassword) {
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

  showProfilePhoto = async () => {
    this.setState({
      showProfilePhoto: true,
    });
  };

  showCoverPhoto = async () => {
    this.setState({
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

  /**
   * Login with facebook
   * if not exist account load data
   * else login with account
   */
  loginFB = () => {
    this.props.loginUserFB();
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

  getlevelLabel = () => {
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

  getlevelValue = (value) => {
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

  setDate = async (date) => {
    await this.setState({
      user: {
        ...this.state.user,
        age: date,
      },
    });
  };

  calculateAge() {
    // Line commented since it will be used later - Leandro Curbelo 01/22/2021
    // return moment().diff(this.state.user.age, 'years')
    return this.state.user.age;
  }

  getAgeItems = () => {
    let nCount = 9,
      aAges = [];
    while (nCount < 121) {
      aAges.push("" + nCount);
      nCount++;
    }
    return aAges;
  };

  handleOnPressLabel = (oRef = null) => {
    if (oRef) oRef.focus();
  };

  onDropdownSelectionHandler = (selectedItem, index) => {
    this.setState({
      user: {
        ...this.state.user,
        age: selectedItem,
      },
    });
    console.log(selectedItem, index);
  }

  render = () => {
    return (
      <View style={this.getKeyboardOffsetStyle()}>
        <ScrollView ref={(ref) => (this.scrollView = ref)}>
          <View style={GlobalStyles.photoProfileViewSectionPhotos}>
            {null !== this.state.user.background ? (
              <Image
                resizeMode="cover"
                source={{
                  uri: "data:image/png;base64," + this.state.user.background,
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
            <Pressable onPress={() => this.showProfilePhoto()}>
              {this.state.user.image ? (
                <Image
                  style={GlobalStyles.photoProfileProfilePreviewPhoto}
                  source={{
                    uri: "data:image/png;base64," + this.state.user.image,
                  }}
                />
              ) : (
                <Image
                  style={GlobalStyles.photoProfileImagePerfil}
                  source={require("../../assets/imgProfile2.png")}
                />
              )}
            </Pressable>
            <UpdateCoverPhoto press={() => this.showCoverPhoto()} />
          </View>
          {
            // TODO: Login with Facebook commented to solve Apple Review - Leandro Curbelo August 24
            Platform.OS === "android" && this.state.showPassword && (
              <View style={[styles.viewSection, { borderBottomWidth: 0 }]}>
                <ButtonFacebook
                  login={false}
                  title="Login facebook account"
                  onPress={() => this.loginFB()}
                />
              </View>
            )
          }
          <View
            style={[
              this.state.errors.showUsernameError && GlobalStyles.errorBorder,
              styles.row,
            ]}
          >
            <Pressable
              style={styles.colLabel}
              onPress={() => this.handleOnPressLabel(this.oUsernameRef)}
              activeOpacity={1}
            >
              <Text style={styles.textLabelColumn}>Username</Text>
            </Pressable>
            <View style={styles.colInput}>
              <View style={styles.containerTextInput}>
                <TextInput
                  style={styles.textInput}
                  textContentType={"username"}
                  ref={(oRef) => (this.oUsernameRef = oRef)}
                  onChangeText={(text) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        username: text.trim().replace(" ", ""),
                      },
                    });
                  }}
                  value={this.state.user.username}
                  autoCapitalize="none"
                  onSubmitEditing={() =>
                    this.handleOnPressLabel(this.oEmailRef)
                  }
                />
              </View>
            </View>
          </View>
          <View
            style={[
              this.state.errors.showEmailError && GlobalStyles.errorBorder,
              styles.row,
            ]}
          >
            <Pressable
              style={styles.colLabel}
              onPress={() => this.handleOnPressLabel(this.oEmailRef)}
              activeOpacity={1}
            >
              <Text style={styles.textLabelColumn}>Email</Text>
            </Pressable>
            <View style={styles.colInput}>
              <View style={styles.containerTextInput}>
                <TextInput
                  style={[
                    styles.textInput,
                    !this.state.showPassword && styles.placeholderColor,
                  ]}
                  ref={(oRef) => (this.oEmailRef = oRef)}
                  onChangeText={(text) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        email: text.trim().replace(" ", ""),
                      },
                    });
                  }}
                  value={this.state.user.email}
                  editable={this.state.showPassword ? true : false}
                  onSubmitEditing={() =>
                    this.handleOnPressLabel(this.oPasswordRef)
                  }
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType={"emailAddress"}
                />
              </View>
            </View>
          </View>
          {this.state.showPassword && (
            <>
              <View
                style={[
                  this.state.errors.showPasswordError &&
                  GlobalStyles.errorBorder,
                  styles.row,
                ]}
              >
                <Pressable
                  style={styles.colLabel}
                  onPress={() => this.handleOnPressLabel(this.oPasswordRef)}
                  activeOpacity={1}
                >
                  <Text style={styles.textLabelColumn}>Password</Text>
                </Pressable>
                <View style={styles.colInput}>
                  <View style={styles.containerTextInput}>
                    <TextInput
                      style={styles.textInput}
                      textContentType={"newPassword"}
                      ref={(oRef) => (this.oPasswordRef = oRef)}
                      onChangeText={(text) => {
                        this.setState({
                          user: { ...this.state.user, password: text },
                        });
                      }}
                      value={this.state.user.password}
                      autoCapitalize="none"
                      secureTextEntry={true}
                      onSubmitEditing={() =>
                        this.handleOnPressLabel(this.oConfirmPasswordRef)
                      }
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  this.state.errors.showConfirmPasswordError &&
                  GlobalStyles.errorBorder,
                  styles.row,
                ]}
              >
                <Pressable
                  style={styles.colLabel}
                  onPress={() =>
                    this.handleOnPressLabel(this.oConfirmPasswordRef)
                  }
                  activeOpacity={1}
                >
                  <Text style={styles.textLabelColumn}>Confirm Password</Text>
                </Pressable>
                <View style={styles.colInput}>
                  <View style={styles.containerTextInput}>
                    <TextInput
                      style={styles.textInput}
                      textContentType={"newPassword"}
                      ref={(oRef) => (this.oConfirmPasswordRef = oRef)}
                      onChangeText={(text) => {
                        this.setState({
                          user: { ...this.state.user, confirmPassword: text },
                        });
                      }}
                      value={this.state.user.confirmPassword}
                      autoCapitalize="none"
                      secureTextEntry={true}
                      onSubmitEditing={() =>
                        this.handleOnPressLabel(this.oNameRef)
                      }
                    />
                  </View>
                </View>
              </View>
            </>
          )}
          <View
            style={[
              this.state.errors.showEmailError && GlobalStyles.errorBorder,
              styles.row,
            ]}
          >
            <Pressable
              style={styles.colLabel}
              onPress={() => this.handleOnPressLabel(this.oNameRef)}
              activeOpacity={1}
            >
              <Text style={styles.textLabelColumn}>Name</Text>
            </Pressable>
            <View style={styles.colInput}>
              <View style={styles.containerTextInput}>
                <TextInput
                  style={styles.textInput}
                  textContentType={"name"}
                  ref={(oRef) => (this.oNameRef = oRef)}
                  onChangeText={(text) => {
                    this.setState({ user: { ...this.state.user, name: text } });
                  }}
                  value={this.state.user.name}
                  autoCapitalize="none"
                  onSubmitEditing={() => this.handleOnPressLabel(this.oNameRef)}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.viewSection,
              styles.checkInput,
              { alignItems: "flex-end" },
              this.state.errors.showAgeError && GlobalStyles.errorBorder,
            ]}
          >
            <Text style={styles.textLabel}>Age</Text>
            <View style={styles.dropdownSelect}>
              <SelectDropdown
                data={this.getAgeItems()}
                onSelect={(selectedItem, index) => this.onDropdownSelectionHandler(selectedItem, index)}
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
                this.setState({
                  user: {
                    ...this.state.user,
                    displayAge: !this.state.user.displayAge,
                  },
                });
              }}
              isCheck={!this.state.user.displayAge ? true : false}
              title="Yes"
            />
            <GlobalCheckBox
              onPress={() => {
                this.setState({
                  user: {
                    ...this.state.user,
                    displayAge: !this.state.user.displayAge,
                  },
                });
              }}
              isCheck={this.state.user.displayAge ? true : false}
              title="No"
            />
          </View>
          <View
            style={[
              styles.viewSection,
              styles.checkInput,
              { alignItems: "flex-end" },
              this.state.errors.showSexError && GlobalStyles.errorBorder,
            ]}
          >
            <Text style={styles.textLabel}>Sex</Text>
            <View style={styles.dropdownSelect}>
              <SelectDropdown
                data={this.sex}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    user: {
                      ...this.state.user,
                      sex: selectedItem,
                    },
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
              this.state.errors.showLevelError && GlobalStyles.errorBorder,
            ]}
          >
            <Text style={styles.textLabel}>Fitness level</Text>
            <View style={styles.dropdownSelect}>
              <SelectDropdown
                data={this.level}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    user: {
                      ...this.state.user,
                      level: selectedItem,
                    },
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
          {!this.state.user.newGym && (
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
                  data={this.state.gymsName}
                  onSelect={(selectedItem, index) => {
                    this.setState({
                      user: {
                        ...this.state.user,
                        gym: selectedItem,
                      },
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
                  this.setState({
                    user: {
                      ...this.state.user,
                      newGym: !this.state.user.newGym,
                      gym: null,
                    },
                  });
                }}
                isCheck={this.state.user.newGym ? true : false}
                title={null}
              />
            </View>
          </View>
          {this.state.user.newGym && (
            <View style={[styles.viewSection, styles.displayAge]}>
              <Text style={styles.textLabel}>Name Gym</Text>
              <TextInput
                style={styles.textInput}
                onFocus={this.scrollToEnd()}
                onChangeText={(text) => {
                  this.setState({ user: { ...this.state.user, gym: text } });
                }}
                value={this.state.user.gym}
              />
            </View>
          )}
          <View style={[styles.viewSection, styles.viewSignUpButton]}>
            <Pressable
              onPress={() => this.register()}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpText}>SIGN UP</Text>
            </Pressable>
          </View>
        </ScrollView>
        <Toast toastText={this.state.toastText} />
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
      </View>
    );
  };
}

const styles = StyleSheet.create({
  viewSection: {
    width: "100%",
    alignItems: "center",
    padding: 5,
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

const mapStateToProps = (state) => ({
  register: state.reducerRegister,
  login: state.reducerSession,
  activity: state.reducerActivity,
});

const mapDispatchToProps = (dispatch) => ({
  userRegisterValidate: (sEmail, sUsername) => {
    dispatch(actionUserRegisterValidate(sEmail, sUsername));
  },
  loginUserFB: () => {
    dispatch(actionUserLoginFB());
  },
  getGyms: () => {
    dispatch(actionGetGyms());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
