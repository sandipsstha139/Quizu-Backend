import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { CatchAsync } from "../utils/catchAsync.js";

export const verifyJWT = CatchAsync(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new AppError("Unauthorized request", 403));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new AppError("Invalid Access Token", 404));
    }

    req.user = user;

    const passwordAgeInDays =
      (Date.now() - new Date(user.lastPasswordChange).getTime()) /
      (1000 * 60 * 60 * 24);

    if (passwordAgeInDays > 90) {
      return res
        .status(403)
        .json({ message: "Password has expired, please reset your password." });
    }
    next();
  } catch (error) {
    return next(new AppError(error?.message || "Invalid access token", 401));
  }
});
