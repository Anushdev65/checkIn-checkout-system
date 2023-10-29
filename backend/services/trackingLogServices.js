import { TrackingLog } from "../schemasModel/model.js";
import { TimeTracker } from "../schemasModel/model.js";

// Create a new tracking Log entry
export const addTrackingLogService = async ({ body }) => {
  const timeTrackerId = body.timeTracker;
  const timeTrackerData = await TimeTracker.findById(timeTrackerId);

  if (!timeTrackerData) {
    // Handle the case where the TimeTracker object is not found.
    // You can return an error response or handle it according to your requirements.
    return null;
  }

  // Include the data from the TimeTracker object in the trackingLog entry.
  const trackingLogEntry = {
    user: body.user,
    timeTracker: timeTrackerData, // Include the entire TimeTracker object
    date: body.date,
  };

  return TrackingLog.create(trackingLogEntry);
};

// Create multiple tracking Log entries at once
export const addManyTrackingLogService = async ({ body }) =>
  TrackingLog.insertMany(body);

// Retrieve a list of tracking Log entries with optional filters and pagination
export const detailAllTrackingLogService = async ({
  find = {},
  sort = "",
  limit = "",
  skip = "",
  select = "",
  date = null,
}) => {
  if (date) {
    find.date = new Date(date);
  }
  return TrackingLog.find(find)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .select(select)
    .populate("user")
    .populate("timeTracker");
};

// Delete a specific tracking Log entry by ID
export const deleteSpecificTrackingLogService = async ({ id }) =>
  TrackingLog.findByIdAndDelete(id);

// Retrieve a specific tracking Log entry by ID
export const detailSpecificTrackingLogService = async ({ id }) =>
  TrackingLog.findById(id).populate("user").populate("timeTracker");

// Update a specific tracking Log entry by ID with new data
export const editSpecificTrackingLogService = async ({ id, body }) =>
  TrackingLog.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
