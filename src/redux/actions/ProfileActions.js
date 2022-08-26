import { GetProfile, UpdateProfile } from "../services/ProfileServices";
import {
  Actions,
  Constants,
  MESSAGE_ERROR,
  SLACK_FEEDBACK_WEBHOOK,
} from "../../Constants";
import { GetDataUser } from "../services/FirebaseServices";
import { database } from "../services/FirebaseServices";
import { ContactusSend, GetPals } from "../services/UserServices";
import {
  actionDispatch,
  actionMessage,
  actionActiveLoading,
  actionDeactivateLoading,
} from "./SharedActions";
import { actionGetUserHome } from "./HomeActions";
import axios from "axios";

export const actionGetProfile = (nUserId, bIsHome = false) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.CLEAN_PROFILE));
    dispatch(actionActiveLoading());
    GetProfile(nUserId)
      .then((oSuccess) => {
        if (oSuccess.data.isMe)
          if (bIsHome)
            dispatch(
              actionDispatch(Actions.GET_USER_PROFILE_HOME_SUCCESS, {
                profile: oSuccess.data,
              })
            );
          else
            dispatch(
              actionDispatch(Actions.GET_USER_PROFILE_SUCCESS, {
                profile: oSuccess.data,
              })
            );
        else if (bIsHome)
          dispatch(
            actionDispatch(Actions.GET_USER_PROFILE_HOME_SUCCESS, {
              profile: oSuccess.data,
            })
          );
        else
          dispatch(
            actionDispatch(Actions.GET_USER_PROFILE_SUCCESS, {
              profile: oSuccess.data,
            })
          );
      })
      .catch((oError) => {
        dispatch(
          actionDispatch(Actions.GET_USER_PROFILE_ERROR, { messageError: "" })
        );
        dispatch(actionMessage(oError.response.data.message));
        dispatch(actionDispatch(Actions.CLEAN_PROFILE));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};

export const actionUpdateProfile = (
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
  sBackground
) => {
  return (dispatchEvent) => {
    dispatchEvent(actionActiveLoading());
    UpdateProfile(
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
      sBackground
    )
      .then((oSuccess) => {
        database
          .ref(Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB + sUserKey)
          .update({
            name: sName,
            image: oSuccess.images.profile,
            backgroundImage: oSuccess.images.background,
          })
          .then(() => {
            dispatchEvent(actionGetProfile(nUserId));
            dispatchEvent(actionDeactivateLoading());
            dispatchEvent(actionUpdateProfileSuccess());
            dispatchEvent(actionGetUserHome());
          });
      })
      .catch((oError) => {
        dispatchEvent(actionDeactivateLoading());
        dispatchEvent(actionMessage(oError.response.data.message));
      })
      .finally(() => {
        dispatchEvent(actionDeactivateLoading());
      });
  };
};

export const actionUpdateProfileSuccess = () => ({
  type: Actions.UPDATE_USER_PROFILE_SUCCESS,
});

export const actionUpdateProfileError = (data) => ({
  type: Actions.UPDATE_USER_PROFILE_ERROR,
  data: data,
});
/**
 * Function that the listener returns to keep the list of friends in the application synchronized.
 *
 * @author Leandro Curbelo
 */
export const actionGetMyFriendsListener = (sUserKey = null) => {
  return (dispatch) => {
    let oListener = null;
    if (sUserKey !== null) {
      oListener = database.ref(
        `${Constants.FIREBASE_CONFIG.NODE_ACCOUNTS_DB}${sUserKey}/friends`
      );
      oListener.on("value", (oPals) => {
        dispatch(actionGetMyFriends());
      });
    }
    dispatch(
      actionDispatch(Actions.GET_MY_FRIENDS_LISENER, { listener: oListener })
    );
  };
};
/**
 * Function that user user users list currently, friends are taken from
 *  The Database in Firebase.
 *
 * @author Leandro Curbelo
 */
export const actionGetMyFriends = () => {
  return (dispatch) => {
    let nCount = 0,
      aFriends = [];
    GetPals()
      .then((oSuccess) => {
        if (oSuccess.data.length > 0) {
          oSuccess.data.forEach((oFriend) => {
            oFriend.firebaseKey = oFriend.key;
            GetDataUser(oFriend.key, "groupsInvitations").then(
              (aInvitationsGroups) => {
                let aInvitations = [];
                aInvitationsGroups.exists() &&
                  aInvitationsGroups.forEach((oInvitation) => {
                    aInvitations.push(oInvitation.key);
                  });
                oFriend.invitationsGroup = aInvitations;
                aFriends.push(oFriend);
                nCount++;
                if (nCount === oSuccess.data.length)
                  dispatch(
                    actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, {
                      myFriends: aFriends,
                    })
                  );
              }
            );
          });
        } else
          dispatch(
            actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, {
              myFriends: aFriends,
            })
          );
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
        dispatch(
          actionDispatch(Actions.GET_MY_FRIENDS_SUCCESS, {
            myFriends: aFriends,
          })
        );
      });
  };
};

export const actionUpdateProfileResetState = () => ({
  type: Actions.RESET_ACTION_STATE,
});

export const actionSendContactus = (sMessage) => {
  console.log(sMessage);
  return (dispatch) => {
    fetch(SLACK_FEEDBACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: sMessage }),
    })
      .then((res) => {
        // console.log("Request complete! response:", res);
        dispatch(actionDispatch(Actions.SEND_CONTACT_US_SUCCESS));
      })
      .catch(() => {
        dispatch(actionMessage(MESSAGE_ERROR));
      });
  };
};
