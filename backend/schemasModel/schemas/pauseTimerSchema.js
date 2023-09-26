import { Schema } from "mongoose";

const pauseTimerSchema = Schema({
  pauseTime: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
  },
});

export default pauseTimerSchema;
