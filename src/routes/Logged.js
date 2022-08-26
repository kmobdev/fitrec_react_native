import React from "react";
import { StyleSheet } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import {
  GlobalStyles,
  SignUpColor,
  GlobalModal,
  GlobalMessages,
} from "../Styles";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, Platform, Image, View, Pressable } from "react-native";
import Home from "../screens/home/Home";
import DrawerButton from "./sidemenus/DrawerButton";
import LoggedSideMenu from "./sidemenus/LoggedSideMenu";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Blog from "../screens/blog/Blog";
import ProfileView from "../screens/profile/ProfileView";
import ProfileViewHome from "../screens/profile/ProfileViewHome";
import ProfileEdit from "../screens/profile/ProfileEdit";
import ListMessages from "../screens/messages/ListMessages";
import NewEditMessage from "../screens/messages/NewEditMessage";
import ListNotifications from "../screens/notifications/ListNotifications";
import MyPalsList from "../screens/myPals/MyPalsList";
import Groups from "../screens/groups/Groups";
import NewGroup from "../screens/groups/NewGroup";
import JourneyList from "../screens/journey/JourneyList";
import Settings from "../screens/settings/Settings";
import JourneyCreate from "../screens/journey/JourneyCreate";
import ShowJourney from "../screens/journey/ShowJourney";
import Followers from "../screens/followers/Followers";
import Blocks from "../screens/blocks/Blocks";
import DetailsGroup from "../screens/groups/DetailsGroup";
import MessagesGroup from "../screens/groups/MessagesGroup";
import Messages from "../screens/messages/Messages";

const oFollowImage = require("../assets/follows.png");

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: <DrawerButton navigation={navigation} />,
          headerRight:
            params.index === undefined || params.index !== 1 ? (
              <Pressable onPress={() => params.sharedButton()}>
                <Icon
                  name="share-social"
                  size={22}
                  color={SignUpColor}
                  style={GlobalStyles.backIcon}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  navigation.navigate("Followers");
                }}
                activeOpacity={1}>
                <Image
                  style={{ width: 28, height: 28, marginRight: 13 }}
                  source={oFollowImage}
                />
              </Pressable>
            ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () =>
            params.index === undefined || params.index !== 1 ? (
              <Image
                resizeMode={Platform.OS === "android" ? "center" : "contain"}
                source={require("../assets/logoHead.png")}
                style={
                  Platform.OS === "android"
                    ? { height: 100 }
                    : { height: "100%" }
                }
              />
            ) : (
              <Text style={Styles.title}>Fitness Journey</Text>
            ),
          gesturesEnabled: true,
        };
      },
    },
    Blog: {
      screen: Blog,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <DrawerButton navigation={navigation} />,
        headerRight: <Text style={GlobalStyles.backIcon}></Text>,
        gesturesEnabled: false,
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>FITREC Blog</Text>,
      }),
    },
    ListMessages: {
      screen: ListMessages,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: <DrawerButton navigation={navigation} />,
          gesturesEnabled: false,
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Messages</Text>,
        };
      },
    },
    Messages: {
      screen: Messages,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={params.goBack}
              style={GlobalStyles.backIcon}
            />
          ),
          gesturesEnabled: false,
          headerTitleAlign: Styles.titleAlign,
          headerRight: () =>
            params.people ? (
              <Pressable
                activeOpacity={1}
                onPress={params.people}
                style={[GlobalModal.buttonClose, Styles.headerRight]}>
                <Icon
                  name={
                    params.bShowPeople ? "chatbubbles" : "people-circle-outline"
                  }
                  color={SignUpColor}
                  size={22}
                />
                <Text style={GlobalModal.titleClose}>
                  {params.bShowPeople ? "Messages" : "People"}
                </Text>
              </Pressable>
            ) : null,
          headerTitle: () => (
            <Text style={Styles.title}>
              {!params.bShowPeople ? "Messages" : "People"}
            </Text>
          ),
        };
      },
    },
    NewEditMessage: {
      screen: NewEditMessage,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
            style={GlobalStyles.backIcon}
          />
        ),
        headerRight: <Text style={GlobalStyles.backIcon}></Text>,
        gesturesEnabled: false,
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Messages</Text>,
      }),
    },
    Groups: {
      screen: Groups,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: <DrawerButton navigation={navigation} />,
          headerRight: () => {
            if (params.tabSelectMy) {
              return (
                <Pressable
                  onPress={() => navigation.navigate("NewGroup")}
                  style={[GlobalModal.buttonClose, Styles.headerRight]}>
                  <Icon
                    name="add"
                    size={20}
                    color={SignUpColor}
                    style={Styles.margin}
                  />
                  <Text style={GlobalModal.titleClose}>Create</Text>
                </Pressable>
              );
            } else {
              return (
                <Pressable
                  onPress={params.openOptions}
                  style={[GlobalModal.buttonClose, Styles.headerRight]}>
                  <Icon name="ios-options" size={30} color={SignUpColor} />
                </Pressable>
              );
            }
          },
          gesturesEnabled: false,
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Groups</Text>,
        };
      },
    },
    NewGroup: {
      screen: NewGroup,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={() => {
                navigation.goBack();
              }}
              style={GlobalStyles.backIcon}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => params.createGroup()}
              style={[GlobalModal.buttonClose, Styles.headerRight]}>
              <Icon
                name="checkmark"
                size={20}
                color={SignUpColor}
                style={Styles.margin}
              />
              <Text style={GlobalModal.titleClose}>Save</Text>
            </Pressable>
          ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>New Group</Text>,
        };
      },
    },
    DetailsGroup: {
      screen: DetailsGroup,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={params.goBack}
              style={GlobalStyles.backIcon}
            />
          ),
          headerRight: () =>
            params.messages ? (
              <Pressable
                activeOpacity={1}
                onPress={params.messages}
                style={[GlobalModal.buttonClose, Styles.headerRight]}>
                <Text style={GlobalModal.titleClose}>Messages</Text>
                {params.countMessages && params.countMessages > 0 ? (
                  <View
                    style={[
                      { alignItems: "center" },
                      {
                        position: "absolute",
                        top: 5,
                        right: 5,
                        justifyContent: "center",
                      },
                    ]}>
                    <View
                      style={[
                        GlobalMessages.viewBubble,
                        { width: 15, height: 15 },
                      ]}>
                      <Text style={[GlobalMessages.text, { fontSize: 12 }]}>
                        {params.countMessages}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Pressable>
            ) : null,
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Group Details</Text>,
        };
      },
    },
    MessagesGroup: {
      screen: MessagesGroup,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={params.goBack}
              style={GlobalStyles.backIcon}
            />
          ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Group Messages</Text>,
        };
      },
    },
    ProfileViewDetailsHome: {
      screen: ProfileViewHome,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={() => {
                navigation.goBack();
              }}
              style={GlobalStyles.backIcon}
            />
          ),
          gesturesEnabled: false,
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>User Profile</Text>,
        };
      },
    },
    JourneyList: {
      screen: JourneyList,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: <DrawerButton navigation={navigation} />,
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () =>
            params.index === undefined || params.index !== 1 ? (
              <Image
                resizeMode={Platform.OS === "android" ? "center" : "contain"}
                source={require("../assets/logoHead.png")}
                style={
                  Platform.OS === "android"
                    ? { height: 100 }
                    : { height: "100%" }
                }
              />
            ) : (
              <Text style={Styles.title}>Fitness Journey</Text>
            ),
          headerRight: () =>
            params.index === undefined || params.index !== 1 ? (
              <Pressable onPress={() => params.sharedButton()}>
                <Icon
                  name="share-social"
                  size={22}
                  color={SignUpColor}
                  style={GlobalStyles.backIcon}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  navigation.navigate("Followers");
                }}
                activeOpacity={1}>
                <Image
                  style={{ width: 28, height: 28, marginRight: 13 }}
                  source={oFollowImage}
                />
              </Pressable>
            ),
        };
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={() => {
                navigation.navigate("Home");
              }}
              style={GlobalStyles.backIcon}
            />
          ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Settings</Text>,
        };
      },
    },
    Blocks: {
      screen: Blocks,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={() => {
                navigation.goBack();
              }}
              style={GlobalStyles.backIcon}
            />
          ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Blocked users</Text>,
        };
      },
    },
    ShowJourney: {
      screen: ShowJourney,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={params.goBack}
              style={GlobalStyles.backIcon}
            />
          ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Journey</Text>,
        };
      },
    },
    Followers: {
      screen: Followers,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerLeft: (
            <Icon
              name={"arrow-back"}
              color={SignUpColor}
              size={30}
              onPress={() => {
                params.navigateBack();
              }}
              style={GlobalStyles.backIcon}
            />
          ),
          headerTitleAlign: Styles.titleAlign,
          headerTitle: () => <Text style={Styles.title}>Settings</Text>,
        };
      },
    },
  },
  {
    initialRouteName: "Home",
  }
);

const Profile = createStackNavigator({
  ProfileViewDetailsProfile: {
    screen: ProfileView,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: <DrawerButton navigation={navigation} />,
        headerRight: () => (
          <Pressable
            onPress={params.redirectEdit}
            style={[GlobalModal.buttonClose, Styles.headerRight]}>
            <Icon
              name="create"
              size={20}
              color={SignUpColor}
              style={Styles.margin}
            />
            <Text style={GlobalModal.titleClose}>Edit</Text>
          </Pressable>
        ),
        headerTitleAlign: Styles.titleAlign,
        gesturesEnabled: false,
        headerTitle: () => <Text style={Styles.title}>User Profile</Text>,
      };
    },
  },
  ProfileEditDetails: {
    screen: ProfileEdit,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
            style={GlobalStyles.backIcon}
          />
        ),
        headerRight: () => (
          <Pressable
            onPress={params.saveProfile}
            style={[GlobalModal.buttonClose, Styles.headerRight]}>
            <Icon
              name="checkmark"
              size={20}
              color={SignUpColor}
              style={Styles.margin}
            />
            <Text style={GlobalModal.titleClose}>Save</Text>
          </Pressable>
        ),
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>My Profile</Text>,
      };
    },
  },
  ShowJourneyMyProfile: {
    screen: ShowJourney,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={params.goBack}
            style={GlobalStyles.backIcon}
          />
        ),
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Journey</Text>,
      };
    },
  },
  ProfileViewDetailsUser: {
    screen: ProfileViewHome,
    navigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
            style={GlobalStyles.backIcon}
          />
        ),
        headerTitleAlign: Styles.titleAlign,
        gesturesEnabled: false,
        headerTitle: () => <Text style={Styles.title}>User Profile</Text>,
      };
    },
  },
  Followers: {
    screen: Followers,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={() => {
              params.navigateBack();
            }}
            style={GlobalStyles.backIcon}
          />
        ),
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Settings</Text>,
      };
    },
  },
});

const NotificationsStack = createStackNavigator({
  ListNotifications: {
    screen: ListNotifications,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: <DrawerButton navigation={navigation} />,
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Notifications</Text>,
        headerRight: () => (
          <Pressable
            onPress={params.deleteAll}
            style={[GlobalModal.buttonClose, Styles.headerRight]}>
            <Icon
              name="trash-outline"
              size={24}
              color={SignUpColor}
              style={Styles.margin}
            />
          </Pressable>
        ),
        gesturesEnabled: false,
      };
    },
  },
  MyPalsListNotifications: {
    screen: MyPalsList,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Icon
          name={"arrow-back"}
          color={SignUpColor}
          size={30}
          onPress={() => {
            navigation.goBack();
          }}
          style={GlobalStyles.backIcon}
        />
      ),
      headerRight: <Text style={GlobalStyles.backIcon}></Text>,
      gesturesEnabled: false,
      headerTitleAlign: Styles.titleAlign,
      headerTitle: () => <Text style={Styles.title}>My Pals</Text>,
    }),
  },
  ShowJourney: {
    screen: ShowJourney,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={params.goBack}
            style={GlobalStyles.backIcon}
          />
        ),
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Journey</Text>,
      };
    },
  },
  ProfileViewDetails: {
    screen: ProfileViewHome,
    navigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
            style={GlobalStyles.backIcon}
          />
        ),
        headerTitleAlign: Styles.titleAlign,
        gesturesEnabled: false,
        headerTitle: "",
        headerTitle: () => <Text style={Styles.title}>User Profile</Text>,
      };
    },
  },
});

const MyPalsStack = createStackNavigator({
  MyPals: {
    screen: MyPalsList,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: <DrawerButton navigation={navigation} />,
        headerTitleAlign: Styles.titleAlign,
        gesturesEnabled: false,
        headerTitle: () => <Text style={Styles.title}>My Pals</Text>,
      };
    },
  },
  ShowJourney: {
    screen: ShowJourney,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={params.goBack}
            style={GlobalStyles.backIcon}
          />
        ),
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Journey</Text>,
      };
    },
  },
  ProfileViewDetails: {
    screen: ProfileViewHome,
    navigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            name={"arrow-back"}
            color={SignUpColor}
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
            style={GlobalStyles.backIcon}
          />
        ),
        gesturesEnabled: false,
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>User Profile</Text>,
      };
    },
  },
});

const JourneyStack = createStackNavigator({
  JourneyCreate: {
    screen: JourneyCreate,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerLeft: <DrawerButton navigation={navigation} />,
        headerRight: (
          <Pressable
            onPress={params.navigateBack}
            style={[GlobalModal.buttonClose, Styles.headerRight]}>
            <Text style={GlobalModal.titleClose}>Cancel</Text>
          </Pressable>
        ),
        gesturesEnabled: false,
        headerTitleAlign: Styles.titleAlign,
        headerTitle: () => <Text style={Styles.title}>Creating Journey</Text>,
      };
    },
  },
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Notifications: NotificationsStack,
    Add: JourneyStack,
    MyPals: MyPalsStack,
    MyProfile: Profile,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        let sIconName = null;
        switch (navigation.state.routeName) {
          case "Home":
            sIconName = "home";
            break;
          case "Notifications":
            sIconName = "notifications";
            break;
          case "Add":
            sIconName = "add";
            break;
          case "MyPals":
            sIconName = "ios-people";
            break;
          case "MyProfile":
            sIconName = "ios-person";
            break;
          default:
            break;
        }
        if (null !== sIconName) {
          return (
            <View
              style={[
                Styles.iconContainer,
                {
                  borderTopWidth: tintColor === SignUpColor ? 1 : 0,
                  borderTopColor: tintColor,
                },
              ]}>
              <Icon name={sIconName} size={28} color={tintColor} />
            </View>
          );
        } else {
          return false;
        }
      },
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: SignUpColor,
    },
    initialRouteName: "Home",
  }
);

const NavigationLogged = createStackNavigator(
  {
    Routes: {
      screen: TabNavigator,
      navigationOptions: {
        header: null,
        drawerLockMode: "locked-open",
      },
    },
  },
  {
    initialRouteName: "Routes",
    headerLayoutPreset: "center",
    defaultNavigationOptions: ({ navigation }) => ({
      drawerLockMode: "locked-open",
      headerLeft: (
        <Icon
          name={"arrow-back"}
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

const DrawerLogged = createDrawerNavigator(
  {
    NavigationLogged: {
      screen: NavigationLogged,
    },
  },
  {
    contentComponent: LoggedSideMenu,
    drawerType: "back",
  }
);

export default createAppContainer(DrawerLogged);

const Styles = StyleSheet.create({
  title: {
    fontWeight: "600",
    fontSize: 17,
  },
  titleAlign: {
    alignSelf: "center",
  },
  margin: {
    marginRight: 2,
  },
  headerRight: {
    flexDirection: "row",
    right: 0,
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
