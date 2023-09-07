import { Schema } from "mongoose";

const trackingLog = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
    required: true
  },

  timeTracker: {
    type: Schema.Types.ObjectId,
    ref: "TimeTracker",
  },

  date: {
    type: Date,
    required: true,
  },
});

export default trackingLog;
