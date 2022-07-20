import { SendReport } from "../services/ReportServices";
import {
  actionActiveLoading,
  actionDeactivateLoading,
  actionMessage,
} from "./SharedActions";

/**
 * Function in charge of taking a new report and sending it for storage
 *
 * @param {number} nId Identifier of the object that is reported, it can be Journey or User for the moment
 * @param {number} nType Report type, the types are declared in variables, in the Constants.js file
 * @param {string} sReason Reason for the report, they are predetermined
 * @param {string} sDescription Description in case you want to add the user
 *
 * @return {ToastMessage}
 *
 * @author Leandro Curbelo
 */
export const actionSendReport = (nId, nType, sReason, sDescription) => {
  return (dispatch) => {
    dispatch(actionActiveLoading());
    SendReport(nId, nType, sReason, sDescription)
      .then((oSuccess) => {
        dispatch(actionMessage(oSuccess.message));
      })
      .catch((oError) => {
        dispatch(actionMessage(oError.response.data.message));
      })
      .finally(() => {
        dispatch(actionDeactivateLoading());
      });
  };
};
