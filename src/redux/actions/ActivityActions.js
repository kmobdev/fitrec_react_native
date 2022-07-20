import { Actions } from "../../Constants";
import { GetAllActivities, GetAllGyms } from "../services/ActivityServices";
import { actionDispatch } from "./SharedActions";

/**
 *
 */
export const actionGetAllActivities = () => {
  return (dispatch) => {
    GetAllActivities()
      .then((oSuccess) => {
        var aActivities = [];
        oSuccess.data.forEach((element) => {
          aActivities.push({
            id: element.id,
            name: element.name,
            selected: false,
          });
        });
        dispatch(actionGetAllActivitiesSuccess({ activities: aActivities }));
      })
      .catch(() => {});
  };
};

/**
 * @param {*} data
 */
export const actionGetAllActivitiesSuccess = (data) => ({
  type: Actions.GET_ALL_ACTIVITIES_SUCCESS,
  data: data,
});

/**
 * @param {*} data
 */
export const actionGetAllActivitiesError = (data) => ({
  type: Actions.GET_ALL_ACTIVITIES_ERROR,
  data: data,
});
/**
 * Function that returns the gyms that are in the database.
 *
 * @author Leandro Curbelo
 */
export const actionGetGyms = () => {
  return (dispatch) => {
    GetAllGyms()
      .then((oSuccess) => {
        dispatch(actionDispatch(Actions.GET_GYMS, { gyms: oSuccess.data }));
      })
      .catch(() => {
        dispatch(actionDispatch(Actions.GET_GYMS, { gyms: [] }));
      });
  };
};
