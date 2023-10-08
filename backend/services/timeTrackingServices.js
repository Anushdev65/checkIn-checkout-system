import { TimeTracker } from "../schemasModel/model.js";
import mongoose from "mongoose";
// Create a new time tracker entry
export const addTimeTrackerService = async ({ body }) =>
  TimeTracker.create(body);

// Create multiple time tracker entries at once
export const addManyTimeTrackerService = async ({ body }) =>
  TimeTracker.insertMany(body);

// Retrieve a list of time tracker entries with optional filters and pagination
export const detailAllTimeTrackerService = async ({
  find = {},
  sort = "",
  limit = "",
  skip = "",
  select = "",
}) =>
  TimeTracker.find(find)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .select(select)
    .populate("user");

// Delete a specific time tracker entry by ID
export const deleteSpecificTimeTrackerService = async ({ id }) =>
  TimeTracker.findByIdAndDelete(id);

// Retrieve a specific time tracker entry by ID
export const detailSpecificTimeTrackerService = async ({ id }) =>
  TimeTracker.findById(id).populate("user");

// Update a specific time tracker entry by ID with new data
export const editSpecificTimeTrackerService = async ({ id, body }) =>
  TimeTracker.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

// export const getLastTimeTracking = async (timeTrackingId, userId) => {
//   // Creating a filter object to find the most recent Time Tracking entry

//   const filter = {
//     _id: mongoose.Types.ObjectId(timeTrackingId),
//     user: userId,
//   };

//   // Find the most recent Time Tracking entry by its _id (ObjectId)
//   const lastTimeTrackingEntry = await TimeTracker.findById(filter)
//     .sort({ checkIn: -1 }) //Sort in desending order to get the most recent entry
//     .exec();

//   return lastTimeTrackingEntry;
// };
export const getLastTimeTracking = async (userId) => {
  // Find the most recent Time Tracking entry for the user
  const lastTimeTrackingEntry = await TimeTracker.findOne({
    user: userId,
    checkIn: { $ne: null }, // Ensure there's a check-in timestamp
  })
    .sort({ checkIn: -1 }) // Sort in descending order to get the most recent entry
    .exec();

  return lastTimeTrackingEntry;
};

// export const getLastTimeTrackingObject = async (timeTrackingId) => {
//   const lastTimeTrackingEntryObject = await TimeTracker.findById(
//     mongoose.Types.ObjectId(timeTrackingId)
//   )
//     .sort({ checkIn: -1 })
//     .exec();
//   return lastTimeTrackingEntryObject;
// };

export const getLastPausedTimeTracking = async (userId) => {
  // Find the most recent Time Tracking entry for the user with an active status of true
  const lastPausedTimeTrackingEntry = await TimeTracker.findOne({
    user: userId,
    active: false, // Check for paused entries
  })
    .sort({ updatedAt: -1 }) // Sort in descending order of the "updatedAt" field to get the most recent entry
    .exec();

  return lastPausedTimeTrackingEntry;
};
