// Middleware for checking if a user is authorized based on roles
import tryCatchWrapper from "./tryCatchWrapper.js";

export let isAuthorized = (roleArray) =>
  tryCatchWrapper(async (req, res, next) => {
    // Extract user roles from request information
    let { roles } = req.info;

    // Check if the user has at least one role from the specified roleArray
    let isAuthorizedUser = roles.some((role) => roleArray.includes(role));

    // If authorized, pass control to the next middleware
    if (isAuthorizedUser) next();
    else {
      // If not authorized, throw a 403 Forbidden error
      let error = new Error("User is not authorized.");
      error.statusCode = 403;
      throw error;
    }
  });
