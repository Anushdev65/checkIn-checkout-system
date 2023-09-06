import { Schema } from "mongoose";

let timeTrackingSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    note: {
      type: String
    }
  },
  { timestamp: true }
);

export default timeTrackingSchema;