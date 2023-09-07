import { Schema } from "mongoose";

let authSchema = Schema(
  {
    password: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default authSchema;
