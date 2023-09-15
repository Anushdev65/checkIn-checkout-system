import jwt from "jsonwebtoken";
let getTokenExpiryTime = (token) => {
  try {
    const decodedToken = jwt.decode(token);
    if (!decodedToken || !decodedToken.exp) {
      console.log("Invalid token or missing expiry time");
      return;
    }

    const expiryTime = new Date(decodedToken.exp * 1000);
    //convert unix timestamp to javaScript date object
    return expiryTime;
  } catch (error) {
    console.error("Error decoding token or retrieving expiry time:", error);
  }
};

export default getTokenExpiryTime;
