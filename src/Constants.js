/**
 * Application version number, it will appear on the login and settings screens
 */
// Constant that determines the application environment
export const APP_VERSION = "v1.2.9.26";
// Constant that being debug in True, determines that test environment is used, if True is used by localhost
export const DEBUG = false;
const LOCAL_ENVIRONMENT = false;

// third party integration keys 
export const SEGMENT_WRITE_KEY = "0rhZPc61Cf2A3B09SFqdhrDydbUr0DBT";
export const SENTRY_DNS = "https://982cc31971cd4d48ad5ec746c965eda6@o1335969.ingest.sentry.io/6604329";

// URLS OF SERVICES
const sURLServiceProd = "https://appfitrec.com/1.2.9.24/app/";
const sURLServiceDemo = LOCAL_ENVIRONMENT
  ? "http://169.254.220.186/new_fitrec_api/app/"
  : "https://appfitrec.com/fitrec_demo/app/";
// Firebase configuration in production environment
const oFirebaseConfigProd = {
  apiKey: "AIzaSyCbIHI-d9JIH7CoyN717RHw4hDqNOScHkA",
  authDomain: "fitrec-ac664.firebaseapp.com",
  databaseURL: "https://fitrec-ac664.firebaseio.com",
  projectId: "fitrec-ac664",
  storageBucket: "fitrec-ac664.appspot.com",
  messagingSenderId: "848792304762",
  NODE_ACCOUNTS_DB: "accounts/",
  NODE_CONVERSATIONS_DB: "conversations/",
  NODE_CONVERSATIONS_GROUPS_DB: "conversationsGroups/",
  NODE_GROUPS_DB: "groups/",
};
// Firebase configuration in testing environment
const oFirebaseConfigDemo = {
  apiKey: "AIzaSyBBdTNi-aD--yo7lxMP9Qb8W7AQGSErI0I",
  authDomain: "fitrec-new.firebaseapp.com",
  databaseURL: "https://fitrec-new.firebaseio.com",
  projectId: "fitrec-new",
  storageBucket: "fitrec-new.appspot.com",
  messagingSenderId: "727544896443",
  appId: "1:727544896443:android:36139497a1e8bded6b429e",
  NODE_ACCOUNTS_DB: "accounts/",
  NODE_CONVERSATIONS_DB: "conversations/",
  NODE_CONVERSATIONS_GROUPS_DB: "conversationsGroups/",
  NODE_GROUPS_DB: "groups/",
};
// Giphy configuration (testing or production does not influence this configuration)
const aGiphyConfig = {
  apiKey: "dNSSOHPqV1JGa8DsRHU0jBLlG8zHEMff",
  urlGifs: "https://api.giphy.com/v1/gifs/search",
  urlStickers: "https://api.giphy.com/v1/stickers/search",
  limit: 21,
  rating: "g",
  searchDefault: "fitness",
};
// System constants
export const Constants = {
  URL_SERVICE: !DEBUG ? sURLServiceProd : sURLServiceDemo,
  FIREBASE_CONFIG: !DEBUG ? oFirebaseConfigProd : oFirebaseConfigDemo,
  GIPHY_CONFIG: aGiphyConfig,

  LIMIT_MESSAGES: 25,
};
/**
 * Types of reports that exist in the application
 */
export const REPORT_USER_TYPE = 1;
export const REPORT_JOURNEY_TYPE = 2;
/**
 * General error message in case of errors not taken
 */
export const MESSAGE_ERROR = "An error occurred, please try again later";
/**
 * Configuration for profile images, in this way they will cut in the same way
 */
export const OPTIONS_IMAGE_CROP_PROFILE = {
  cropping: true,
  width: 800,
  height: 800,
  includeBase64: true,
  forceJpg: true,
  cropperCircleOverlay: true,
  freeStyleCropEnabled: true,
  compressImageQuality: 0.5,
  writeTempFile: false,
};
/**
 * Configuration for the cut of the images that are sent by chat, in this way all the images are sent with the same configuration
 */
export const OPTIONS_IMAGE_CROP_CONVERSATION = {
  loadingLabelText: "Upload File",
  cropping: true,
  width: 800,
  height: 800,
  includeBase64: true,
  forceJpg: true,
  mediaType: "images",
};
/**
 * Configuration required by a Timeout at the time of obtaining the geographical position of the device
 */
export const OPTIONS_GEOLOCATION_GET_POSITION = {
  timeout: 3000,
  maximumAge: 3000,
};
/**
 * Types of notifications used
 */
export const NOTIFICATION_SEND_REQUEST = 1;
export const NOTIFICATION_REQUEST_GROUP = 2;
export const NOTIFICATION_CAPITAN_MESSAGE_GROUP = 3;
export const NOTIFICATION_INVITATION_GROUP = 4;
export const NOTIFICATION_TYPE_LIKE_JOURNEY = 5;
export const NOTIFICATION_TYPE_TAG_JOURNEY = 6;
export const NOTIFICATION_TYPE_GROUP_CHAT = 7;
export const NOTIFICATION_TYPE_NEW_FOLLOWER = 8;
export const NOTIFICATION_TYPE_NEW_CAPTAIN = 9;
/**
 * Types of messages sent in the chats
 */
export const SEND_MESSAGE_TYPES = {
  TEXT: "text",
  LOCATION: "location",
  GIF: "gif",
  IMAGE: "image",
};
/**
 * Types of files that will be displayed in the Journeys and Stories
 */
export const POST_TYPE_IMAGE = 0;
export const POST_TYPE_VIDEO = 1;

export const Actions = {
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
  USER_LOGIN_ERROR: "USER_LOGIN_ERROR",
  USER_LOGIN_CREATE_ACCOUNT: "USER_LOGIN_CREATE_ACCOUNT",
  USER_LOGOUT_SUCCESS: "USER_LOGOUT_SUCCESS",
  USER_LOGOUT_ERROR: "USER_LOGOUT_ERROR",
  USER_REGISTER_VALIDATE_SUCCESS: "USER_REGISTER_VALIDATE_SUCCESS",
  USER_REGISTER_VALIDATE_ERROR: "USER_REGISTER_VALIDATE_ERROR",
  GET_ALL_ACTIVITIES_SUCCESS: "GET_ALL_ACTIVITIES_SUCCESS",
  GET_ALL_ACTIVITIES_ERROR: "GET_ALL_ACTIVITIES_ERROR",
  USER_IS_LOGGED_SUCCESS: "USER_IS_LOGGED_SUCCESS",
  USER_IS_LOGGED_ERROR: "USER_IS_LOGGED_ERROR",
  USER_REGISTER_SUCCESS: "USER_REGISTER_SUCCESS",
  USER_REGISTER_ERROR: "USER_REGISTER_ERROR",
  USER_FORGOT_SUCCESS: "USER_FORGOT_SUCCESS",
  USER_FORGOT_ERROR: "USER_FORGOT_ERROR",
  GET_USER_HOME_SUCCESS: "GET_USER_HOME_SUCCESS",
  GET_USER_HOME_ERROR: "GET_USER_HOME_ERROR",
  GET_USER_PROFILE_HOME_SUCCESS: "GET_USER_PROFILE_HOME_SUCCESS",
  GET_USER_PROFILE_HOME_ERROR: "GET_USER_PROFILE_HOME_ERROR",
  SEND_MESSAGE_SUCCESS: "SEND_MESSAGE_SUCCESS",
  SEND_MESSAGE_ERROR: "SEND_MESSAGE_ERROR",
  GET_USER_PROFILE_SUCCESS: "GET_USER_PROFILE_SUCCESS",
  GET_USER_PROFILE_ERROR: "GET_USER_PROFILE_ERROR",
  UPDATE_USER_PROFILE_SUCCESS: "UPDATE_USER_PROFILE_SUCCESS",
  UPDATE_USER_PROFILE_ERROR: "UPDATE_USER_PROFILE_ERROR",
  CLEAN_PROFILE: "CLEAN_PROFILE",
  GET_LIST_MESSAGES_SUCCESS: "GET_LIST_MESSAGES_SUCCESS",
  GET_LIST_MESSAGES_ERROR: "GET_LIST_MESSAGES_ERROR",
  GET_COUNT_MESSAGES_READ_SUCCESS: "GET_COUNT_MESSAGES_READ_SUCCESS",
  GET_COUNT_MESSAGES_READ_GROUP_SUCCESS:
    "GET_COUNT_MESSAGES_READ_GROUP_SUCCESS",
  GET_LIST_USER_FRIENDS_SUCCESS: "GET_LIST_USER_FRIENDS_SUCCESS",
  CREATE_GROUP_SUCCESS: "CREATE_GROUP_SUCCESS",
  CLEAN_CREATE_GROUP: "CLEAN_CREATE_GROUP",
  CREATE_GROUP_ERROR: "CREATE_GROUP_ERROR",
  GET_MY_FRIENDS_LISENER: "GET_MY_FRIENDS_LISENER",
  GET_MY_FRIENDS_SUCCESS: "GET_MY_FRIENDS_SUCCESS",
  GET_MY_FRIENDS_ERROR: "GET_MY_FRIENDS_ERROR",
  GET_REQUEST_SENT_SUCCESS: "GET_REQUEST_SENT_SUCCESS",
  GET_REQUEST_RECIVED_SUCCESS: "GET_REQUEST_RECIVED_SUCCESS",
  RESET_ACTION_STATE: "RESET_ACTION_STATE",
  GET_PEOPLE_FITREC_SUCCESS: "GET_PEOPLE_FITREC_SUCCESS",
  SEND_REQUEST_FRIEND_SUCCESS: "SEND_REQUEST_FRIEND_SUCCESS",
  SEND_REQUEST_FRIEND_ERROR: "SEND_REQUEST_FRIEND_ERROR",
  ACCEPT_REQUEST_FRIEND_SUCCESS: "ACCEPT_REQUEST_FRIEND_SUCCESS",
  ACCEPT_REQUEST_FRIEND_ERROR: "ACCEPT_REQUEST_FRIEND_ERROR",
  CANCEL_REQUEST_FRIEND_SUCCESS: "CANCEL_REQUEST_FRIEND_SUCCESS",
  CANCEL_REQUEST_FRIEND_ERROR: "CANCEL_REQUEST_FRIEND_ERROR",
  GET_CONVERSATION_WITH_FRIEND_SUCCESS: "GET_CONVERSATION_WITH_FRIEND_SUCCESS",
  UNFOLLOW_PAL_SUCCESS: "UNFOLLOW_PAL_SUCCESS",
  UNFOLLOW_PAL_ERROR: "UNFOLLOW_PAL_ERROR",
  SEND_CONTACT_US_SUCCESS: "SEND_CONTACT_US_SUCCESS",
  SEND_CONTACT_US_ERROR: "SEND_CONTACT_US_ERROR",
  DESACTIVATE_ACCOUNT_ERROR: "DESACTIVATE_ACCOUNT_ERROR",
  GET_JOURNEY_LIST_SUCCESS: "GET_JOURNEY_LIST_SUCCESS",
  GET_JOURNEY_LIST_ERROR: "GET_JOURNEY_LIST_ERROR",
  ADD_LIKE_SUCCESS: "ADD_LIKE_SUCCESS",
  ADD_LIKE_ERROR: "ADD_LIKE_ERROR",
  CREATE_JOURNEY_SUCCESS: "CREATE_JOURNEY_SUCCESS",
  CREATE_JOURNEY_ERROR: "CREATE_JOURNEY_ERROR",
  GET_NOTIFICATION_SUCCESS: "GET_NOTIFICATION_SUCCESS",
  UPDATE_GRUPS_LIST: "UPDATE_GRUPS_LIST",
  JOIN_GROUP_SUCCESS: "JOIN_GROUP_SUCCESS",
  GET_GROUPS: "GET_GROUPS",
  LEAVE_GROUPS_SUCCESS: "LEAVE_GROUPS_SUCCESS",
  REQUEST_JOIN_GROUP: "REQUEST_JOIN_GROUP",
  ADD_MEMBERS_GROUP: "ADD_MEMBERS_GROUP",
  SEND_REQUEST_FRIEND_HOME_SUCCESS: "SEND_REQUEST_FRIEND_HOME_SUCCESS",
  SEND_REQUEST_FRIEND_HOME_ERROR: "SEND_REQUEST_FRIEND_HOME_ERROR",
  UNFOLLOW_PAL_HOME_SUCCESS: "UNFOLLOW_PAL_HOME_SUCCESS",
  UNFOLLOW_PAL_HOME_ERROR: "UNFOLLOW_PAL_HOME_ERROR",
  RESET_ACTION_STATE_HOME: "RESET_ACTION_STATE_HOME",
  OPEN_GROUP_NOTIFICATION: "OPEN_GROUP_NOTIFICATION",
  RESET_OPEN_GROUP: "RESET_OPEN_GROUP",
  REJECT_INVITATION_GROUP_SUCCESS: "REJECT_INVITATION_GROUP_SUCCESS",
  RESET_INVITATION_GROUP: "RESET_INVITATION_GROUP",
  ACCEPT_INVITATION_GROUP_SUCCESS: "ACCEPT_INVITATION_GROUP_SUCCESS",
  ACCEPT_INVITATION_GROUP_ERROR: "ACCEPT_INVITATION_GROUP_ERROR",
  REMOVE_TAG_USER_SUCCESS: "REMOVE_TAG_USER_SUCCESS",
  REMOVE_TAG_USER_ERROR: "REMOVE_TAG_USER_ERROR",
  ADD_TAG_USER_SUCCESS: "ADD_TAG_USER_SUCCESS",
  ADD_TAG_USER_ERROR: "ADD_TAG_USER_ERROR",
  DELETE_JOURNEY_SUCCESS: "DELETE_JOURNEY_SUCCESS",
  DELETE_JOURNEY_ERROR: "DELETE_JOURNEY_ERROR",
  UPDATE_TEXT_JOURNEY_SUCCESS: "UPDATE_TEXT_JOURNEY_SUCCESS",
  UPDATE_TEXT_JOURNEY_ERROR: "UPDATE_TEXT_JOURNEY_ERROR",
  GET_JOURNEY_SUCCESS: "GET_JOURNEY_SUCCESS",
  ACTION_MESSAGE: "ACTION_MESSAGE",
  ACTION_ACCEPT_REQUEST_SUCCESS: "ACTION_ACCEPT_REQUEST_SUCCESS",
  GET_JOURNEY_ERROR: "GET_JOURNEY_ERROR",
  GET_LIKES_SUCCESS: "GET_LIKES_SUCCESS",
  GET_LIKES_ERROR: "GET_LIKES_ERROR",
  SEND_NOTIFICATION_CAPITAN_SUCCESS: "SEND_NOTIFICATION_CAPITAN_SUCCESS",
  SEND_NOTIFICATION_CAPITAN_ERROR: "SEND_NOTIFICATION_CAPITAN_ERROR",
  SEND_MESSAGE_GROUP_SUCCESS: "SEND_MESSAGE_GROUP_SUCCESS",
  GET_GROUP_INVITATIONS_SUCCESS: "GET_GROUP_INVITATIONS_SUCCESS",
  GET_GROUP_INVITATIONS_PALS_SUCCESS: "GET_GROUP_INVITATIONS_PALS_SUCCESS",
  SET_OBSERVABLE_PROFILE: "SET_OBSERVABLE_PROFILE",
  UPDATE_GROUP_ERROR: "UPDATE_GROUP_ERROR",
  RESET_UPDATE_GROUP: "RESET_UPDATE_GROUP",
  CLEAN_MESSAGE_LOGIN: "CLEAN_MESSAGE_LOGIN",
  CREATE_CHAT_GROUP: "CREATE_CHAT_GROUP",
  MESSAGE: "MESSAGE",
  DEACTIVATE_LOADING: "DEACTIVATE_LOADING",
  ACTIVE_LOADING: "ACTIVE_LOADING",
  GIFS: "GIFS",
  STICKERS: "STICKERS",
  GET_GROUP: "GET_GROUP",
  GET_GROUP_DETAILS: "GET_GROUP_DETAILS",
  GROUP_DETAILS_READ_MESSAGES: "GROUP_DETAILS_READ_MESSAGES",
  GET_GROUP_DETAILS_MESSAGES: "GET_GROUP_DETAILS_MESSAGES",
  UPDATE_GROUP_NEAR_ME: "UPDATE_GROUP_NEAR_ME",
  GET_GROUP_NOTIFICATION: "GET_GROUP_NOTIFICATION",
  GET_GYMS: "GET_GYMS",
  EXPAND_IMAGE: "EXPAND_IMAGE",
  DISMISS_IMAGE: "DISMISS_IMAGE",
  CLEAN: "CLEAN",
  GET_JOURNEY: "GET_JOURNEY",
  CLEAN_JOURNEY: "CLEAN_JOURNEY",
  // Actions for Stories
  GET_STORIES: "GET_STORIES",
  EXPAND_STORY: "EXPAND_STORY",
  UPDATE_PROGRESS_STORY: "UPDATE_PROGRESS_STORY",
  PREVIEW_STORY: "PREVIEW_STORY",
  NEXT_STORY: "NEXT_STORY",
  PREVIOUS_STORY: "PREVIOUS_STORY",
  STOP_STORY: "STOP_STORY",
  RESET_CONTROLS: "RESET_CONTROLS",
  RESET_CONTROLS_STORIES: "RESET_CONTROLS_STORIES",
  STORY_ACTION_VIEW: "STORY_ACTION_VIEW",
  STORY_ACTION_UPLOAD: "STORY_ACTION_UPLOAD",
  STORY_ACTION_RESET: "STORY_ACTION_RESET",
  // Actions for Followers
  FOLLOWERS: "FOLLOWERS",
  FOLLOWING: "FOLLOWING",
  // BLOCK ACTIONS
  BLOCK_USER: "BLOCK_USER",
  CLEAN_BLOCK_USER: "CLEAN_BLOCK_USER",
  BLOCKS: "BLOCKS",
  // Actions for Messages
  SET_CONVERSATION: "SET_CONVERSATION",
  SET_CONVERSATION_KEY: "SET_CONVERSATION_KEY",
  GET_CONVERSATION: "GET_CONVERSATION",
  // Action for Navigation
  NAVIGATION_CLEAN: "NAVIGATION_CLEAN",
  NAVIGATE_NOTIFICATIONS_TO_PALS: "NAVIGATE_NOTIFICATIONS_TO_PALS",
  NAVIGATE_HOME: "NAVIGATE_HOME",
  NAVIGATE_JOURNEYS: "NAVIGATE_JOURNEYS",
  NAVIGATE_CONVERSATION_LIST_MESSAGE: "NAVIGATE_CONVERSATION_LIST_MESSAGE",
  NAVIGATE_GROUP: "NAVIGATE_GROUP",
  NAVIGATE_NOTIFICATIONS: "NAVIGATE_NOTIFICATIONS",
};

export const lActivitiesIcon = [
  { name: "Baseball", icon: require("./assets/activities/Baseball.png") },
  { name: "Basketball", icon: require("./assets/activities/Basketball.png") },
  {
    name: "Calisthenics",
    icon: require("./assets/activities/Calisthenics.png"),
  },
  { name: "CrossFit", icon: require("./assets/activities/CrossFit.png") },
  { name: "Cycling", icon: require("./assets/activities/Cycling.png") },
  { name: "Disc Golf", icon: require("./assets/activities/DiscGolf.png") },
  {
    name: "Flag Football",
    icon: require("./assets/activities/FlagFootball.png"),
  },
  {
    name: "American Football",
    icon: require("./assets/activities/AmericanFootball.png"),
  },
  { name: "Golf", icon: require("./assets/activities/Golf.png") },
  { name: "Hiking", icon: require("./assets/activities/Hiking.png") },
  { name: "Hockey", icon: require("./assets/activities/Hockey.png") },
  { name: "Kickball", icon: require("./assets/activities/Kickball.png") },
  { name: "Lacrosse", icon: require("./assets/activities/Lacrosse.png") },
  { name: "Racquetball", icon: require("./assets/activities/Racquetball.png") },
  {
    name: "Rock Climbing",
    icon: require("./assets/activities/RockClimbing.png"),
  },
  { name: "Rowing", icon: require("./assets/activities/Rowing.png") },
  { name: "Running", icon: require("./assets/activities/Running.png") },
  { name: "Soccer", icon: require("./assets/activities/Soccer.png") },
  { name: "Softball", icon: require("./assets/activities/Softball.png") },
  {
    name: "Snowboarding",
    icon: require("./assets/activities/Snowboarding.png"),
  },
  { name: "Skiing", icon: require("./assets/activities/Skiing.png") },
  { name: "Swimming", icon: require("./assets/activities/Swimming.png") },
  { name: "Tennis", icon: require("./assets/activities/Tennis.png") },
  {
    name: "Ultimate Frisbee",
    icon: require("./assets/activities/UltimateFrisbee.png"),
  },
  { name: "Volleyball", icon: require("./assets/activities/Volleyball.png") },
  { name: "Walking", icon: require("./assets/activities/Walking.png") },
  {
    name: "Weight Lifting",
    icon: require("./assets/activities/WeightLifting.png"),
  },
  { name: "Yoga", icon: require("./assets/activities/Yoga.png") },
  { name: "Surfing", icon: require("./assets/activities/Surfing.png") },
  { name: "Dance", icon: require("./assets/activities/Dance.png") },
  { name: "Skating", icon: require("./assets/activities/Skating.png") },
];

export const lActivitiesHome = [
  { name: "Baseball", img: require("./assets/homeactivities/Baseball.png") },
  {
    name: "Basketball",
    img: require("./assets/homeactivities/Basketball.png"),
  },
  {
    name: "Calisthenics",
    img: require("./assets/homeactivities/Calisthenics.png"),
  },
  { name: "CrossFit", img: require("./assets/homeactivities/CrossFit.png") },
  { name: "Cycling", img: require("./assets/homeactivities/Cycling.png") },
  { name: "Disc Golf", img: require("./assets/homeactivities/DiscGolf.png") },
  {
    name: "Flag Football",
    img: require("./assets/homeactivities/FlagFootball.png"),
  },
  {
    name: "American Football",
    img: require("./assets/homeactivities/AmericanFootball.png"),
  },
  { name: "Golf", img: require("./assets/homeactivities/Golf.png") },
  { name: "Hiking", img: require("./assets/homeactivities/Hiking.png") },
  { name: "Hockey", img: require("./assets/homeactivities/Hockey.png") },
  // { name: 'Kickball', img: require('./assets/homeactivities/Kickball.png') },
  { name: "Lacrosse", img: require("./assets/homeactivities/Lacrosse.png") },
  {
    name: "Racquetball",
    img: require("./assets/homeactivities/Racquetball.png"),
  },
  {
    name: "Rock Climbing",
    img: require("./assets/homeactivities/RockClimbing.png"),
  },
  { name: "Rowing", img: require("./assets/homeactivities/Rowing.png") },
  { name: "Running", img: require("./assets/homeactivities/Running.png") },
  { name: "Soccer", img: require("./assets/homeactivities/Soccer.png") },
  { name: "Softball", img: require("./assets/homeactivities/Softball.png") },
  {
    name: "Snowboarding",
    img: require("./assets/homeactivities/Snowboarding.png"),
  },
  { name: "Skiing", img: require("./assets/homeactivities/Skiing.png") },
  { name: "Swimming", img: require("./assets/homeactivities/Swimming.png") },
  { name: "Tennis", img: require("./assets/homeactivities/Tennis.png") },
  {
    name: "Ultimate Frisbee",
    img: require("./assets/homeactivities/UltimateFrisbee.png"),
  },
  {
    name: "Volleyball",
    img: require("./assets/homeactivities/Volleyball.png"),
  },
  { name: "Walking", img: require("./assets/homeactivities/Walking.png") },
  // { name: 'Weight Lifting', img: require('./assets/homeactivities/WeightLifting.png') },
  { name: "Yoga", img: require("./assets/homeactivities/Yoga.png") },
  { name: "Surfing", img: require("./assets/homeactivities/Surfing.png") },
  { name: "Dance", img: require("./assets/homeactivities/Dance.png") },
  { name: "Dancer", img: require("./assets/homeactivities/Dancer.png") },
  { name: "Skating", img: require("./assets/homeactivities/Skating.png") },
  { name: "Football", img: require("./assets/homeactivities/Football.png") },
  { name: "Surfer", img: require("./assets/homeactivities/Surfer.png") },
  { name: "Ultimate", img: require("./assets/homeactivities/Ultimate.png") },
];

export const lHeightSizes = [
  "4’  0’’",
  "4’  1’’",
  "4’  2’’",
  "4’  3’’",
  "4’  4’’",
  "4’  5’’",
  "4’  6’’",
  "4’  7’’",
  "4’  8’’",
  "4’  9’’",
  "5’  0’’",
  "5’  1’’",
  "5’  2’’",
  "5’  1’’",
  "5’  2’’",
  "5’  3’’",
  "5’  4’’",
  "5’  5’’",
  "5’  6’’",
  "5’  7’’",
  "5’  8’’",
  "5’  9’’",
  "5’  10’",
  "5’  11’",
  "6’  0’’",
  "6’  1’’",
  "6’  2’’",
  "6’  3’’",
  "6’  4’’",
  "6’  5’’",
  "6’  6’’",
  "6’  7’’",
  "6’  8’’",
  "6’  9’’",
  "6’  10’",
  "6’  11’",
  "7’  1’’",
  "7’  2’’",
  "7’  3’’",
  "7’  4’’",
  "7’  5’’",
  "7’  6’’",
  "7’  7’’",
  "7’  8’’",
  "7’  9’’",
];
