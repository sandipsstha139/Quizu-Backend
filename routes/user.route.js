import express from "express";
import {
  changePassword,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMe,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  updateAvatar,
  updateProfile,
  verifyOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router.route("/refresh-token").post(refreshAccessToken);

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(verifyJWT, logout);
router.route("/me").get(verifyJWT, getMe);

router.route("/forget-password").post(forgetPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(verifyJWT, resetPassword);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/update-profile").patch(verifyJWT, updateProfile);

router.route("/").get(verifyJWT, restrictTo("admin"), getAllUsers);
router.route("/:id").delete(verifyJWT, restrictTo("admin"), deleteUser);

export default router;
