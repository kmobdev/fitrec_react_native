import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/login/Login";
import Register from "../screens/register/Register";
import { GlobalStyles, SignUpColor } from "../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, Platform, Pressable } from "react-native";
import Conditions from "../screens/register/Conditions";
import RegisterFinalStep from "../screens/register/RegisterFinalStep";
import ForgotPassword from "../screens/login/ForgotPassword";

const NavigationGuest = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        headerTitle: "Fill in your profile details",
      },
    },
    Conditions: {
      screen: Conditions,
      navigationOptions: {
        headerTitle: "Terms and Conditions",
        headerLeft: null,
        headerRight: null,
      },
    },
    RegisterFinalStep: {
      screen: RegisterFinalStep,
      navigationOptions: {
        header: null,
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        headerTitle: "Account Support",
      },
    },
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Icon
          name={Platform.OS === "android" ? "md-arrow-back" : "ios-arrow-back"}
          color={SignUpColor}
          size={30}
          onPress={() => {
            navigation.goBack();
          }}
          style={GlobalStyles.backIcon}
        />
      ),
      headerRight: <Text style={GlobalStyles.backIcon}></Text>,
    }),
  }
);

export default createAppContainer(NavigationGuest);
