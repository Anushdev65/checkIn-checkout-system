import { Router } from "express";
import { trackingLogController } from "../controllers/index.js";
import { sortFilterPagination } from "../middleware/sortSelectPage.js";

const trackingLogRouter = Router();

trackingLogRouter
  .route("/")
  .post(trackingLogController.addTrackingLog)
  .get(trackingLogController.detailAllTrackingLog, sortFilterPagination);

trackingLogRouter
  .route("/:id")
  .put(trackingLogController.editTrackingLog)
  .delete(trackingLogController.deleteSpecificTrackingLog)
  .get(trackingLogController.detailSpecificTrackingLog);



export default trackingLogRouter;
