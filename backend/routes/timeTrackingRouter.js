import { Router } from "express";
import { sortFilterPagination } from "../middleware/sortSelectPage.js";
import { timeTrackingController } from "../controllers/index.js";

export const timeTrackerRouter = Router();

timeTrackerRouter
  .route("/")
  .post(timeTrackingController.addTimeTracker)
  .get(timeTrackingController.detailAllTimeTracker, sortFilterPagination);

timeTrackerRouter
  .route("/:id")
  .put(timeTrackingController.editTimeTracker)
  .get(timeTrackingController.detailSpecificTimeTracker)
  .delete(timeTrackingController.deleteSpecificTimeTracker);

timeTrackerRouter.route("/checkin").post(timeTrackingController.checkIn);

timeTrackerRouter.route("/checkout").post(timeTrackingController.checkOut);
timeTrackerRouter.route("/duration").post(timeTrackingController.duration);
timeTrackerRouter
  .route("/resume/timer")
  .post(timeTrackingController.resumeTimer);

timeTrackerRouter.route("/pause/timer").post(timeTrackingController.pauseTimer);

export default timeTrackerRouter;