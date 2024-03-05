import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";
import tryCatchWrapper from "../middleware/tryCatchWrapper.js";
import { authService, trackingLogService } from "../services/index.js";
import { Auth, TimeTracker, TrackingLog } from "../schemasModel/model.js";

// Controller function to add a new tracking Log entry
export const addTrackingLog = tryCatchWrapper(async (req, res) => {
  // Extract request body
  let body = req.body;
  console.log(body, "bodybody");
  let user = req.info.userId;

  let timeTrackerData = await TimeTracker.findById(body.timeTracker);

  // if (!timeTrackerData) {
  //   return errorResponseData({
  //     res,
  //     message: "TimeTracker not found",
  //     statusCode: HttpStatus.NOT_FOUND,
  //   });
  // }

  let userData = await authService.detailSpecificAuthUserService({
    id: user,
  });
  console.log(userData, "bobo");
  body.date = new Date();

  const trackingLogEntry = {
    user: user,
    timeTracker: timeTrackerData,
    date: body.date,
  };

  let data = await trackingLogService.addTrackingLogService({
    body: trackingLogEntry,
  });

  successResponseData({
    res,
    message: "Time tracked successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
  console.log(data, "blu blu");
});

// Controller function to edit an existing tracking Log entry
export const editTrackingLog = tryCatchWrapper(async (req, res) => {
  // Extract request body and ID parameter
  let body = { ...req.body };
  let id = req.params.id;

  // Call the service function to edit a specific tracking Log
  let data = await trackingLogService.editSpecificTrackingLogService({
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

// Controller function to retrieve a specific tracking Log entry by ID
export const detailSpecificTrackingLog = tryCatchWrapper(async (req, res) => {
  // Extract ID parameter
  let id = req.params.id;

  // Call the service function to retrieve a specific tracking Log
  let data = await trackingLogService.detailSpecificTrackingLogService({ id });

  // Send a success response
  successResponseData({
    res,
    message: "Read time tracking successfully",
    statusCode: HttpStatus.OK,
    data,
  });
});

// Controller function to retrieve all tracking Log entries
export const detailAllTrackingLog = tryCatchWrapper(async (req, res, next) => {
  // Initialize a 'find' object for querying all tracking Log entries

  const { date } = req.query;

  if (date) {
    const formattedDate = new Date(date);

    req.find = { date: formattedDate };
  } else {
    req.find = {}; 
  }

  // Pass 'find' and the service function to the next middleware
  req.service = trackingLogService.detailAllTrackingLogService;

  next();
});

// Controller function to delete a specific tracking Log entry by ID
export const deleteSpecificTrackingLog = tryCatchWrapper(async (req, res) => {
  // Extract ID parameter
  let id = req.params.id;

  // Call the service function to delete a specific tracking Log
  let data = await trackingLogService.deleteSpecificTrackingLogService({ id });

  // Send a success response
  successResponseData({
    res,
    message: "Deleted successfully",
    statusCode: HttpStatus.OK,
    data,
  });
});

export const getCreateLog = tryCatchWrapper(async (req, res) => {
  let id = req.params.id;
});
