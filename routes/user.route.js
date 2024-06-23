import express from "express";
import {
  changePassword,
  getMe,
  login,
  logout,
  refreshAccessToken,
  register,
  updateAvatar,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.route("/refresh-token").post(refreshAccessToken);

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(verifyJWT, logout);
router.route("/me").get(verifyJWT, getMe);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/update-profile").patch(verifyJWT, updateProfile);

export default router;
