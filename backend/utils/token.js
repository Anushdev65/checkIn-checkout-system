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
