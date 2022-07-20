import { GetUserHome } from "../services/UserServices";
import { Actions } from "../../Constants";
import {
  actionActiveLoading,
  actionDeactivateLoading,
  actionDispatch,
  actionMessage,
} from "./SharedActions";
import { actionUserSessionClose } from "./UserActions";

/**
 * 
Function that returns the activities that are displayed in the Home of the APP.
 *
 * @param {Array} aFilters Filters for home activities
 *
 * @author Leandro Curbelo
 */
export const actionGetUserHome = (
  aActivities = null,
  sGarder = null,
  aGyms = null,
  sRange = null
) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    GetUserHome(aActivities, sGarder, aGyms, sRange)
      .then((oSuccess) => {
        dispatch(
          actionDispatch(Actions.GET_USER_HOME_SUCCESS, {
            activities: oSuccess.data,
          })
        );
      })
      .catch((oError) => {
        if (oError.response.status === 401) dispatch(actionUserSessionClose());
        else dispatch(actionMessage(oError.response.data.message));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
