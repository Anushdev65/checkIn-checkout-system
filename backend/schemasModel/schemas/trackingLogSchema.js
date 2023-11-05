import { Schema } from "mongoose";

const trackingLog = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
    },

    timeTracker: {
      type: Schema.Types.ObjectId,
      ref: "TimeTracker",
    },

    date: {
      type: Date,
    },
  },

  { timestamps: true }
);

export default trackingLog;
