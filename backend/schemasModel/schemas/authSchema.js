import { Schema } from "mongoose";

let authSchema = Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default authSchema;
