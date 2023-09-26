// Middleware for wrapping asynchronous route handlers with try-catch error handling
const tryCatchWrapper = (action) => async (req, res, next) => {
  try {
    // Execute the provided action (asynchronous route handler)
    await action(req, res, next);
  } catch (error) {
    // If an error occurs, pass it to the next middleware for error handling
    // next(error);
  }
};

export default tryCatchWrapper;
