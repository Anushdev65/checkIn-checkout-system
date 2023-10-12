import { Router } from "express";
import { timeTrackingController } from "../controllers/index.js";
import { sortFilterPagination } from "../middleware/sortSelectPage.js";
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

timeTrackerRouter
  .route("/pause/duration")
  .post(timeTrackingController.calculatePausedDuration);

timeTrackerRouter
  .route("/save/checkin/:id")
  .get(timeTrackingController.getCheckInTime);

timeTrackerRouter.route("/note").post(timeTrackingController.addNotes);

export default timeTrackerRouter;
