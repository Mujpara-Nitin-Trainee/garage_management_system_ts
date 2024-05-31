import express from "express";
import * as userController from "../../controllers/userControllers";
import { userProfile, editProfile } from "../../controllers/staticControllers";
import { uploadMiddleware } from "../../middlewares/uploadMiddleware";

const router = express.Router();

router.get("/", userProfile);
router.get("/edit", editProfile);
router.put("/update", uploadMiddleware, userController.updateProfile);

export default router;
