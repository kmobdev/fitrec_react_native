import { Constants } from "../../Constants";
import oAxiosInstance from "../interceptors/Interceptors";

export const GetAllActivities = () => {
  return oAxiosInstance
    .get(Constants.URL_SERVICE + "activities")
    .then((oResult) => oResult.data);
};

export const GetAllGyms = () => {
  return oAxiosInstance
    .get(Constants.URL_SERVICE + "gyms")
    .then((oResult) => oResult.data);
};
