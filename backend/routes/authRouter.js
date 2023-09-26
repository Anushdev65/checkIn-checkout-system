import { Router } from "express";
import { authController } from "../controllers/index.js";
import validation from "../middleware/validation.js";
import registerSchema from "../validation/registerValidation.js";
import loginSchema from "../validation/loginValidation.js";
import { isValidToken } from "../middleware/isValidToken.js";
import logoutSchema from "../validation/logoutValidation.js";
export const authRouter = Router();

authRouter
  .route("/register")
  .post(validation(registerSchema), authController.addAuthUser);

authRouter
  .route("/login")
  .post(validation(loginSchema), authController.loginUser);

authRouter
  .route("/logout")
  .patch(validation(logoutSchema), isValidToken, authController.logoutUser);

export default authRouter;
