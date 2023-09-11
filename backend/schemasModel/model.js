import { model } from "mongoose";
import timeTrackingSchema from "./schemas/timeTrackingSchema.js";
import authSchema from "./schemas/authSchema.js";
import trackingLogSchema from "./schemas/trackingLogSchema.js";
import { tokenSchema } from "./schemas/tokenSchema.js";

export const TimeTracker = model("TimeTracker", timeTrackingSchema);
export const Auth = model("Auth", authSchema);
export const TrackingLog = model("TrackingLog", trackingLogSchema);
export const TokenData = model("TokenData", tokenSchema);
