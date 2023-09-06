import { secretKey } from "../config/config.js";
import { HttpStatus } from "../constant/constant.js";
import { TokenData } from "../schemasModle/model.js";
import { authService } from "../services/index.js";
import { verifyToken } from "../utils/token.js";
import tryCatchWrapper from "./tryCatchWrapper.js";

// Middleware for validating and extracting user information from JWT tokens
export let isValidToken = tryCatchWrapper(async (req, res, next) => {
  // Extract the "Authorization" header from the request
  let { authorization = "" } = req.headers;

  // Split the header value to separate "Bearer" and the token
  let arr = authorization.split(" ");
  let token = arr[1] || "";

  // Check if the header format is "Bearer [token]" and if the token exists
  if (arr[0] === "Bearer" && token) {
    // Verify the validity of the token using the secret key and check its expiration
    let info = await verifyToken(token, secretKey);

    // Retrieve user data associated with the token's userId
    let user = await authService.readSpecificAuthUserService({
      id: info.userId,
    });

    // Check if the token exists in the database
    let tok = await TokenData.findOne({ token: token });

    if (tok === null) {
      // If the token is not found in the database, respond with an unauthorized error
      let error = new Error("Please enter a valid token");
      error.statusCode = HttpStatus.UNAUTHORIZED;
      throw error;
    } else {
      // If the token is valid and found in the database, attach token and user information to the request
      req.token = {
        token: token,
        tokenId: tok._id,
      };
      req.info = {
        ...info,
        roles: user.roles,
      };

      // Proceed to the next middleware
      next();
    }
  } else {
    // If the header format is invalid or the token is missing, respond with an unauthorized error
    let error = new Error("Token is not valid");
    error.statusCode = HttpStatus.UNAUTHORIZED;
    throw error;
  }
});

// This middleware checks the validity of a token and adds req.info and req.token if valid.
// req.info = { userId: "...", roles: "..." };
// req.token = { token: "...", tokenId: "..." };
