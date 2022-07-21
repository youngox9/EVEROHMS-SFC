import axios from "axios";
import { ElNotification } from "element-plus";

const DEV_URL = "192.168.0.194:8080";
const PRD_URL = "192.168.0.194:8088";
const URL_MAPPING = {
  DEV: {
    AUTH: "http://192.168.0.221:8080",
    BASE: "http://192.168.0.161:3000",
  },

  PRD: {
    AUTH: "http://192.168.0.221:8080",
    BASE: "http://192.168.0.161:3088",
  },
};

const DEV_PATHS = ["localhost", "127.0.0.1", DEV_URL];
const IS_DEV = DEV_PATHS.some((p) => window.location.origin.includes(p));
const URL_CONFIG = IS_DEV ? URL_MAPPING.DEV : URL_MAPPING.PRD;

console.log(`目前環境: ${IS_DEV ? "測試站" : "正式站"}`, URL_CONFIG);

function getProfile() {
  try {
    //
    const profile = JSON.parse(window.localStorage.getItem("auth")) || {};
    return profile;
  } catch (e) {
    console.log(e);
  }
  return {};
}

function getErrorMsg(e) {
  const errorStr = e?.response?.data || "";

  let result = "";
  try {
    if (typeof errorStr === "object" && errorStr?.message) {
      result = errorStr?.message;
    } else {
      const errorJson = JSON.parse(errorStr.slice(errorStr.indexOf("{"))) || {};
      if (typeof errorJson === "object") {
        const { MESSAGE } = errorJson;
        console.log(errorJson);
        result = MESSAGE;
      } else {
        throw new Error();
      }
    }
  } catch (e) {
    // console.log(e);
    result = errorStr;
  }
  console.log(result);
  return result;
}

export default function (config = {}) {
  const { auth = false, showError = true, sucessMsg } = config;
  const { accessToken = "" } = getProfile();

  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json",
      "Access-Control-Expose-Headers": "Content-Disposition",
    },
    baseURL: auth ? URL_CONFIG.AUTH : URL_CONFIG.BASE,
    timeout: 10000,
  });

  instance.interceptors.response.use(
    (response) => {
      if (sucessMsg) {
        let msg = "";
        try {
          msg =
            typeof sucessMsg === "function" ? sucessMsg(response) : sucessMsg;
        } catch (e) {
          console.log(e);
        }
        ElNotification({
          title: "Success",
          message: msg,
          type: "success",
        });
      }
      return response;
    },
    (error) => {
      if (showError) {
        const msg = getErrorMsg(error);
        ElNotification({
          title: error?.message || "Error",
          message: msg || "Network Error",
          type: "error",
          duration: 4500,
        });
      }
      throw new Error(error.response);
    }
  );

  return instance({ ...config });
}
