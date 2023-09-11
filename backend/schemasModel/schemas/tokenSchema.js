import { Schema } from "mongoose";
import { tokenTypes } from "../../config/config.js";

export const tokenSchema = Schema({
  token: {
    type: String,
    required: [true, "Please enter your token"],
    trim: true,
  },
  userId: {
    type: String,
    required: [true, "Please enter userId"],
    trim: true,
  },
  type: {
    type: String,
    enum: [
      tokenTypes.ACCESS,
      tokenTypes.RESET_PASSWORD,
      tokenTypes.VERIFY_EMAIL,
    ],
    default: tokenTypes.ACCESS,
    required: true,
  },
});
