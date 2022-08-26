# FitRec

This is the most recent code for the mobile app. Still under development and not yet deployed

For the code relating to the FitRec mobile app found on [Google Play](https://play.google.com/store/apps/details?id=com.fitrecApp) and [Apple App Store](https://apps.apple.com/us/app/fitrec/id1183833997), see [this code base](https://bitbucket.org/dynamiadevelopment/fitrec_app/src/master/)

Spreadsheet with info on logins for integrations as well as environment variables [here](https://docs.google.com/spreadsheets/d/1CvFgbtMvmq8yYRkGd4xm1KVt0Wa1X9K8iySVb1Uixho/edit#gid=0) [email fitrecapp.config@gmail.com for access]

## Main Technologies Used

- [React Native (v0.68.2)](https://reactnative.dev/) --> A framework for building native apps with React.
- [Redux](https://redux.js.org/introduction/getting-started) --> Redux is a predictable state container for JavaScript apps.
- [React Native Elements](https://reactnativeelements.com/) --> Cross Platform Native UI Toolkit.
- [React Navigation](https://github.com/react-navigation/react-navigation) --> React Navigation for app routes.

## System Requirements

- **Node Version** >= 16.15.0
- **NPM Version** >= 8.5.5
- **YARN Version** >= 1.22.18
- **CocoaPods Version** >= 1.11.3
- **Xcode Version** >= 13.4.1

## Getting set up

Follow these steps to get up and running with this repo after you've cloned it locally

### Install dependencies with yarn

`yarn install`

### Install Cocoapods dependencies for iOS app

`cd ios && pod install`

## Application Folder Structure

The application have the standard folder structure that is been used in most of the react native apps.

- **src** -> This folder is the main container of all the code inside your application
  - **actions** -> This folder contains all the actions that can be dispatched to redux
  - **assets** -> This folder contains all the assets i.e (images, vector icons etc.)
  - **components** -> This folder contains all of the common components that are been used throughout in app.
  - **constants** -> This folder contains the global constants that will be used in overall application.
  - **redux** -> This folder should have all your reducers, and with relevant actions of redux setup
  - **routes** -> Folder that contains all navigation setup for app, Side Menu and Bottom Tab.
  - **screens** -> Folder that contains all your application screens/features.
  - **store** -> Folder to put all redux middleware and the store.
  - **App.js** -> Main component that starts your whole app.
  - **Constants.js** -> File that contains all constants used in ap even action types for redux
  - **Styles.js** -> File containing general styles for all over the app.
  - **index.js** -> Entry point of your application as per React-Native standards.

## Dependencies/Library Usage

We have use the following third party libraries for several other features.

### Design System

> For UI components like checkbox, button etc.
> [react-native-elements](https://github.com/react-native-elements/react-native-elements) ==> use for UI base components like checkbox etc.

### Navigation

> For navigation routes for screen transitions

- [react-navigation](https://github.com/react-navigation/react-navigation) ==> use for app navigation
- [react-navigation-drawer](https://github.com/react-navigation/drawer) ==> use for drawer (side menu) navigation setup
- [react-navigation-stack](https://github.com/react-navigation/stack) ==> use for stack navigation
- [react-navigation-tabs](https://github.com/react-navigation/tabs) ==> use for Bottom tab navigations
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler),
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context),[react-native-screens](https://github.com/software-mansion/react-native-screens) ==> use for native navigation dependency

### Authentications

> For apple and facebook sign in authentication

- [react-native-apple-authentication](https://github.com/invertase/react-native-apple-authentication) ==> use for apple login
- [react-native-fbsdk](https://github.com/facebookarchive/react-native-fbsdk) ==> use for facebook integration

### Network (Rest APIs calls)

> For calling REST Apis

- [axios](https://github.com/axios/axios) ==> use for APIs setup

### Local State Managment

> For local state management for components

- [react-redux](https://github.com/reduxjs/react-redux) ==> use for state management just like redux toolkit

### Video Player & Encoding Libraries

> For video players and encoding libraries

- [ffmpeg-kit-react-native](https://github.com/tanersener/ffmpeg-kit) ==> use for changing video file format of app
- [react-native-video](https://github.com/react-native-video/react-native-video) ==> use for video playing in video player for app

### Code Prettier Library

> For code formatting and linting

- [prettier](https://github.com/prettier/prettier) ==> use for code formatting

### Remote Notifications

OneSignal is our provider of push notifications, when sending a notification from the APP, data referring to the origin of the notification must be sent, below are the types of notifications, what they mean, what the application must do and what data they navigate for the same.

- **Notifications for message**
  - Notification type for messages, the application should guide the user to the list of messages.
    - `id`: Key of the conversation
  - Notification type for group message, the application should guide the user to the list of groups and open the correct group.
    - `id`: Key of the group
- **Notifications for invitations**
  - Notification received when a user sends a friend request to another, the application should send the user (one who is the receiving) to the notification screen, identify the notification, check it and navigate to the invitations.
    - `id`: Key of the notifications
  - Notification when a user sends a request to join the group, the notification is sent to all the captains of the group, the application should send the receiving user to the groups screen and open the invitations of that group.
    - `id`: Key of the group
  - Notification when a captain sends a request to join the party to a user, the app should send the receiving user to the party screen and open party invites.
- **Direct action notifications**
  - Notification a captain sends to a group. The application should open a pop up to show the captain's notification.
    - `id`: Key of the group
    - `text`: Text of the notification
    - `name`: Name of the group
    - `capitanName`: Name of the captain
  - Notification that is sent when a tag of another user is made. The app should send the user to the notification list.

## Other Important Utils

- [rn-fetch-blob](https://github.com/joltup/rn-fetch-blob) ==> use for send or transfer data directly from/to storage without BASE64 bridging
- [react-native-youtube](https://github.com/davidohayon669/react-native-youtube) ==> use for youtube videos acess in app
- [react-native-webview](https://github.com/react-native-webview/react-native-webview) ==> use for view some website viewn in app in specific area or place
- [react-native-fs](https://github.com/itinance/react-native-fs) ==> use for Native filesystem access for react-native
- [react-native-image-crop-picker](https://github.com/ivpusic/react-native-image-crop-picker) ==> use for select picture with croping functionality from loacl storage to upload on app.
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker) ==> use for select picture from l;ocal storage.
- [react-native-maps](https://github.com/react-native-maps/react-native-maps) ==> use for show and access maps in app
- [react-native-modal](https://github.com/react-native-modal/react-native-modal) ==> use for showing modal with some UI.
- [react-native-onesignal](https://github.com/OneSignal/react-native-onesignal) ==> use for push notification
- [react-native-picker-module](https://github.com/talut/react-native-picker-module) ==> use for picker modal to choose value from the list of picker modal
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) ==> use for drawer navigation dependency
- [react-native-select-dropdown](https://github.com/AdelRedaa97/react-native-select-dropdown) ==> use for dropdown selection
- [react-native-snap-carousel](https://github.com/meliorence/react-native-snap-carousel) ==> use for carousal
- [react-native-swipe-gestures](https://github.com/glepur/react-native-swipe-gestures) ==> use for swiping gesture in UI like swipe button etc.
- [react-native-swiper](https://github.com/leecade/react-native-swiper) ==> use for swipe gesture
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) ==> use for icons of app
- [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image) ==> use for image picker from local device
- [react-native-datepicker](https://github.com/xgfe/react-native-datepicker) ==> use for selecting date
- [moment](https://github.com/moment/moment) ==> use for date & time in app
- [firebase](https://github.com/firebase/) ==> use for cloud storage and chatting module
- [react-native-picker/picker](https://github.com/react-native-picker/picker) ==> use for pick option from dropdown view
- [@react-native-community/progress-bar-android](https://github.com/react-native-progress-view/progress-bar-android) ==> use for showing progress bar
- [@react-native-community/masked-view](https://github.com/react-native-masked-view/masked-view) ==> use for color gradient of text.
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) ==> use for local storage of device to save data
- [@react-native-community/geolocation](https://github.com/michalchudziak/react-native-geolocation) ==> use for location feature for app

## Unit Tests

[todo more to add here..]
