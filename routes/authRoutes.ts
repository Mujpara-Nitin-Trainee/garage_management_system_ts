import express from "express";
import { applyPassportStrategy } from "../middlewares/passport";
import * as userController from "../controllers/userControllers";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetValidator,
} from "../validators/userValidation";
import { signUp, signIn, forgot, resetPassword } from '../controllers/staticControllers';
const router = express.Router();

router.get("/", signUp);
router.post("/register", registerValidator, userController.register);

router.get("/signIn", signIn);
router.post("/login", loginValidator, userController.login);

router.get("/activate/:id/:token", userController.activate);

router.get("/forgotPassword", forgot);
router.post("/forgotPassword", forgotPasswordValidator, userController.forget);

router.get("/resetPassword/:email", resetPassword);
router.post("/resetPassword", resetValidator, userController.reset);

//route control
applyPassportStrategy();

export default router;
