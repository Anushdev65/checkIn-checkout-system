// Import necessary modules and services
import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";
import tryCatchWrapper from "../middleware/tryCatchWrapper.js";
import { authService, timeTrackerService } from "../services/index.js";
import asyncHandler from "express-async-handler";
import {
  getLastTimeTracking,
  detailSpecificTimeTrackerService,
} from "../services/timeTrackingServices.js";
import dayjs from "dayjs";
import { throwError } from "../utils/throwError.js";
import { TimeTracker } from "../schemasModel/model.js";
import mongoose from "mongoose";
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
  // Get the user ID from the request.
  let user = req.body.id;
  let workingTitle = req.body.title;

  let plannedWorkingHours = req.body.plannedWorkingHours;
  // console.log(workingTitle, plannedWorkingHours);
  // // Fetch the user's data, including the user ID
  // console.log("User ID:", user);
  const userData = await authService.detailSpecificAuthUserService(user);

  console.log(userData);
  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user has already checked in on the current day
  let lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    user
  );

  console.log(lastTimeTrackingEntry);

  // Checking if the last check-in date is the same as the current date (using dayjs)
  if (
    lastTimeTrackingEntry &&
    dayjs(lastTimeTrackingEntry.checkIn).isSame(dayjs(), "day")
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You've already checked in today. Check-in is not allowed.",
    });
  }

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

  let parsedPlannedWorkingHours = parseFloat(plannedWorkingHours);
  if (isNaN(parsedPlannedWorkingHours)) {
    parsedPlannedWorkingHours = 0;
  }

  // Updating the existing Time Tracking entry with the current date and time as check-in time
  const newEntry = {
    user,
    checkIn: new Date(),
    active: true,
    title: workingTitle,
    plannedWorkingHours: parsedPlannedWorkingHours,
  };
  // lastTimeTrackingEntry.checkIn = new Date();
  // lastTimeTrackingEntry.active = true; // active set to true when checking in

  const createdEntry = await timeTrackerService.addTimeTrackerService({
    body: newEntry,
  });
  console.log(createdEntry);

  const timeTrackingId = createdEntry._id;
  successResponseData({
    res,
    message: "Checked in successfully.",
    statusCode: HttpStatus.CREATED,
    createdEntry: { timeTrackingId },
  });

  return timeTrackingId;
});

export const checkOut = tryCatchWrapper(async (req, res) => {
  let user = req.body.id;

  // recent Time Tracking entry for the user
  let lastTimeTrackingEntry = await timeTrackerService.getLastTimeTracking(
    user
  );
  // Checks if the user has previously checked in
  if (!lastTimeTrackingEntry || !lastTimeTrackingEntry.checkIn) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "You need to check in first before checking out.",
    });
  }

  // Checks if the user has already checked out

  if (lastTimeTrackingEntry.checkOut) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      sucess: false,
      message:
        "You have already checked out. Please check in before checking out",
    });
  }

  // Set the check-out time
  lastTimeTrackingEntry.checkOut = new Date();

  lastTimeTrackingEntry.active = false;

  const data = await timeTrackerService.editSpecificTimeTrackerService({
    id: lastTimeTrackingEntry._id,
    body: lastTimeTrackingEntry,
  });

  console.log(data);

  successResponseData({
    res,
    message: "Checked out successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

export const duration = tryCatchWrapper(async (req, res) => {
  const timeTrackingId = req.body.timeTrackingId;

  // Find the most recent Time Tracking entry from the object
  let lastTimeTrackingEntry =
    await timeTrackerService.detailSpecificTimeTrackerService({
      id: timeTrackingId,
    });

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

export const pauseTimer = tryCatchWrapper(async (req, res) => {
  const reason = req.body.reason; // Get reason from the request body
  const timeTrackingId = req.body.timeTrackingId;
  // console.log(timeTrackingId);
  console.log(reason);
  try {
    const lastTimeTrackingEntry = await detailSpecificTimeTrackerService({
      id: timeTrackingId,
    });
    // Check if the retrieved TimeTracker document exists and if it's active

    if (
      !lastTimeTrackingEntry ||
      !lastTimeTrackingEntry.checkIn ||
      !lastTimeTrackingEntry.active
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        sucess: false,
        message:
          "You need to check in and have an active session before pausing timergg",
      });
    }

    lastTimeTrackingEntry.active = false;
    lastTimeTrackingEntry.pauseStatus = true;
    // A new PauseTimer object with timestamp and reason
    const newPauseTimer = {
      pauseTime: new Date(), // Setting pauseTime to the current timestamp
      reason: reason, // Set the reason for pausing
    };
    console.log(reason);
    // Append the new PauseTimer object to the pauseTimers array

    lastTimeTrackingEntry.pauseTimers.push(newPauseTimer);
    // Increment the pausedCount
    if (lastTimeTrackingEntry.pausedCount) {
      lastTimeTrackingEntry.pausedCount += 1;
    } else {
      lastTimeTrackingEntry.pausedCount = 1;
    }

    // Save the updated Time Tracking entry
    const updatedEntry =
      await timeTrackerService.editSpecificTimeTrackerService({
        id: lastTimeTrackingEntry._id,
        body: lastTimeTrackingEntry,
      });
    successResponseData({
      res,
      message: "Timer paused successfully.",
      statusCode: HttpStatus.CREATED,
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error while pausing time", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while pausing the timer.",
    });
  }
});

export const resumeTimer = tryCatchWrapper(async (req, res) => {
  const timeTrackingId = req.body.timeTrackingId;
  // Find the most recent paused Time Tracking entry for the user
  let timeTrackingEntry =
    await timeTrackerService.detailSpecificTimeTrackerService({
      id: timeTrackingId,
    });

  if (!timeTrackingEntry) {
    return res.status(HttpStatus.NOT_FOUND).json({
      sucess: false,
      message: "Time tracking entry not found",
    });
  }

  // Check if the user has a paused session

  if (timeTrackingEntry.active) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      messsage: "You must have a paused session to resume the timer",
    });
  }

  // Update the Time Tracking entry to indicate it's resumed
  timeTrackingEntry.active = true;
  timeTrackingEntry.pauseStatus = false;

  const currentTime = new Date(); // Get the current timestamp
  timeTrackingEntry.resumeTimer.push(currentTime); // Push the current time

  // Save the updated Time Tracking entry
  const updatedEntry = await timeTrackerService.editSpecificTimeTrackerService({
    id: timeTrackingEntry._id,
    body: timeTrackingEntry,
  });

  successResponseData({
    res,
    message: "Timer resumed successfully.",
    statusCode: HttpStatus.CREATED,
    data: updatedEntry,
  });
});

export const calculatePausedDuration = tryCatchWrapper(async (req, res) => {
  const { pauseTimer, resumeTimer, pausedDuration } = req.body;

  if (!pauseTimer || !resumeTimer) {
    return res
      .status(400)
      .json({ message: "Both pauseTimer and resumeTimer are required." });
  }

  const pauseTime = new Date(pauseTimer).getTime();
  const resumeTime = new Date(resumeTimer).getTime();
  const pauseDurationSeconds = (resumeTime - pauseTime) / 1000;
  const updatedPausedDuration = pausedDuration - pauseDurationSeconds;

  if (updatedPausedDuration < 0) {
    return res
      .status(400)
      .json({ message: "Paused duration cannot be negative." });
  }

  // Update the pausedDuration in your database or data store with updatedPausedDuration
  // ...

  return res.status(200).json({ updatedPausedDuration });
});

export const getCheckInTime = tryCatchWrapper(async (req, res) => {
  const timeTrackingId = req.params.id;
  // console.log(timeTrackingId, "jj");
  // Retrieve the user's most recent check-in time

  const lastCheckInTimeEntry = await getLastTimeTracking(timeTrackingId);

  console.log(
    "d",
    JSON.parse(JSON.stringify(lastCheckInTimeEntry)),
    timeTrackingId,
    lastCheckInTimeEntry?.checkIn
  );

  if (lastCheckInTimeEntry && lastCheckInTimeEntry.checkIn) {
    // Sending the check-in time as a response if it exists
    successResponseData({
      res,
      message: "Check-In time retrieved successfully",
      statusCode: HttpStatus.OK,
      data: {
        checkInTime: { ...JSON.parse(JSON.stringify(lastCheckInTimeEntry)) },
      },
    });
  } else {
    // Sending a response indicating that no check-in time is available
    successResponseData({
      res,
      message: "No check-in time available for the user",
      statusCode: HttpStatus.OK,
      data: { checkInTime: null },
    });
  }
});

export const addNotes = tryCatchWrapper(async (req, res) => {
  const timeTrackingId = req.body.timeTrackingId;
  const newNote = req.body.notes;
  // Find the most recent paused Time Tracking entry for the user
  let timeTrackingEntry =
    await timeTrackerService.detailSpecificTimeTrackerService({
      id: timeTrackingId,
    });

  if (!timeTrackingEntry) {
    return res.status(404).json({ message: "Time tracking entry not found" });
  }

  // Append the notes in the time tracking entry
  timeTrackingEntry.notes.push(newNote);

  // Save the updated time tracking entry to the database
  await timeTrackingEntry.save();

  successResponseData({
    res,
    message: "Notes added sucessfully ",
    statusCode: HttpStatus.OK,
    data: timeTrackingEntry,
  });
});
