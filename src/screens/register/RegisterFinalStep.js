import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Keyboard,
} from "react-native";
import { GlobalStyles, PlaceholderColor, SignUpColor } from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { GlobalCheckBox } from "../../components/shared/GlobalCheckBox";
import SelectActivities from "../../components/register/SelectActivities";
import { connect, useDispatch } from "react-redux";
import { Toast } from "../../components/shared/Toast";
import { actionUserRegister } from "../../redux/actions/UserActions";
import { actionGetAllActivities } from "../../redux/actions/ActivityActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import ReactNativePickerModule from "react-native-picker-module";
import {
  lHeightSizes,
  OPTIONS_GEOLOCATION_GET_POSITION,
} from "../../Constants";
import Geolocation from "@react-native-community/geolocation";
import SelectDropdown from "react-native-select-dropdown";

const RegisterFinalStep = ({ navigation }) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     refresh: false,
  //     showSelectActivities: false,
  //     toastText: "",
  //     showWeightError: false,
  //     showActivitiesError: false,
  //     errors: {
  //       showWeightError: false,
  //       showActivitiesError: false,
  //       showHeightError: false,
  //     },
  //     user: {
  //       ...this.props.navigation.getParam("user", {}),
  //       displayWeight: true,
  //       height: null,
  //       weight: null,
  //       goals: "",
  //       personalTrainer: false,
  //     },
  //     activities: [],
  //     loading: false,
  //     keyboardPadding: 0,
  //   };
  // }

  // const activity = useSelector((state) => state.reducerActivity);

  const dispatch = useDispatch();

  const [showSelectActivities, setShowSelectActivities] = useState(false);
  const [toastText, setToastText] = useState("");
  const [errors, setErrors] = useState({
    showWeightError: false,
    showActivitiesError: false,
    showHeightError: false,
  });
  const [user, setUser] = useState({
    ...navigation.getParam("user", {}),
    displayWeight: true,
    height: null,
    weight: null,
    goals: "",
    personalTrainer: false,
  });
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [keyboardPadding, setKeyboardPadding] = useState(false);



  // componentDidMount() {
  //   this.props.navigation.setParams({ nextButton: this.register });
  //   this.props.getAllActivities();
  //   this.oKeyboardListenerWillShow = Keyboard.addListener(
  //     "keyboardWillShow",
  //     this.openKeyboard
  //   );
  //   this.oKeyboardListenerWillHide = Keyboard.addListener(
  //     "keyboardWillHide",
  //     this.closeKeyboard
  //   );
  // }

  // openKeyboard = ({ endCoordinates: { height } }) => {
  //   this.setState({ bShowKeyboard: true, keyboardPadding: height });
  // };

  // closeKeyboard = ({ endCoordinates: { height } }) => {
  //   this.setState({ bShowKeyboard: false, keyboardPadding: 0 });
  // };

  // componentWillUnmount = () => {
  //   this.oKeyboardListenerWillShow && this.oKeyboardListenerWillShow.remove();
  //   this.oKeyboardListenerWillHide && this.oKeyboardListenerWillHide.remove();
  // };

  // componentWillReceiveProps = async (nextProps) => {
  //   if (nextProps.activity.activities.length > 0) {
  //     await this.setState({
  //       activities: nextProps.activity.activities,
  //     });
  //   }
  //   if (
  //     !nextProps.register.status &&
  //     "" !== nextProps.register.messageError &&
  //     null !== nextProps.register.messageError
  //   ) {
  //     this.showToast(nextProps.register.messageError);
  //   }
  //   await this.setState({
  //     loading: false,
  //   });
  // };

  const register = () => {
    setUser({
      ...user,
      activities: activities.filter((element) => element.selected),
      personalTrainer: user.personalTrainer === true ? true : false,
      goals: user.goals.trim() === "" ? null : user.goals,
    })
    let lErrors = validate(user);
    if (lErrors.haveError) {
      setErrors(lErrors);
      setLoading(false);
      showToast(lErrors.messageError);
    } else {
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            if (position && undefined !== position.coords) {
              dispatch(actionUserRegister({
                ...user,
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
              }));
            } else {
              dispatch(actionUserRegister({
                ...user,
                longitude: null,
                latitude: null,
              }));
            }
          },
          () => {
            dispatch(actionUserRegister({
              ...user,
              longitude: null,
              latitude: null,
            }));
          },
          OPTIONS_GEOLOCATION_GET_POSITION
        );
      } catch (oError) {
        dispatch(actionUserRegister({
          ...user,
          longitude: null,
          latitude: null,
        }));
      }
    }
  };

  //CHECK HEIGHT, ACTIVITIES AND WEIGHT
  const validate = (lValues) => {
    let lErrors = {
      messageError: "",
      haveError: false,
      showWeightError: false,
      showActivitiesError: false,
    };
    // ACTIVITIES
    if (!lValues.activities.length > 0) {
      lErrors.showActivitiesError = true;
      lErrors.messageError = "Please choose activities";
      lErrors.haveError = true;
    }
    // WEIGHT
    if ("" === lValues.weight || null === lValues.weight) {
      lErrors.showWeightError = true;
      lErrors.messageError = "Please enter a valid weight";
      lErrors.haveError = true;
    }
    // HEIGHT
    if ("" === lValues.height || null === lValues.height) {
      lErrors.showHeightError = true;
      lErrors.messageError = "Please enter a valid height";
      lErrors.haveError = true;
    }
    // AMBOS
    if (
      !lValues.activities.length > 0 &&
      ("" === lValues.weight || null === lValues.weight) &&
      ("" === lValues.height || null === lValues.height)
    ) {
      lErrors.messageError =
        "Please choose height, activities and enter a valid weight";
      lErrors.haveError = true;
    }
    return lErrors;
  };

  const showToast = async (sText) => {
    setToastText(sText);
    setLoading(false);
    setTimeout(() => {
      setToastText("");
    }, 2000);
  };

  return (
    <>
      <ScrollView
        ref={(oRef) => (this.oScrollView = oRef)}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingBottom: keyboardPadding + 35 }}>
          <Text style={styles.titleText}>
            We need a little more information about you setup profile.
          </Text>
          <View
            style={[
              styles.viewSection,
              styles.checkInput,
              { alignItems: "flex-end" },
              errors.showHeightError && GlobalStyles.errorBorder,
            ]}
          >
            <Text style={styles.textLabel}>Height</Text>
            <View style={styles.comboSelect}>
              <SelectDropdown
                data={lHeightSizes}
                onSelect={(selectedItem, index) => {
                  setUser({
                    ...user,
                    height: selectedItem,
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
              errors.showWeightError && GlobalStyles.errorBorder,
              styles.row,
            ]}
          >
            <Pressable
              style={styles.colLabel}
              onPress={() => this.oWeightRef.focus()}
              activeOpacity={1}
            >
              <Text style={styles.textLabelColumn}>Weight</Text>
            </Pressable>
            <View style={styles.colInput}>
              <View style={styles.containerTextInput}>
                <TextInput
                  style={styles.textInput}
                  ref={(oRef) => (this.oWeightRef = oRef)}
                  onSubmitEditing={() => this.oWeightRef.focus()}
                  placeholder="lbs"
                  value={user.weight}
                  placeholderTextColor={PlaceholderColor}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    +text < 1000
                      ?
                      setUser({
                        ...user,
                        weight: text
                      })
                      :
                      setUser({
                        ...user,
                        weight: "1000"
                      })
                  }}
                />
              </View>
            </View>
          </View>
          <View style={[styles.viewSection, styles.displayComboBox]}>
            <Text style={styles.textLabel}>Display Weight?</Text>
            <GlobalCheckBox
              onPress={() => {
                setUser({
                  ...user,
                  displayWeight: !user.displayWeight,
                })
              }}
              isCheck={user.displayWeight ? true : false}
              title="Yes"
            />
            <GlobalCheckBox
              onPress={() => {
                setUser({
                  ...user,
                  displayWeight: !user.displayWeight,
                })
              }}
              isCheck={!user.displayWeight ? true : false}
              title="No"
            />
          </View>
          <View
            style={[
              styles.viewSection,
              styles.checkInput,
              { alignItems: "flex-end", borderBottomWidth: 0 },
              errors.showActivitiesError &&
              GlobalStyles.errorBorder,
            ]}
          >
            <Text style={styles.textLabel}>Activities</Text>
            <View style={styles.comboSelect}>
              <Pressable
                style={{ flexDirection: "row", padding: 4 }}
                onPress={() => setShowSelectActivities(true)}
              >
                <Icon
                  name="md-create"
                  size={18}
                  style={styles.iconSelect}
                  color={SignUpColor}
                />
                <Text style={{ color: SignUpColor }}>Choose Activities</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.viewActivitiesSelected}>
            {activities
              .filter((item) => item.selected)
              .map((element) => (
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: SignUpColor,
                    padding: 5,
                    borderRadius: 20,
                    justifyContent: "center",
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  key={element.id}
                >
                  <Text
                    style={{
                      color: SignUpColor,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    {element.name}
                  </Text>
                </View>
              ))}
          </View>
          <View
            style={[
              styles.viewSection,
              styles.displayComboBox,
              { paddingTop: 5 },
            ]}
          >
            <Text style={[styles.textLabel, { width: "40%" }]}>
              Do you have a personal trainer?
            </Text>
            <GlobalCheckBox
              onPress={() => {
                setUser({
                  ...user,
                  personalTrainer: !user.personalTrainer,
                })
              }}
              isCheck={user.personalTrainer ? true : false}
              title="Yes"
            />
            <GlobalCheckBox
              onPress={() => {
                setUser({
                  ...user,
                  personalTrainer: !user.personalTrainer,
                })
              }}
              isCheck={!user.personalTrainer ? true : false}
              title="No"
            />
          </View>
          <View style={styles.viewSection}>
            <Text style={[styles.textLabel, { top: 10 }]}>
              About me/Goals (upto 500 words)
            </Text>
            <TextInput
              style={[styles.checkInput, styles.inputTextArea]}
              onFocus={() => this.oScrollView.scrollToEnd({ animated: true })}
              multiline={true}
              numberOfLines={4}
              textAlign="left"
              placeholder="What do you want to say?"
              placeholderTextColor={PlaceholderColor}
              onChangeText={(text) =>
                setUser({
                  ...user,
                  goals: text
                })
              }
              value={user.goals}
            />
          </View>
        </View>
      </ScrollView>
      <SelectActivities
        visible={showSelectActivities}
        activities={activities}
        close={() => setShowSelectActivities(false)}
      />
      <Toast toastText={toastText} />
      <LoadingSpinner visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  textLabel: {
    position: "absolute",
    left: 20,
    bottom: 10,
    color: PlaceholderColor,
  },
  checkInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  containerTextInput: {
    width: "100%",
    alignItems: "flex-end",
  },
  textInput: {
    width: "70%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  displayComboBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconSelect: {
    marginLeft: 10,
    marginTop: -2,
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
  },
  inputTextArea: {
    paddingStart: "5%",
    paddingEnd: "5%",
    height: 100,
    marginTop: 30,
  },
  viewActivitiesSelected: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  iconError: {
    position: "absolute",
    right: "5%",
    bottom: 10,
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
    paddingStart: 18,
  },
});

const mapStateToProps = (state) => ({
  register: state.reducerRegister,
  activity: state.reducerActivity,
  login: state.reducerSession,
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: (data) => {
    dispatch(actionUserRegister(data));
  },
  getAllActivities: () => {
    dispatch(actionGetAllActivities());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterFinalStep);
