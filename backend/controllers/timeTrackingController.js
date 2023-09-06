// Import necessary modules and services
import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";
import tryCatchWrapper from "../middleware/tryCatchWrapper.js";
import { timeTrackerService } from "../services/index.js";

// Controller function to add a new time tracker entry
export const addTimeTracker = tryCatchWrapper(async (req, res) => {
  // Extract request body
  let body = { ...req.body };

  // Call the service function to add a time tracker
  let data = await timeTrackerService.addTimeTrackerService({ body });

  // Send a success response
  successResponseData({
    res,
    message: "Time tracked successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

// Controller function to edit an existing time tracker entry
export const editTimeTracker = tryCatchWrapper(async (req, res) => {
  // Extract request body and ID parameter
  let body = { ...req.body };
  let id = req.params.id;

  // Call the service function to edit a specific time tracker
  let data = await timeTrackerService.editSpecificTimeTrackerService({
    id,
    body,
  });

  // Send a success response
  successResponseData({
    res,
    message: "Updated successfully",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

// Controller function to retrieve a specific time tracker entry by ID
export const detailSpecificTimeTracker = tryCatchWrapper(async (req, res) => {
  // Extract ID parameter
  let id = req.params.id;

  // Call the service function to retrieve a specific time tracker
  let data = await timeTrackerService.detailSpecificTimeTrackerService({ id });

  // Send a success response
  successResponseData({
    res,
    message: "Read time tracking successfully",
    statusCode: HttpStatus.OK,
    data,
  });
});

// Controller function to retrieve all time tracker entries
export const detailAllTimeTracker = tryCatchWrapper(async (req, res, next) => {
  // Initialize a 'find' object for querying all time tracker entries
  let find = {};

  // Pass 'find' and the service function to the next middleware
  req.find = find;
  req.service = timeTrackerService.detailAllTimeTrackerService;

  next();
});

// Controller function to delete a specific time tracker entry by ID
export const deleteSpecificTimeTracker = tryCatchWrapper(async (req, res) => {
  // Extract ID parameter
  let id = req.params.id;

  // Call the service function to delete a specific time tracker
  let data = await timeTrackerService.deleteSpecificTimeTrackerService({ id });

  // Send a success response
  successResponseData({
    res,
    message: "Deleted successfully",
    statusCode: HttpStatus.OK,
    data,
  });
});

export const checkIn = tryCatchWrapper(async (req, res) => {
  const userId = req.params.id;

  // Check if the user has already checked in on the current day
  const lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    userId
  );

  if (lastTimeTrackingEntry && lastTimeTrackingEntry.checkOut) {
    // User has already checked out today, they can't check in again
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You've already checked out today. Check in is not allowed.",
    });
  }

  // Create a new Time Tracking entry with the current date and time as check-in time
  const checkInData = {
    user: userId,
    checkIn: new Date(),
  };

  const data = await timeTrackerService.addTimeTrackerService({
    body: checkInData,
  });

  successResponseData({
    res,
    message: "Checked in successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

export const checkOut = tryCatchWrapper(async (req, res) => {
  // Get the user's ID from req.params.id

  const userId = req.params.id;

  // Find the most recent Time Tracking entry for the user
  const lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    userId
  );

  // Check if the user has previously checked in
  if (!lastTimeTrackingEntry || !lastTimeTrackingEntry.checkIn) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You need to check in first before checking out.",
    });
  }

  // Update the most recent Time Tracking entry with check-out time and calculate duration
  lastTimeTrackingEntry.checkOut = new Date();
  lastTimeTrackingEntry.duration =
    (lastTimeTrackingEntry.checkOut - lastTimeTrackingEntry.checkIn) / 1000; // Duration in seconds

  const data = await timeTrackerService.editSpecificTimeTrackerService({
    id: lastTimeTrackingEntry._id,
    body: lastTimeTrackingEntry,
  });

  successResponseData({
    res,
    message: "Checked out successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});
