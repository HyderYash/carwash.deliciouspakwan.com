import * as config from "../config/config";

var API_ROOT_PATH = "";
if (process.env.NODE_ENV === "production") {
  API_ROOT_PATH = config.API_ROOT_PATH_PRODUCTION;
} else {
  API_ROOT_PATH = config.API_ROOT_PATH_LOCAL;
}

var CONSOLE_STYLE_BG = "background: black;";
var CONSOLE_STYLE_COLOR =
  "color: white;font-weight: bold;padding: 3px;font-size: 14px;";

//* COMMON API CALL *//
const fetchAPIData = async function (
  apiPath,
  params = "",
  method = "POST",
  fupld = false,
  apiType = "Internal"
) {
  if (apiType === "Internal") {
    apiPath = API_ROOT_PATH + apiPath;
  }
  var apipara = {};

  return await new Promise(function (resolve) {
    if (method === "POST" && fupld === false) {
      apipara = {
        method: method,
        redirect: "manual",
        mode: "cors",
        body: JSON.stringify(params),
        headers: {
          Referer: window.location.href,
          "Content-Type": "application/json",
        },
      };
    }
    if (method === "POST" && fupld === true) {
      apipara = {
        method: method,
        redirect: "manual",
        mode: "cors",
        body: JSON.stringify(params),
        headers: {
          Referer: window.location.href,
          "Content-Type": "multipart/form-data",
        },
      };
    }
    if (method === "GET") {
      apipara = {
        method: method,
        redirect: "manual",
        mode: "cors",
        headers: { Referer: window.location.href },
      };
    }
    cLog(
      `Calling ${apiPath} with parameters ${JSON.stringify(
        apipara,
        undefined,
        4
      )}`,
      true
    );
    storeDebugInfoInSession([apiPath, apipara]);
    fetch(apiPath, apipara)
      .then(function (response) {
        if (response.status === 200) {
          response.json().then(function (json) {
            storeDebugInfoInSession([json]);
            cLog(
              `API [${apiPath}] RESPONSE: ${JSON.stringify(
                json,
                undefined,
                4
              )}`,
              true
            );
            resolve(json);
          });
        } else if (response.status === 400) {
          response.json().then(function (json) {
            window.onerror(JSON.stringify(json));
            storeDebugInfoInSession([json]);
            cLog(
              `API [${apiPath}] RESPONSE: ${JSON.stringify(
                json,
                undefined,
                4
              )}`,
              true
            );
            resolve(json);
          });
        } else {
          window.onerror(JSON.stringify(response));
          storeDebugInfoInSession([response]);
          cLog(
            `API [${apiPath}] RESPONSE: ${JSON.stringify(
              response,
              undefined,
              4
            )}`,
            true
          );
          resolve(response);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};
//* COMMON API CALL *//

const logoutUserAndClearSession = () => {
  sessionStorage.clear();
  window.location = "/";
  return true;
};

//********** DEBUG RELATED FUNCTIONS START *********************/
// PLEASE DO NOT USE CLOG FUNCTION IN THIS FUNCTION -------- WARNING CALL STACK EXCEEDED
const storeDebugInfoInSession = (debugInfoArr) => {
  if (sessionStorage.getItem("storedDebugInfo")) {
    let storedDebugInfo = JSON.parse(sessionStorage.getItem("storedDebugInfo"));
    const updatedDisplayDebugArr = [];
    storedDebugInfo.forEach((item, index) => {
      updatedDisplayDebugArr.push({
        id: index + Math.random(),
        data: item.data,
      });
    });
    debugInfoArr.forEach((item, index) => {
      updatedDisplayDebugArr.push({
        id: index + Math.random(),
        data: item,
      });
    });
    sessionStorage.setItem(
      "storedDebugInfo",
      JSON.stringify(updatedDisplayDebugArr)
    );
  }
};
const returnStoredDebugInfo = () => {
  if (sessionStorage.getItem("storedDebugInfo")) {
    return JSON.parse(sessionStorage.getItem("storedDebugInfo"));
  } else {
    const noData = [
      { id: Math.random(), data: "No debug info stored in sessionStorage" },
    ];
    sessionStorage.setItem("storedDebugInfo", JSON.stringify(noData));
    return JSON.parse(sessionStorage.getItem("storedDebugInfo"));
  }
};
const setQueryParamsInSession = (routeQuery) => {
  if (window.location.search !== "") {
    for (let queryKey in routeQuery) {
      sessionStorage.setItem(queryKey, routeQuery[queryKey]);
    }
  } else {
    for (let queryKey in routeQuery) {
      if (queryKey === "debug") {
        sessionStorage.removeItem(queryKey);
      }
    }
  }
};
const isDebugOn = () => {
  if (sessionStorage.getItem("debug")) {
    if (sessionStorage.getItem("debug") === "true") {
      cLog("Debug is on");
      return true;
    } else {
      cLog("Debug is off");
      return false;
    }
  } else {
    cLog("Debug is off check sessionStorage");
    return false;
  }
};
//********** DEBUG RELATED FUNCTIONS END *********************/

const isUserLogged = () => {
  cLog("CALLING isUserLogged");
  if (sessionStorage.getItem("user_token")) {
    return true;
  } else {
    return false;
  }
};
const getLoggedUserInfo = (fieldKey) => {
  if (fieldKey === undefined) {
    if (sessionStorage.getItem("user_data")) {
      return JSON.parse(sessionStorage.getItem("user_data"));
    }
  } else {
    // debugger; // eslint-disable-line no-debugger
    if (sessionStorage.getItem("user_data")) {
      if (
        JSON.parse(sessionStorage.getItem("user_data"))[fieldKey] !== undefined
      ) {
        return JSON.parse(sessionStorage.getItem("user_data"))[fieldKey];
      } else {
        return null;
      }
    }
  }
};

//* THIS WILL RE RENDER THE DEBUG TABLE *//
const debugComponentKeyChange = (root) => {
  root.$refs.App.debugComponentKeyChange();
};
//* THIS WILL RE RENDER THE DEBUG TABLE *//

//* THIS WILL LOG LIFECYCLE FLOW IN CONSOLE *//
const cLog = (compName = "", funcName = "", overrideConfigSetting = false) => {
  let msgComment = "";
  let msgFuncInfo = "";
  let finalMsg = "";

  if (
    (compName !== "" && funcName === "") ||
    (compName !== "" && funcName === true)
  ) {
    msgComment = `<<------------- MESSAGE ----- ${compName}  ------------->>`;
  } else {
    msgFuncInfo = `CALLING "${funcName}()" FROM ${compName} component`;
  }

  if (
    config.SHOW_CONSOLE_MSG ||
    funcName === true ||
    overrideConfigSetting === true
  ) {
    if (msgComment === "") {
      finalMsg = msgFuncInfo;
      console.log(`%c ${msgFuncInfo} `, CONSOLE_STYLE_BG + CONSOLE_STYLE_COLOR);
    }
    if (msgFuncInfo === "") {
      finalMsg = msgComment;
      console.log(`%c ${msgComment} `, CONSOLE_STYLE_BG + CONSOLE_STYLE_COLOR);
    }
  } else {
    if (msgComment === "") {
      finalMsg = msgFuncInfo;
    }
    if (msgFuncInfo === "") {
      finalMsg = msgComment;
    }
  }
  storeDebugInfoInSession([finalMsg]);
};
//* THIS WILL LOG LIFECYCLE FLOW IN CONSOLE *//

export {
  fetchAPIData,
  logoutUserAndClearSession,
  setQueryParamsInSession,
  isDebugOn,
  isUserLogged,
  getLoggedUserInfo,
  storeDebugInfoInSession,
  returnStoredDebugInfo,
  debugComponentKeyChange,
  cLog,
};
