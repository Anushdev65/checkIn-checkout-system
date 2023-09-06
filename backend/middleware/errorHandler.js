// Error handler middleware for handling errors and sending appropriate responses
import { HttpStatus } from "../constant/constant.js";

const errorHandler = (error, req, res, next) => {
  let statusCode = "";
  let message = "";
  console.log(error);

  // Check if the error code indicates a duplicate key error (e.g., MongoDB unique constraint violation)
  if (error.code === 11000) {
    statusCode = HttpStatus.CONFLICT;
    message = `Duplicate key error`;
  } else {
    // If not a duplicate key error, use the error message or default to "Internal server error"
    message = error.message || "Internal server error";
    // Use the provided error status code or default to 500 (Internal Server Error)
    statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // Send an appropriate JSON response with error details
  res.status(statusCode).json({
    success: false,
    ...(message && { message }),
  });
};

// Export the errorHandler middleware for use in the application
export default errorHandler;
