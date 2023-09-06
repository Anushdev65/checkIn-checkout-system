// Import the mongoose library for MongoDB interaction
import mongoose from "mongoose";

// Import the MongoDB URL from the configuration file
import { dbUrl } from "../config/config.js";

// Function to establish a connection to the MongoDB database
export const connectDb = async () => {
  // Disable strict query mode for mongoose
  mongoose.set("strictQuery", false);

  // Configure connection options
  const options = {
    useNewUrlParser: true, // Use the new URL parser
    UseUnifiedTopology: true, // Use the new server discovery and monitoring engine
  };

  try {
    // Attempt to connect to the MongoDB database using the provided URL and options
    await mongoose.connect(dbUrl, options);

    // If the connection is successful, log a success message
    console.log(
      `expressApp is connected to MongoDB at port ${dbUrl} successfully`
    );
  } catch (error) {
    // If an error occurs during the connection attempt, log the error message
    console.log(error.message);
  }
};
