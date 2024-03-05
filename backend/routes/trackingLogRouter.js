import { Router } from "express";
import { trackingLogController } from "../controllers/index.js";
import { sortFilterPagination } from "../middleware/sortSelectPage.js";
import { isValidToken } from "../middleware/isValidToken.js";

const trackingLogRouter = Router();

trackingLogRouter
  .route("/")
  .post(isValidToken, trackingLogController.addTrackingLog)
  .get(trackingLogController.detailAllTrackingLog, sortFilterPagination);

trackingLogRouter
  .route("/:id")
  .put(trackingLogController.editTrackingLog)
  .delete(trackingLogController.deleteSpecificTrackingLog)
  .get(trackingLogController.detailSpecificTrackingLog);

export default trackingLogRouter;
