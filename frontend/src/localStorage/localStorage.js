// Retrieve and parse the stored "loginInfo" from localStorage
export const getLevelInfo = () => {
    const info = localStorage.getItem("loginInfo");
    if (info) {
      const parseInfo = JSON.parse(info);
      return parseInfo;
    }
    return;
  };
  
  // Stringify and store the provided "loginInfo" in localStorage
  export const setLevelInfo = (loginInfo) => {
    const stringifyInfo = JSON.stringify(loginInfo);
    if (stringifyInfo) {
      localStorage.setItem("loginInfo", stringifyInfo);
    }
  };
  
  // Retrieve and parse the stored "userInfo" from localStorage
  export const getUserInfo = () => {
    const info = localStorage.getItem("userInfo");
    if (info) {
      const parseInfo = JSON.parse(info);
      return parseInfo;
    }
    return;
  };
  
  // Stringify and store the provided "userInfo" in localStorage
  export const setUserInfo = (loginInfo) => {
    const stringifyInfo = JSON.stringify(loginInfo);
    if (stringifyInfo) {
      localStorage.setItem("userInfo", stringifyInfo);
    }
  };
  
  // Remove both "loginInfo" and "userInfo" from localStorage
  export const removeLevelInfo = () => {
    localStorage.removeItem("loginInfo");
    localStorage.removeItem("userInfo");
  };