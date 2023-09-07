import { Router } from "express";
import { authController } from "../controllers/index.js";

export const authRouter = Router();

authRouter.route("/signup").post(authController.AddAuthUser);

export default authRouter;
