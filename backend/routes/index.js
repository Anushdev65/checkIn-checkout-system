import { Router } from "express";
import timeTrackerRouter from "./timeTrackingRouter.js";
import authRouter from "./authRouter.js";
import trackingLogRouter from "./trackingLogRouter.js";

const apiRouter = Router();

const OurRoutes = [
  {
    path: `/time/tracker`,
    router: timeTrackerRouter,
  },

  {
    path: `/auth`,
    router: authRouter,
  },

  {
    path: `/tracking/log`,
    router: trackingLogRouter,
  },
];

// Map defined routes to their respective routers
OurRoutes.forEach((route) => {
  apiRouter.use(route.path, route.router);
});


export default apiRouter;

