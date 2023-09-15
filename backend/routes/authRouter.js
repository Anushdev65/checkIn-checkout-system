import { Router } from "express";
import { authController } from "../controllers/index.js";
import validation from "../middleware/validation.js";
import registerSchema from "../validation/registerValidation.js";
import loginSchema from "../validation/loginValidation.js";
export const authRouter = Router();

authRouter
  .route("/register")
  .post(validation(registerSchema), authController.addAuthUser);

authRouter
  .route("/login")
  .post(validation(loginSchema), authController.loginUser);
export default authRouter;
