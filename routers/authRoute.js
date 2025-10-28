import { Router } from "express";
import {
  login,
  register,
  logout,
  refreshToken,
} from "../controllers/authController.js";
const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);
router.route("/refresh").post(refreshToken);

export default router;
