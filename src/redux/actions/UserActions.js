import { Actions, Constants, MESSAGE_ERROR } from "../../Constants";
import {
  UserLogin,
  UserLoginFB,
  UserRegisterValidate,
  UserRegister,
  LogOut,
  ForgotPassword,
  DeleteAccount,
  SaveOneSignalCode,
} from "../services/UserServices";
import {
  oFirebase,
  authentication,
  database,
  GetUserAccount,
} from "../services/FirebaseServices";
//import AsyncStorage from '@react-native-community/async-storage';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk";
import { actionListMessages } from "./ChatActions";
import { actionGetGroups, actionGetGroupInvitations } from "./GroupActions";
// import appleAuth, {
//   AppleAuthRequestOperation,
//   AppleAuthRequestScope,
//   AppleAuthCredentialState,
//   AppleAuthError,
// } from "@invertase/react-native-apple-authentication";
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
  actionMessage,
  actionDispatch,
  actionActiveLoading,
  actionDeactivateLoading,
} from "./SharedActions";
import {
  setLoginDataLocalStorage,
  setEmptyLocalStorage,
  getLoginDataLocalStorage,
  setTokenLocalStorage,
} from "../services/StorageServices";
import {
  GetNotifications,
  ViewNotification,
} from "../services/NotificationServices";
import {
  DesactiveAccount,
  SetLocation,
  UpdateKeyProfile,
} from "../services/ProfileServices";
import { actionGetMyFriends } from "./ProfileActions";

/**
 * Login function, receives an email, a password and validates the data against the API and
 * against Firebase's authentication.
 *
 * @param {string} sUsername Username of the user you want to enter
 * @param {string} sPassword User password you want to enter
 *
 * @author Leandro Curbelo
 */
export const actionUserLogin = (sUsername, sPassword) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    UserLogin(sUsername, sPassword)
      .then(async (oSuccess) => {
        console.log("oSuccess ====>>>> ", oSuccess);
        await setTokenLocalStorage(oSuccess.data.token);
        oSuccess.data.password = sPassword;
        dispatch(actionUserLoginFirebase(oSuccess.data));
      })
      .catch((oError) => {
        dispatch(actionDeactivateLoading());
        console.log("oError ====>>>> ", oError);
        dispatch(actionMessage(oError.response.data.message));
      });
  };
};

export const actionUserLoginFirebase = (oUser) => {
  return (dispatch) => {
    let oFirebaseResult = null;
    if ("" !== oUser.key && null !== oUser.key)
      oFirebaseResult = authentication.signInWithEmailAndPassword(
        oUser.email,
        oUser.password
      );
    else
      oFirebaseResult = authentication.createUserWithEmailAndPassword(
        oUser.email,
        oUser.password
      );
    oFirebaseResult
      .then((oSuccessLogin) => {
        database
          .ref(
            Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + oSuccessLogin.user.uid
          )
          .once("value", async function (oAccountSnap) {
            if (oAccountSnap.exists()) {
              let oAccount = oAccountSnap.val();
              let oAccountData = {
                key: "",
                email: "",
                id: "",
                idPush: "",
                name: "",
                userId: "",
                username: "",
                provider: "",
                image: "",
              };
              oAccountData.key = oSuccessLogin.user.uid;
              oAccountData.active = oAccount.active;
              oAccountData.email = oAccount.email;
              oAccountData.id = oAccount.id;
              oAccountData.idPush = oAccount.idPush;
              oAccountData.name = oAccount.name;
              oAccountData.userId = oAccount.userId;
              oAccountData.username = oAccount.username;
              oAccountData.provider = oAccount.provider;
              oAccountData.image = oAccount.image;
              try {
                await setLoginDataLocalStorage({
                  account: oAccountData,
                });
              } catch (oError) { }
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  oSuccessLogin.user.uid
                )
                .update({
                  active: 1,
                  online: true,
                  lastLogin: Date(),
                });
              dispatch(actionGetMyFriends(oAccountData.key));
              dispatch(
                actionDispatch(Actions.USER_LOGIN_SUCCESS, {
                  account: oAccountData,
                })
              );
              dispatch(actionDeactivateLoading());
            } else {
              let sFitnessLevel = "";
              switch (oUser.level) {
                case "B":
                  sFitnessLevel = "Beginner";
                  break;
                case "A":
                  sFitnessLevel = "Advance";
                  break;
                case "M":
                  sFitnessLevel = "Intermediate";
                  break;
              }
              let oUserFirebase = {
                name: oUser.name,
                username: oUser.username,
                email: oUser.email,
                id: oUser.id,
                idPush: 0,
                fitnesLevel: sFitnessLevel,
                userId: oSuccessLogin.user.uid,
                dateCreated: Date(),
                provider: "Firebase",
                active: 1,
                online: true,
                lastLogin: Date(),
              };
              if (oUser.image !== null && oUser.image !== undefined)
                oUserFirebase.image = oUser.image;
              if (oUser.background !== null && oUser.background !== undefined)
                oUserFirebase.background = oUser.background;
              database
                .ref()
                .child(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                  oSuccessLogin.user.uid
                )
                .set(oUserFirebase)
                .then(async (oSuccess) => {
                  UpdateKeyProfile(oSuccessLogin.user.uid)
                    .then(() => { })
                    .catch(() => { });
                  dispatch(actionResultCreateAccount(oSuccessLogin.user.uid));
                })
                .catch(() => {
                  dispatch(actionMessage(MESSAGE_ERROR));
                });
              dispatch(actionDeactivateLoading());
            }
          });
      })
      .catch((oError) => {
        if (
          oError.code === "auth/wrong-password" ||
          oError.code === "auth/invalid-email"
        )
          dispatch(actionMessage(oError.message));
        else dispatch(actionMessage(MESSAGE_ERROR));
        if (oError.code === "auth/invalid-email")
          DeleteAccount(oUser.email)
            .then(() => { })
            .catch(() => { });
        dispatch(
          actionDispatch(Actions.USER_LOGIN_ERROR, { messageError: "" })
        );
        dispatch(actionDeactivateLoading());
      });
  };
};

const actionResultCreateAccount = (sUserKey) => {
  return (dispatch) => {
    database
      .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
      .once("value")
      .then(async (oAccountSnap) => {
        let oAccount = oAccountSnap.val();
        let oAccountData = {
          key: "",
          email: "",
          id: "",
          idPush: "",
          name: "",
          userId: "",
          username: "",
          provider: "",
          image: "",
        };
        oAccountData.key = sUserKey;
        oAccountData.active = oAccount.active;
        oAccountData.email = oAccount.email;
        oAccountData.id = oAccount.id;
        oAccountData.idPush = oAccount.idPush;
        oAccountData.name = oAccount.name;
        oAccountData.userId = oAccount.userId;
        oAccountData.username = oAccount.username;
        oAccountData.provider = oAccount.provider;
        oAccountData.image = oAccount.image;
        await setLoginDataLocalStorage({
          account: oAccountData,
        });
        dispatch(
          actionDispatch(Actions.USER_LOGIN_SUCCESS, { account: oAccountData })
        );
      });
  };
};

/**
 *
 */
export const actionUserLoginFB = () => {
  return (dispatch) => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then((data) => {
            const infoRequest = new GraphRequest(
              "/me?fields=name,gender,email,picture",
              null,
              (error, result) => {
                if (!error) {
                  let sPassword = data.userID.replace(0, "z").replace(2, "A");
                  UserLoginFB({ userId: data.userID, password: sPassword })
                    .then((oSuccess) => {
                      if (!oSuccess.status) {
                        dispatch(
                          actionUserLoginError({
                            messageError: "",
                            redirectSignIn: true,
                            userFBData: result,
                          })
                        );
                      } else {
                        dispatch(actionUserLoginFirebase(oSuccess.user));
                      }
                    })
                    .catch(() => {
                      dispatch(
                        actionUserLoginError({
                          messageError: "An error occurred, verify user data",
                        })
                      );
                    });
                } else {
                  dispatch(
                    actionUserLoginError({
                      messageError: "An error occurred, verify data",
                    })
                  );
                }
              }
            );
            new GraphRequestManager().addRequest(infoRequest).start();
            LoginManager.logOut();
          });
        } else {
          dispatch(actionUserLoginError({ messageError: "" }));
        }
      },
      function (error) {
        dispatch(
          actionUserLoginError({
            messageError: "An error occurred, verify data",
          })
        );
      }
    );
  };
};
/**
 * Function that identifies a user with the Apple ID
 */
export const actionUserLoginApple = () => {

  // performs login request
  // const appleAuthRequestResponse = await appleAuth.performRequest({
  //   requestedOperation: appleAuth.Operation.LOGIN,
  //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  // });

  // // get current authentication state for user
  // // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

  // // use credentialState response to ensure the user is authenticated
  // if (credentialState === appleAuth.State.AUTHORIZED) {
  //   if (appleAuthRequestResponse.identityToken) {
  //     if (appleAuthRequestResponse.identityToken) {
  //       let oProvider = new oFirebase.auth.OAuthProvider(
  //         "apple.com"
  //       );
  //       // firebase functinality starting from here
  //       const credential = oProvider.credential({
  //         idToken: appleAuthRequestResponse.identityToken,
  //         rawNonce: appleAuthRequestResponse.nonce,
  //       });
  //       oFirebase
  //         .auth()
  //         .signInWithCredential(credential)
  //         .then((oLoginSuccess) => {
  //           database
  //             .ref(
  //               Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
  //               oLoginSuccess.user.uid
  //             )
  //             .once("value", async function (oAccountSnap) {
  //               if (oAccountSnap.exists()) {
  //                 let oAccount = oAccountSnap.val();
  //                 let oAccountData = {
  //                   key: "",
  //                   email: "",
  //                   id: "",
  //                   idPush: "",
  //                   name: "",
  //                   userId: "",
  //                   username: "",
  //                   provider: "",
  //                   image: "",
  //                 };
  //                 oAccountData.key = oLoginSuccess.user.uid;
  //                 oAccountData.active = oAccount.active;
  //                 oAccountData.email = oAccount.email;
  //                 oAccountData.id = oAccount.id;
  //                 oAccountData.idPush = oAccount.idPush;
  //                 oAccountData.name = oAccount.name;
  //                 oAccountData.userId = oAccount.userId;
  //                 oAccountData.username = oAccount.username;
  //                 oAccountData.provider = oAccount.provider;
  //                 oAccountData.image = oAccount.image;
  //                 await setLoginDataLocalStorage({
  //                   account: oAccountData,
  //                 });
  //                 database
  //                   .ref(
  //                     Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
  //                     oLoginSuccess.user.uid
  //                   )
  //                   .update({
  //                     active: 1,
  //                     online: true,
  //                     lastLogin: Date(),
  //                   });
  //                 dispatch(
  //                   actionDispatch(Actions.USER_LOGIN_SUCCESS, {
  //                     account: oAccountData,
  //                   })
  //                 );
  //               } else {
  //                 if (oFirebase.auth().currentUser !== null)
  //                   oFirebase
  //                     .auth()
  //                     .currentUser.delete()
  //                     .then(function () {
  //                       // User correctly deleted for not having a registered account
  //                     })
  //                     .catch(function (error) {
  //                       // Problem to eliminate that user
  //                     });
  //                 dispatch(
  //                   actionDispatch(
  //                     Actions.USER_LOGIN_CREATE_ACCOUNT,
  //                     {
  //                       email:
  //                         oSuccessApple.email !== null
  //                           ? oSuccessApple.email
  //                           : "",
  //                       name:
  //                         oSuccessApple.fullName.givenName !==
  //                           null
  //                           ? oSuccessApple.fullName.givenName +
  //                           " " +
  //                           oSuccessApple.fullName.familyName
  //                           : "",
  //                     }
  //                   )
  //                 );
  //               }
  //             });
  //         })
  //         .catch((oLoginError) => {
  //           if (oFirebase.auth().currentUser !== null)
  //             oFirebase
  //               .auth()
  //               .currentUser.delete()
  //               .then(function () {
  //                 // User correctly deleted for not having a registered account
  //               })
  //               .catch(function (error) {
  //                 // Problem to eliminate that user from Firebase's authentication
  //               });
  //           dispatch(
  //             actionDispatch(Actions.USER_LOGIN_CREATE_ACCOUNT, {
  //               email:
  //                 oSuccessApple.email !== null
  //                   ? oSuccessApple.email
  //                   : "",
  //               name:
  //                 oSuccessApple.fullName.givenName !== null
  //                   ? oSuccessApple.fullName.givenName +
  //                   " " +
  //                   oSuccessApple.fullName.familyName
  //                   : "",
  //             })
  //           );
  //         })
  //         .finally(() => dispatch(actionDeactivateLoading()));
  //     }
  //   } else {
  //     dispatch(actionMessage(MESSAGE_ERROR));
  //   }
  // } else {
  //   dispatch(actionMessage("Not authorized"));
  // }


  return async (dispatch) => {
    dispatch(actionActiveLoading());
    await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    })
      .then(async (oSuccessApple) => {
        console.log('oSuccessApple =====>>>> ', oSuccessApple);
        try {
          const sUserAppleId = oSuccessApple.user;
          if (sUserAppleId !== null) {
            await appleAuth
              .getCredentialStateForUser(sUserAppleId)
              .then((oSuccessCredential) => {
                if (
                  oSuccessCredential === AppleAuthCredentialState.AUTHORIZED
                ) {
                  if (oSuccessApple.identityToken) {
                    if (oSuccessApple.identityToken) {
                      let oProvider = new oFirebase.auth.OAuthProvider(
                        "apple.com"
                      );
                      // firebase functinality starting from here
                      const credential = oProvider.credential({
                        idToken: oSuccessApple.identityToken,
                        rawNonce: oSuccessApple.nonce,
                      });
                      oFirebase
                        .auth()
                        .signInWithCredential(credential)
                        .then((oLoginSuccess) => {
                          database
                            .ref(
                              Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                              oLoginSuccess.user.uid
                            )
                            .once("value", async function (oAccountSnap) {
                              if (oAccountSnap.exists()) {
                                let oAccount = oAccountSnap.val();
                                let oAccountData = {
                                  key: "",
                                  email: "",
                                  id: "",
                                  idPush: "",
                                  name: "",
                                  userId: "",
                                  username: "",
                                  provider: "",
                                  image: "",
                                };
                                oAccountData.key = oLoginSuccess.user.uid;
                                oAccountData.active = oAccount.active;
                                oAccountData.email = oAccount.email;
                                oAccountData.id = oAccount.id;
                                oAccountData.idPush = oAccount.idPush;
                                oAccountData.name = oAccount.name;
                                oAccountData.userId = oAccount.userId;
                                oAccountData.username = oAccount.username;
                                oAccountData.provider = oAccount.provider;
                                oAccountData.image = oAccount.image;
                                await setLoginDataLocalStorage({
                                  account: oAccountData,
                                });
                                database
                                  .ref(
                                    Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB +
                                    oLoginSuccess.user.uid
                                  )
                                  .update({
                                    active: 1,
                                    online: true,
                                    lastLogin: Date(),
                                  });
                                dispatch(
                                  actionDispatch(Actions.USER_LOGIN_SUCCESS, {
                                    account: oAccountData,
                                  })
                                );
                              } else {
                                if (oFirebase.auth().currentUser !== null)
                                  oFirebase
                                    .auth()
                                    .currentUser.delete()
                                    .then(function () {
                                      // User correctly deleted for not having a registered account
                                    })
                                    .catch(function (error) {
                                      // Problem to eliminate that user
                                    });
                                dispatch(
                                  actionDispatch(
                                    Actions.USER_LOGIN_CREATE_ACCOUNT,
                                    {
                                      email:
                                        oSuccessApple.email !== null
                                          ? oSuccessApple.email
                                          : "",
                                      name:
                                        oSuccessApple.fullName.givenName !==
                                          null
                                          ? oSuccessApple.fullName.givenName +
                                          " " +
                                          oSuccessApple.fullName.familyName
                                          : "",
                                    }
                                  )
                                );
                              }
                            });
                        })
                        .catch((oLoginError) => {
                          if (oFirebase.auth().currentUser !== null)
                            oFirebase
                              .auth()
                              .currentUser.delete()
                              .then(function () {
                                // User correctly deleted for not having a registered account
                              })
                              .catch(function (error) {
                                // Problem to eliminate that user from Firebase's authentication
                              });
                          dispatch(
                            actionDispatch(Actions.USER_LOGIN_CREATE_ACCOUNT, {
                              email:
                                oSuccessApple.email !== null
                                  ? oSuccessApple.email
                                  : "",
                              name:
                                oSuccessApple.fullName.givenName !== null
                                  ? oSuccessApple.fullName.givenName +
                                  " " +
                                  oSuccessApple.fullName.familyName
                                  : "",
                            })
                          );
                        })
                        .finally(() => dispatch(actionDeactivateLoading()));
                    }
                  } else {
                    dispatch(actionMessage(MESSAGE_ERROR));
                  }
                } else {
                  dispatch(actionMessage("Not authorized"));
                }
              })
              .catch((oErrorCredential) => {
                dispatch(actionMessage(MESSAGE_ERROR));
              });
          } else {
            dispatch(actionMessage(MESSAGE_ERROR));
          }
        } catch (error) {
          dispatch(actionDeactivateLoading());
          if (error.code !== AppleAuthError.CANCELED) {
            dispatch(actionMessage(MESSAGE_ERROR));
          }
        }
      })
      .catch((oError) => {
        if (oError.code !== AppleAuthError.CANCELED)
          dispatch(actionMessage(MESSAGE_ERROR));
        dispatch(actionDeactivateLoading());
      });
  };
};

/**
 *
 * @param {*} data
 */
export const actionUserLoginSuccess = (data) => ({
  type: Actions.USER_LOGIN_SUCCESS,
  data: data,
});

/**
 *
 */
export const actionUserLoginError = (data) => ({
  type: Actions.USER_LOGIN_ERROR,
  data: data,
});

/**
 *
 * @param {*} data
 */
export const actionUserRegisterValidate = (sEmail, sUsername) => {
  return (dispatch) => {
    UserRegisterValidate(sEmail, sUsername)
      .then((oSuccess) => {
        dispatch(
          actionDispatch(Actions.USER_REGISTER_VALIDATE_SUCCESS, {
            redirectConditions: true,
          })
        );
      })
      .catch((oError) => {
        dispatch(actionDispatch(Actions.USER_REGISTER_VALIDATE_ERROR));
        dispatch(actionMessage(oError.response.data.message));
      });
  };
};

/**
 * Function that sends to register the user and derives to login.
 *
 * @param {array} data Arrangement where all user data comes
 *
 * @author Leandro Curbelo
 */
export const actionUserRegister = (data) => {
  return async (dispatch) => {
    dispatch(actionActiveLoading());
    UserRegister(data)
      .then((oSuccess) => {
        oSuccess.data.password = data.password;
        dispatch(actionUserLogin(oSuccess.data.username, data.password));
      })
      .catch((oError) => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};

/**
 * @param {*} data
 */
export const actionUserSessionClose = (sUserKey = null) => {
  return (dispatch) => {
    LogOut()
      .then(() => {
        if (sUserKey !== null)
          database
            .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
            .once("value", (oSuccess) => {
              if (oSuccess.exists())
                database
                  .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
                  .update({ online: false, idPush: null });
            });
        authentication.signOut().then(() => {
          setEmptyLocalStorage();
          dispatch(actionDispatch(Actions.USER_LOGOUT_SUCCESS));
        });
      })
      .catch(() => {
        if (sUserKey !== null)
          database
            .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
            .once("value", (oSuccess) => {
              if (oSuccess.exists())
                database
                  .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
                  .update({ online: false, idPush: null });
            });
        authentication.signOut().then(() => {
          setEmptyLocalStorage();
          dispatch(actionDispatch(Actions.USER_LOGOUT_SUCCESS));
        });
      });
  };
};

/**
 *
 */
export const actionUserIsLogged = () => {
  return (dispatch) => {
    const oSessionLogin = getLoginDataLocalStorage();
    oSessionLogin.then((oResult) => {
      if (null !== oResult && undefined !== oResult) {
        dispatch(
          actionUserIsLoggedSuccess({
            status: true,
            account: JSON.parse(oResult).account,
          })
        );
      } else {
        dispatch(actionUserIsLoggedError({ status: false }));
      }
    });
  };
};

/**
 * @param {*} data
 */
export const actionUserIsLoggedSuccess = (data) => ({
  type: Actions.USER_IS_LOGGED_SUCCESS,
  data: data,
});

export const actionUserIsLoggedError = (data) => ({
  type: Actions.USER_IS_LOGGED_ERROR,
  data: data,
});

export const actionUserForgotPassword = (sEmail) => {
  return (dispatch) => {
    authentication
      .sendPasswordResetEmail(sEmail)
      .then((oSuccess) => {
        ForgotPassword(sEmail)
          .then(() => {
            dispatch(actionUserForgotPasswordSuccess());
          })
          .catch(() => {
            dispatch(actionUserForgotPasswordSuccess());
          });
      })
      .catch((oError) => {
        switch (oError.code) {
          case "auth/user-not-found":
            dispatch(
              actionUserForgotPasswordError({
                messageError:
                  "The email entered does not correspond to a valid account",
              })
            );
            break;
          case "auth/invalid-email":
            dispatch(
              actionUserForgotPasswordError({
                messageError: "The email entered is invalid",
              })
            );
            break;
          default:
            dispatch(
              actionUserForgotPasswordError({ messageError: MESSAGE_ERROR })
            );
            break;
        }
      });
  };
};

export const actionSetObservable = (data) => ({
  type: Actions.SET_OBSERVABLE_PROFILE,
  data: data,
});
/**
 * Function that creates listeners on the node of the user's account, in this way all changes are heard and notifications are refresh
 * of the menu.
 *
 * @param {accountId} data
 */
export const actionUpdateChanges = (data) => {
  return (dispatch) => {
    let oObservableAccountChange = database.ref(
      Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + "/" + data.accountId
    ),
      oObservableAccountAdded = database.ref(
        Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + "/" + data.accountId
      );
    oObservableAccountChange.on(
      "child_changed",
      (oAccountSnapshot) => {
        let oAccount = oAccountSnapshot.val();
        if ("requestsSent" == oAccountSnapshot.key) {
          let aRequests = [];
          if (oAccountSnapshot.exists())
            oAccountSnapshot.forEach(async (oElement) => {
              if (oElement.val())
                await GetUserAccount(oElement.key).then((oElement) => {
                  aRequests.push({ ...oElement.val(), key: oElement.key });
                  dispatch(
                    actionDispatch(Actions.GET_REQUEST_SENT_SUCCESS, {
                      requestsSent: aRequests,
                    })
                  );
                });
            });
          else
            dispatch(
              actionDispatch(Actions.GET_REQUEST_SENT_SUCCESS, {
                requestsSent: aRequests,
              })
            );
        }
        if ("friendRequests" == oAccountSnapshot.key) {
          let aRequests = [];
          if (oAccountSnapshot.exists())
            oAccountSnapshot.forEach(async (oElement) => {
              if (oElement.val())
                await GetUserAccount(oElement.key).then((oElement) => {
                  aRequests.push({ ...oElement.val(), key: oElement.key });
                  dispatch(
                    actionDispatch(Actions.GET_REQUEST_RECIVED_SUCCESS, {
                      requestsRecived: aRequests,
                    })
                  );
                });
            });
          else
            dispatch(
              actionDispatch(Actions.GET_REQUEST_RECIVED_SUCCESS, {
                requestsRecived: aRequests,
              })
            );
        }
        if (
          "friends" === oAccountSnapshot.key &&
          undefined !== oAccount &&
          oAccount.length > 0
        ) {
          let aFriends = [];
          let nCount = 0;
          let nFriendsLength = oAccount.length;
          oAccount.forEach((firebaseKey) => {
            GetUserAccount(firebaseKey).then((AccountFriend) => {
              aFriends.push({
                ...AccountFriend.val(),
                firebaseKey: AccountFriend.key,
              });
              nCount++;
              if (nCount === nFriendsLength)
                dispatch(
                  actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, {
                    myFriends: aFriends,
                  })
                );
            });
          });
        }
        if (
          "conversations" === oAccountSnapshot.key &&
          undefined !== oAccount
        ) {
          let nMessageUnRead = 0;
          oAccountSnapshot.forEach((oConversationSnap) => {
            nMessageUnRead += oConversationSnap.val().messagesRead;
          });
          dispatch(
            actionCountMessageReadSuccess({
              messageRead: nMessageUnRead,
            })
          );
          dispatch(actionListMessages(data.accountId));
        }
        if ("groups" === oAccountSnapshot.key && undefined !== oAccount) {
          let nMessageUnRead = 0;
          oAccountSnapshot.forEach((oGroupSnap) => {
            nMessageUnRead += oGroupSnap.val().messagesRead;
          });
          dispatch(
            actionCountMessageReadGroupSuccess({
              messageReadGroup: nMessageUnRead,
            })
          );
          dispatch(actionGetGroups(data.accountId));
        }
      },
      (oError) => { }
    );
    oObservableAccountAdded.on(
      "child_added",
      (oAccountSnapshot) => {
        let oAccount = oAccountSnapshot.val();
        if ("requestsSent" == oAccountSnapshot.key) {
          let aRequests = [];
          dispatch(
            actionDispatch(Actions.GET_REQUEST_SENT_SUCCESS, {
              requestsSent: [],
            })
          );
          oAccountSnapshot.forEach(async (oElement) => {
            await GetUserAccount(oElement.key).then((oElement) => {
              aRequests.push({ ...oElement.val(), key: oElement.key });
              dispatch(
                actionDispatch(Actions.GET_REQUEST_SENT_SUCCESS, {
                  requestsSent: aRequests,
                })
              );
            });
          });
        }
        if ("friendRequests" == oAccountSnapshot.key) {
          let aRequests = [];
          dispatch(
            actionDispatch(Actions.GET_REQUEST_RECIVED_SUCCESS, {
              requestsRecived: [],
            })
          );
          oAccountSnapshot.forEach(async (oElement) => {
            await GetUserAccount(oElement.key).then((oElement) => {
              aRequests.push({ ...oElement.val(), key: oElement.key });
              dispatch(
                actionDispatch(Actions.GET_REQUEST_RECIVED_SUCCESS, {
                  requestsRecived: aRequests,
                })
              );
            });
          });
        }
        if (
          "friends" === oAccountSnapshot.key &&
          undefined !== oAccount &&
          oAccount.length > 0
        ) {
          let aFriends = [];
          let nCount = 0;
          let nFriendsLength = oAccount.length;
          oAccount.forEach((firebaseKey) => {
            GetUserAccount(firebaseKey).then((AccountFriend) => {
              aFriends.push({
                ...AccountFriend.val(),
                firebaseKey: AccountFriend.key,
              });
              nCount++;
              if (nCount === nFriendsLength)
                dispatch(
                  actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, {
                    myFriends: aFriends,
                  })
                );
            });
          });
        }
        if (
          "conversations" === oAccountSnapshot.key &&
          undefined !== oAccount
        ) {
          let nMessageUnRead = 0;
          oAccountSnapshot.forEach((oConversationSnap) => {
            nMessageUnRead += oConversationSnap.val().messagesRead;
          });
          dispatch(
            actionCountMessageReadSuccess({
              messageRead: nMessageUnRead,
            })
          );
          dispatch(actionListMessages(data.accountId));
        }
        if ("groups" === oAccountSnapshot.key && undefined !== oAccount) {
          let nMessageUnRead = 0;
          oAccountSnapshot.forEach((oGroupSnap) => {
            nMessageUnRead += oGroupSnap.val().messagesRead;
          });
          dispatch(
            actionCountMessageReadGroupSuccess({
              messageReadGroup: nMessageUnRead,
            })
          );
          dispatch(actionGetGroups(data.accountId));
        }
        if (
          "notifications" === oAccountSnapshot.key &&
          undefined !== oAccount
        ) {
          dispatch(actionGetGroupInvitations({ accountId: data.accountId }));
        }
      },
      (oError) => { }
    );
    let aObservables = [];
    aObservables.push(oObservableAccountChange);
    aObservables.push(oObservableAccountAdded);
    dispatch(
      actionDispatch(Actions.SET_OBSERVABLE_PROFILE, {
        observables: aObservables,
      })
    );
  };
};

export const actionLoadNotificationsFirebase = (data) => {
  return (dispatch) => {
    // TODO: Understand that this is trying to do this and see if following it, contributes a great demand for data download by Firebase - Leandro Curbelo August 24, 2020
    /*
        // Take the user
        database.ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + "/" + data.accountId).on('value', function (oAccountSnapshot) {
            let oAccount = oAccountSnapshot.val();
            if (null !== oAccount) {
                // TOMA LAS REQUEST ENVIADAS
                if (undefined !== oAccount.requestsSent && oAccount.requestsSent.length > 0) {
                    let lRequestSend = [];
                    let nSentCount = 0;
                    let nSentLength = 0;
                    nSentLength = oAccount.requestsSent.length;
                    oAccount.requestsSent.forEach(async friendKey => {
                        await GetUserAccount(friendKey).then(
                            element => {
                                lRequestSend.push({ ...element.val(), key: friendKey })
                                nSentCount++;
                                if (nSentCount === nSentLength) {
                                    dispatch(actionGetRequestsSentSuccess({
                                        requestsSent: lRequestSend
                                    }))
                                }
                            }
                        )
                    });
                }
                // You take the friendship requests received
                if (undefined !== oAccount.friendRequests && oAccount.friendRequests.length > 0) {
                    let lRequestRecived = [];
                    let nRequestCount = 0;
                    let nRequestLength = 0;
                    nRequestLength = oAccount.friendRequests.length;
                    oAccount.friendRequests.forEach(async friendKey => {
                        await GetUserAccount(friendKey).then(
                            element => {
                                lRequestRecived.push({ ...element.val(), key: friendKey })
                                nRequestCount++;
                                if (nRequestCount === nRequestLength) {
                                    dispatch(actionGetRequestsRecivedSuccess({
                                        requestsRecived: lRequestRecived
                                    }))
                                }
                            }
                        )
                    });
                }
                // Take friends
                if (undefined !== oAccount.friends && oAccount.friends.length > 0) {
                    let aFriends = [];
                    let nCount = 0;
                    let nFriendsLength = oAccount.friends.length;
                    oAccount.friends.forEach(firebaseKey => {
                        GetUserAccount(firebaseKey).then(
                            AccountFriend => {
                                aFriends.push({
                                    ...AccountFriend.val(),
                                    firebaseKey: AccountFriend.key
                                });
                                nCount++;
                                if (nCount === nFriendsLength) {
                                    dispatch(actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, { myFriends: aFriends }));
                                }
                            }
                        )
                    });
                }
                // THE CONVERSATIONS
                if (undefined !== oAccount.conversations && oAccount.conversations.length > 0) {
                    let nMessageUnRead = 0;
                    oAccount.conversations.map(function (oAccountConversationSnap) {
                        nMessageUnRead += oAccountConversationSnap.messagesRead
                    });
                    dispatch(actionCountMessageReadSuccess({
                        messageRead: nMessageUnRead
                    }));
                    dispatch(actionListMessages(data.accountId));
                }
                // THE GROUPS
                if (undefined !== oAccount.groups && oAccount.groups.length > 0) {
                    let nMessageUnRead = 0;
                    oAccount.groups.map(function (oGroupSnap) {
                        nMessageUnRead += oGroupSnap.messagesRead
                    });
                    dispatch(actionCountMessageReadGroupSuccess({
                        messageReadGroup: nMessageUnRead
                    }));
                    dispatch(actionGetGroups(data.accountId));
                }
                if (undefined !== oAccount.notifications) {
                    dispatch(actionGetGroupInvitations({ accountId: data.accountId }))
                }
            }
        }, oError => {
        });
        */
  };
};
/**
 *
 */
export const actionClearNotificationsFirebase = () => {
  return (dispatch) => {
    dispatch(
      actionGetRequestsSentSuccess({
        requestsSent: 0,
      })
    );
    dispatch(
      actionGetRequestsRecivedSuccess({
        requestsRecived: 0,
      })
    );
    dispatch(actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, { myFriends: [] }));
    dispatch(
      actionCountMessageReadSuccess({
        messageRead: 0,
      })
    );
    dispatch(
      actionCountMessageReadGroupSuccess({
        messageReadGroup: 0,
      })
    );
  };
};
/**
 * @param {*} data
 */
export const actionUserForgotPasswordSuccess = () => ({
  type: Actions.USER_FORGOT_SUCCESS,
});

/**
 * @param {*} data
 */
export const actionUserForgotPasswordError = (data) => ({
  type: Actions.USER_FORGOT_ERROR,
  data: data,
});

/**
 *
 */
export const actionSetIdOneSignalCode = (data) => {
  return (dispatch) => {
    setIdOneSignalCode(data);
  };
};

/**
 *
 */
export const actionCheckOneSignalCode = (data) => {
  return (dispatch) => {
    const oOneSignalCode = getIdOneSignalCode();
    oOneSignalCode.then((oResult) => {
      if (null !== oResult && undefined !== oResult) {
        let sPushId = JSON.parse(oResult).oneSignalCode;
        database
          .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + data.accountId)
          .once("value", (oAccountSnap) => {
            if (oAccountSnap.exists())
              database
                .ref(
                  Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + data.accountId
                )
                .update({
                  idPush: sPushId,
                });
          });
        SaveOneSignalCode(sPushId)
          .then(() => { })
          .catch(() => { });
      }
    });
  };
};

/**
 *
 */
const setIdOneSignalCode = async (data) => {
  await AsyncStorage.removeItem("@Fitrec:OneSignalCode");
  await AsyncStorage.setItem("@Fitrec:OneSignalCode", JSON.stringify(data));
};

/**
 *
 */
const getIdOneSignalCode = async () => {
  return await AsyncStorage.getItem("@Fitrec:OneSignalCode");
};

/**
 *
 */
export const actionSetGeoLocation = (nLongitude, nLatitude) => {
  return async (dispatch) => {
    SetLocation(nLongitude, nLatitude)
      .then(() => { })
      .catch(() => { });
  };
};

/**
 *
 */
export const actionGetNotifications = () => {
  return (dispatch) => {
    GetNotifications()
      .then((oSuccess) => {
        let nCountNotificationUnRead = 0;
        oSuccess.data.forEach((oNotification) => {
          !oNotification.view && nCountNotificationUnRead++;
        });
        dispatch(
          actionDispatch(Actions.GET_NOTIFICATION_SUCCESS, {
            notifications: oSuccess.data,
            notificationsUnRead: nCountNotificationUnRead,
          })
        );
      })
      .catch(() => { });
  };
};
/**
 * Function that sends to deactivate the user's account to the API, marks the user in Firebase
 * as disabled and remove the push id to avoid notifications.
 *
 * @param {string} sUserKey User Information Node Identifier in Firebase
 *
 * @author Leandro Curbelo
 */
export const actionDesactiveAccount = (sUserKey) => {
  return (dispatch) => {
    DesactiveAccount()
      .then(() => {
        database
          .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
          .update({
            active: 0,
            idPush: null,
            online: false,
          });
        dispatch(actionUserSessionClose(sUserKey));
      })
      .catch((oError) => {
        dispatch(actionMessage(oError.response.data.message));
      });
  };
};
/**
 * Function that is used at the time the user touches a notification, it is marked as a view.
 *
 * @param {number} nNotificationId Notification identifier you want to mark as a view
 *
 * @author Leandro Curbelo
 */
export const actionViewNotification = (nNotificationId) => {
  return (dispatch) => {
    ViewNotification(nNotificationId)
      .then(() => {
        dispatch(actionGetNotifications());
      })
      .catch(() => { });
  };
};

export const actionGetRequestsSentSuccess = (data) => ({
  type: Actions.GET_REQUEST_SENT_SUCCESS,
  data: data,
});

export const actionGetRequestsRecivedSuccess = (data) => ({
  type: Actions.GET_REQUEST_RECIVED_SUCCESS,
  data: data,
});

export const actionCountMessageReadSuccess = (data) => ({
  type: Actions.GET_COUNT_MESSAGES_READ_SUCCESS,
  data: data,
});

export const actionCountMessageReadGroupSuccess = (data) => ({
  type: Actions.GET_COUNT_MESSAGES_READ_GROUP_SUCCESS,
  data: data,
});

export const actionCleanMessage = () => {
  return (dispatch) => {
    dispatch({
      type: Actions.CLEAN_MESSAGE_LOGIN,
    });
  };
};
