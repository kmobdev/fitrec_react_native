import axios from "axios";
import promise from "promise";
import { getTokenLocalStorage } from "../services/StorageServices";
import 'intl';
import 'intl/locale-data/jsonp/en'

var oAxiosInstance = axios.create();

oAxiosInstance.interceptors.request.use(
  async function (oConfig) {
    let sToken = await getTokenLocalStorage();
    let sTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (sToken && oConfig.method !== "OPTIONS") {
      oConfig.headers.Authorization = sToken;
      oConfig.headers.TimeZone = sTimeZone;
    }
    return oConfig;
  },
  function (oError) {
    return promise.reject(oError);
  }
);

export default oAxiosInstance;
