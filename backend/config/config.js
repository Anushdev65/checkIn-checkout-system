// Import the `config` function from the dotenv library to load environment variables from the .env file
import { config } from "dotenv";
config({ path: "../.env" });

// Define and export configuration variables derived from environment variables

// MongoDB URL for database connection
export const dbUrl = process.env.DB_URL || "mongodb://0.0.0.0:27017/DB_URL";

// Port for the Node.js server to listen on
export const port = process.env.PORT;

// API version for the project's API endpoints
export const apiVersion = process.env.API_VERSION || "/api/v1";

// Secret key for JWT (JSON Web Tokens) authentication
export const secretKey = process.env.SECRET_KEY || "project1";

// Expiry duration for JWT tokens (default: 365 days)
export const expiryIn = process.env.EXPIRY_IN || "365d";

// Expiry duration for verifying email (default: 1 day)
export const verifyEmailExpiryIn = process.env.VERIFY_EMAIL_EXPIRY_IN || "1d";

// Base URL for the client application (default: http://localhost:3000)
export const clientBaseUrl =
  process.env.CLIENT_BASE_URL || "http://localhost:3000";

// Base URL for the server (default: http://localhost:8000)
export const baseUrl = process.env.BASE_URL || "http://localhost:8000";

// Email configuration

// Sender's email address
export const fromEmail = process.env.FROM_EMAIL;

// export const fromPassword = process.env.FROM_PASSWORD;

// Email server host (SMTP server)
export const emailHost = process.env.EMAIL_HOST;

// Expiry duration for password reset requests
export const resetExpiryIn = process.env.RESET_EXPIRY_IN;

// Token types for different purposes
export const tokenTypes = {
  ACCESS: "access",
  RESET_PASSWORD: "resetPassword",
  VERIFY_EMAIL: "verifyEmail",
};

// Email sender's name or alias
export const emailName = process.env.EMAIL_NAME;
