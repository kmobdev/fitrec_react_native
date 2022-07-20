import axios from "axios";
import { Constants } from "../../Constants";

export const GetGifs = (sSearch) => {
  return axios
    .get(
      Constants.GIPHY_CONFIG.urlGifs +
        "?api_key=" +
        Constants.GIPHY_CONFIG.apiKey +
        "&q=" +
        sSearch +
        "&limit=" +
        Constants.GIPHY_CONFIG.limit +
        "&rating=" +
        Constants.GIPHY_CONFIG.rating
    )
    .then((oResult) => oResult.data);
};

export const GetStickers = (sSearch) => {
  return axios
    .get(
      Constants.GIPHY_CONFIG.urlStickers +
        "?api_key=" +
        Constants.GIPHY_CONFIG.apiKey +
        "&q=" +
        sSearch +
        "&limit=" +
        Constants.GIPHY_CONFIG.limit +
        "&rating=" +
        Constants.GIPHY_CONFIG.rating
    )
    .then((oResult) => oResult.data);
};
