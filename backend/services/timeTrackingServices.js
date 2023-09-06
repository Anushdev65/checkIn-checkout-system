import { TimeTracker } from "../schemasModel/model.js";

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
}) => TimeTracker.find(find).sort(sort).limit(limit).skip(skip).select(select);

// Delete a specific time tracker entry by ID
export const deleteSpecificTimeTrackerService = async ({ id }) =>
  TimeTracker.findByIdAndDelete(id);

// Retrieve a specific time tracker entry by ID
export const detailSpecificTimeTrackerService = async ({ id }) =>
  TimeTracker.findById(id);

// Update a specific time tracker entry by ID with new data
export const editSpecificTimeTrackerService = async ({ id, body }) =>
  TimeTracker.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

export const getLastCheckIn = async (userId) => {
  // Find the most recent check-in for the user
  const lastCheckInEntry = await TimeTracker.findOne({
    user: userId,
    checkIn: { $ne: null }, // Ensure there's a check-in timestamp
  })
    .sort({ checkIn: -1 }) // Sort in descending order to get the most recent check-in
    .exec();

  return lastCheckInEntry;
};

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