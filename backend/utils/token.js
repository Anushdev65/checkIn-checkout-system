// import Jwt for generating token
import jwt from "jsonwebtoken";
import { HttpStatus } from "../constant/constant.js";

// Generate token asynchronously with given fields
export let generateToken = async (
  infoObj = {},
  secretKey = "",
  expiresIn = "365d"
) => {
  let expiresInfo = {
    expiresIn: expiresIn,
  };

  // Generate JWT Based on the provided arguments
  try {
    let token = jwt.sign(infoObj, secretKey, expiresInfo);
    return token;
  } catch (error) {
    let er = new Error(error.message);
    error.statusCode = HttpStatus.BAD_REQUEST;
    throw er;
  }
};

export let verifyToken = async (token = "", secretKey = "") => {
  try {
    let infoObj = jwt.verify(token, secretKey);
    return infoObj;
  } catch (error) {
    let er = new Error(error.message);
    error.statusCode = HttpStatus.UNAUTHORIZED;
    throw er;
  }

  //   To  verify or to give infoObject
  // First it checks weather the token is made from secretkey
  // Then it checks expiry date
};
