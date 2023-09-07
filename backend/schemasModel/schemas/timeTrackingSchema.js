import { Schema } from "mongoose";

let timeTrackingSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    pauseTimer: {
      type: Date,
    },
    pausedDuration: {
      type: Number,
      default: 0,
    },
    resume: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
    },
  },
  { timestamp: true }
);

export default timeTrackingSchema;
