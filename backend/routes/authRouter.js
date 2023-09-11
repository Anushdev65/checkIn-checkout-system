import { Router } from "express";
import { authController } from "../controllers/index.js";

export const authRouter = Router();

authRouter.route("/login").post(authController.AddAuthUser);

export default authRouter;
