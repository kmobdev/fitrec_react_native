import { Actions, MESSAGE_ERROR } from "../../Constants";

/**
 * Function made by a global dispatch
 *
 * @param {Action} sTypeAction Type of action that is sent
 * @param {Data} oData Data that you want to send to Redux
 *
 * @author Leandro Curbelo
 */
export const actionDispatch = (sTypeAction, oData = null) => ({
  type: sTypeAction,
  data: oData,
});

/**
 * Function that activates the toast message
 *
 * @param {string} sMessage Message that will be displayed
 *
 * @author Leandro Curbelo
 */
export const actionMessage = (sMessage) => ({
  type: Actions.MESSAGE,
  message:
    sMessage !== null && sMessage !== undefined ? sMessage : MESSAGE_ERROR,
});
/**
 * Functions that activate and deactivate loading
 *
 * @author Leandro Curbelo
 */
export const actionActiveLoading = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.ACTIVE_LOADING, null));
  };
};
export const actionDeactivateLoading = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.DEACTIVATE_LOADING, null));
  };
};
/**
 * Function that in reduce an image to expand
 *
 * @param {string} sImage URL of the image to expand
 *
 * @author Leandro Curbelo
 */
export const actionExpandImage = (sImage) => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.EXPAND_IMAGE, sImage));
  };
};
/**
 * Function that closes the visualization of an expanded image
 *
 * @author Leandro Curbelo
 */
export const actionCloseImage = () => {
  return (dispatch) => {
    dispatch(actionDispatch(Actions.DISMISS_IMAGE));
  };
};
