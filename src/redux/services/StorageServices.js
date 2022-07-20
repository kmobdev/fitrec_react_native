//import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Constants } from "../../Constants";

const FITREC_LOGIN_DATA_STORAGE = "@Fitrec:Session";
const FITREC_TOKEN_STORAGE = "@Fitrec:Token";

export const setLoginDataLocalStorage = async (data) => {
  try {
    await AsyncStorage.removeItem(FITREC_LOGIN_DATA_STORAGE);
    await AsyncStorage.setItem(FITREC_LOGIN_DATA_STORAGE, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
};

export const setEmptyLocalStorage = async () => {
  await AsyncStorage.removeItem(FITREC_LOGIN_DATA_STORAGE);
};

export const getLoginDataLocalStorage = async () => {
  return await AsyncStorage.getItem(FITREC_LOGIN_DATA_STORAGE);
};
/**
 * Function that stores in the local storage the authorization token to take the data from the API.
 *
 * @param {string} sToken Authentication token for services
 *
 * @author Leandro Curbelo
 */
export const setTokenLocalStorage = async (sToken) => {
  try {
    await AsyncStorage.removeItem(FITREC_TOKEN_STORAGE);
    await AsyncStorage.setItem(FITREC_TOKEN_STORAGE, sToken);
  } catch (oError) {
    throw oError;
  }
};
/**
 * Function that clears the value of the authorization token from local storage.
 *
 * @author Leandro Curbelo
 */
export const setEmptyTokenLocalStorage = async () => {
  await AsyncStorage.removeItem(FITREC_TOKEN_STORAGE);
};
/**
 * Function that takes the authorization token from local storage.
 *
 * @author Leandro Curbelo
 */
export const getTokenLocalStorage = async () => {
  return await AsyncStorage.getItem(FITREC_TOKEN_STORAGE);
};
