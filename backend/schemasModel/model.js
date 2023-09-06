import { model } from "mongoose";
import timeTrackingSchema from "./schemas/timeTrackingSchema.js";

export const TimeTracker = model("TimeTracker", timeTrackingSchema);
