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
  let userId = req.user.id;

  // Check if the user has already checked in on the current day
  let lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    userId
  );

  if (lastTimeTrackingEntry && lastTimeTrackingEntry.checkOut) {
    // User has already checked out today, they can't check in again
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You've already checked out today. Check in is not allowed.",
    });
  }

  // Check if the user has already checked in and is active
  if (lastTimeTrackingEntry && lastTimeTrackingEntry.active) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message:
        "You're already checked in and active. No need to check in again.",
    });
  }

  // Updating the existing Time Tracking entry with the current date and time as check-in time
  lastTimeTrackingEntry.checkIn = new Date();
  lastTimeTrackingEntry.active = true; // active set to true when checking in
  const data = await timeTrackerService.editSpecificTimeTrackerService({
    id: lastTimeTrackingEntry._id,
    body: lastTimeTrackingEntry,
  });

  successResponseData({
    res,
    message: "Checked in successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

export const checkOut = tryCatchWrapper(async (req, res) => {
  let userId = req.user.id;

  // recent Time Tracking entry for the user
  let lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    userId
  );

  // Checks if the user has previously checked in
  if (!lastTimeTrackingEntry || !lastTimeTrackingEntry.checkIn) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You need to check in first before checking out.",
    });
  }

  // Set the check-out time
  lastTimeTrackingEntry.checkOut = new Date();

  // Calculate the duration using the new function
  lastTimeTrackingEntry.duration = duration(
    lastTimeTrackingEntry.checkIn,
    lastTimeTrackingEntry.checkOut
  );

  // Update the active status to false
  lastTimeTrackingEntry.active = false;

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

export const duration = tryCatchWrapper(async (req, res) => {
  let userId = req.user.id;

  // Find the most recent Time Tracking entry of the user
  let lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    userId
  );

  // Checks if the user has previously checked in and checked out
  if (
    !lastTimeTrackingEntry ||
    !lastTimeTrackingEntry.checkIn ||
    !lastTimeTrackingEntry.checkOut
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message:
        "You must have both check-in and check-out times to calculate duration.",
    });
  }

  // Calculate the duration in seconds
  const durationInSeconds =
    (lastTimeTrackingEntry.checkOut - lastTimeTrackingEntry.checkIn) / 1000;

  // Function to calculate hours and minutes from seconds
  const calculateHoursAndMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  // Calculate hours and minutes
  const { hours, minutes } = calculateHoursAndMinutes(durationInSeconds);

  // Return the duration
  successResponseData({
    res,
    message: "Duration calculated successfully.",
    statusCode: HttpStatus.OK,
    data: { durationInSeconds, hours, minutes },
  });
});


const pauseTimers = new Map();

export const pauseTimer = tryCatchWrapper(async (req, res) => {
  const userId = req.user.id;

  // Checks if the user already has a pause timer
  if (pauseTimers.has(userId)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Timer is already paused.",
    });
  }

  // Find the most recent active Time Tracking entry for the user
  let lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    userId
  );

  // Check if the user has already checked in and has an active session
  if (
    !lastTimeTrackingEntry ||
    !lastTimeTrackingEntry.checkIn ||
    !lastTimeTrackingEntry.active
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message:
        "You need to check in and have an active session before pausing the timer.",
    });
  }

  // Calculate the duration of the current pause
  let currentPauseDuration = 0;
  if (lastTimeTrackingEntry.pauseTimer) {
    currentPauseDuration =
      (new Date() - lastTimeTrackingEntry.pauseTimer) / 1000;
  }

  // Update the pauseTimer field with the current date and time
  lastTimeTrackingEntry.pauseTimer = new Date();

  // Update the active status to false to indicate that the tracking is paused
  lastTimeTrackingEntry.active = false;

  // Update the pausedDuration by adding the current pause duration
  lastTimeTrackingEntry.pausedDuration += currentPauseDuration;

  const data = await timeTrackerService.editSpecificTimeTrackerService({
    id: lastTimeTrackingEntry._id,
    body: lastTimeTrackingEntry,
  });

  // Create a pause timer and store its ID
  const pauseTimerId = setTimeout(() => {
    //Perform actions when pause duration is complete
   
    lastTimeTrackingEntry.active = true; // Resume the tracking
    lastTimeTrackingEntry.checkIn = new Date();

    // Remove the pause timer from the map
    pauseTimers.delete(userId);
  }, pauseDurationInSeconds * 1000); // Convert to milliseconds

  // Store the pause timer ID in the map
  pauseTimers.set(userId, pauseTimerId);

  successResponseData({
    res,
    message: "Timer paused successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

export const resumeTimer = tryCatchWrapper(async (req, res) => {
  const userId = req.user.id;

  // Check if the user has a paused timer
  if (!pauseTimers.has(userId)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You must have a paused session to resume the timer.",
    });
  }

  // Clear the pause timer when resuming
  const pauseTimerId = pauseTimers.get(userId);
  clearTimeout(pauseTimerId);

  // Find the most recent paused Time Tracking entry for the user
  let lastTimeTrackingEntry =
    await timeTrackerService.getLastPausedTimeTracking(userId);

  // Check if the user has a paused entry
  if (
    !lastTimeTrackingEntry ||
    !lastTimeTrackingEntry.pauseTimer ||
    lastTimeTrackingEntry.active
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You must have a paused session to resume the timer.",
    });
  }

  // Calculate the time spent during the pause and subtract it from pausedDuration
  const pauseDuration = (new Date() - lastTimeTrackingEntry.pauseTimer) / 1000;
  lastTimeTrackingEntry.pausedDuration -= pauseDuration;

  // Update the resume field with the current date and time
  lastTimeTrackingEntry.resume = new Date();

  // Update the active status to true to indicate that the tracking is resumed
  lastTimeTrackingEntry.active = true;

  const data = await timeTrackerService.editSpecificTimeTrackerService({
    id: lastTimeTrackingEntry._id,
    body: lastTimeTrackingEntry,
  });

  // Remove the pause timer from the map
  pauseTimers.delete(userId);

  successResponseData({
    res,
    message: "Timer resumed successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});
