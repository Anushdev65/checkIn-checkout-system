
import { HttpStatus } from "../constant/constant.js";

// Helper function to send a successful JSON response
const successResponseData = ({
  res,
  data = null, // Data to be included in the response (default is null)
  message = "", // Optional message to include in the response 
  statusCode = HttpStatus.OK, // HTTP status code for the response (default is 200 OK)
}) => {
  // Setting the HTTP status code and sending a JSON response with success, data, and message properties
  res.status(statusCode).json({
    success: true, // Indicates a successful response
    ...(data && { data }), // Include the data property if data is provided
    ...(message && { message }), // Include the message property if a message is provided
  });
};

export default successResponseData;
