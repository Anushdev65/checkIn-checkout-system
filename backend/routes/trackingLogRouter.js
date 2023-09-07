import { Router } from "express";
import { trackingLogController } from "../controllers/index.js";
import { sortFilterPagination } from "../middleware/sortSelectPage.js";

const trackingLogRouter = Router();

trackingLogRouter
  .route("/")
  .post(trackingLogController.addTrackingLog)
  .get(trackingLogController.detailAlltrackingLog, sortFilterPagination);

trackingLogRouter
  .route("/:id")
  .put(trackingLogController.editTrackingLog)
  .delete(trackingLogController.deleteSpecifictrackingLog);

trackingLogRouter
  .route("/:userId")
  .get(trackingLogController.detailSpecifictrackingLog);

export default trackingLogRouter;
