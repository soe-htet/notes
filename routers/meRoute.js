import { Router } from "express";
import {
  getMe,
  updateMe,
  updateProfileImage,
  updateProfileImg,
} from "../controllers/meController.js";
import { uploadProfileImgLocal } from "../config/uploadLocal.js";
const router = Router();

router.route("/").get(getMe).post(updateMe);

router
  .route("/profileImage")
  .post(uploadProfileImgLocal.single("profileImage"), updateProfileImage);

router.route("/profileImage2").post(updateProfileImg);

export default router;
