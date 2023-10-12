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
    },

    title: {
      type: String,
    },

    plannedWorkingHours: {
      type: Number,
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

    pauseStatus: {
      type: Boolean,
    },
    active: {
      type: Boolean,
      default: false,
    },
    notes: [String],
  },
  { timestamps: true }
);

export default timeTrackingSchema;
