import { Schema } from "mongoose";
import pauseTimerSchema from "./pauseTimerSchema.js";
let timeTrackingSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
    },
    checkIn: {
      type: Date,
      default: Date.now,
    },
    checkOut: {
      type: Date,
    },
    duration: {
      type: Number,
      default: 0,
    },
    pauseTimers: [pauseTimerSchema],
    pausedCount: {
      type: Number,
      default: 0,
    },
    resumeTimer: [Date],

    pausedDuration: {
      type: Number,
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
