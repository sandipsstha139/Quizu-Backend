import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/sendEmail.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// ============== Filter Object for allowed fields  ================

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ============== Generate Access and Refresh Token  ================
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return next(
      new AppError(
        "Something went wrong while generating referesh and access token",
        500
      )
    );
  }
};

export const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please fill the form Completely!", 400));
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return next(new AppError("User does not exists!", 404));
  }

  const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

  console.log(password);

  console.log(isPasswordCorrect);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid Credentials!", 400));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    existingUser._id
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      status: "success",
      message: "User Logged in Successfully",
      data: {
        loggedInUser,
        accessToken,
      },
    });
});

export const register = CatchAsync(async (req, res, next) => {
  const { fullname, email, password, role } = req.body;

  if (
    !email ||
    !password ||
    !fullname ||
    email === "" ||
    password === "" ||
    fullname === ""
  ) {
    return next(new AppError("Please fill the form Completely!", 400));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("User Already Exists!", 400));
  }

  const user = await User.create({ fullname, email, password, role });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      status: "success",
      message: "User Registerd Successfully",
      data: {
        createdUser,
      },
    });
});

export const forgetPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = uuidv4().substr(0, 6);

  // Set OTP expiration time (10 minutes from now)
  const otpExpires = Date.now() + 10 * 60 * 1000;

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { passwordResetOTP: otp, passwordResetExpires: otpExpires } },
    { new: true, upsert: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "Email not found.",
    });
  }

  console.log(user);

  try {
    await sendEmail({
      email,
      subject: "Password Reset OTP",
      message: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully.",
    });
  } catch (err) {
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const verifyOtp = CatchAsync(async (req, res, next) => {
  const { otp } = req.body;

  const user = await User.findOne({ passwordResetOTP: otp });

  // Verify OTP and check expiration time
  if (!user || user.passwordResetExpires < Date.now()) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired OTP.",
    });
  }

  await User.findOneAndUpdate(
    { passwordResetOTP: otp },
    { $unset: { passwordResetOTP: "", passwordResetExpires: "" } }
  );

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user
  );

  const options = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      status: "success",
      message: "OTP verified successfully.",
    });
});

export const resetPassword = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("Token invalid or expired!"), 400);
  }
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return next(
      new AppError("Password and Confiirm password donot match!"),
      400
    );
  }

  user.password = newPassword;
  await user.save();

  const options = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      status: "success",
      message: "Password reset successful.",
    });
};

export const logout = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      status: "success",
      messsage: "User Logged out Successfully",
    });
});

export const getMe = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("score")
    .select("-password -refreshToken");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateAvatar = CatchAsync(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return next(new AppError("Avatar File missing!", 404));
  }

  const currentUser = await User.findById(req.user?._id);

  if (currentUser.avatar) {
    const oldAvatarPublicId = currentUser.avatar.split("/").pop().split(".")[0];
    console.log(currentUser.avatar);
    await deleteFromCloudinary(oldAvatarPublicId);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    return next(new AppError("Error while uploading avatar!", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json({
    status: "success",
    message: "Avatar updated Successfully!",
    data: {
      user,
    },
  });
});

export const changePassword = CatchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;

  if (!currentPassword || !password || !confirmPassword) {
    return next(new AppError("All fields are required!", 404));
  }
  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid Current Password", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new AppError("Password and Confirm Password does not match", 400)
    );
  }

  user.password = password;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Password Updated Successfully!",
  });
});

export const updateProfile = CatchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for Password Updates. Please use /change-password. ",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "fullname", "phNumber");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  res.status(200).json({
    status: "success",
    message: "Profile Updated Successfully!",
    data: {
      updatedUser,
    },
  });
});

export const refreshAccessToken = CatchAsync(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new AppError("Unauthorized Access!", 400));
  }

  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return next(new AppError(" Invalid Refresh Token!", 400));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return next(new AppError("Refresh Token has been expired!", 400));
    }

    const options = {
      httpOnly: true,
      secure: true,
      overwrite: true,
      sameSite: "none",
    };
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: "success",
        message: "Access Token has been Refreshed",
      });
  } catch (error) {
    return next(new AppError(error?.message || "Invalid Refresh Token", 401));
  }
});

export const getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find().select("-password -refreshToken");
  const role_user = users.filter((user) => user.role === "user");
  const role_admin = users.filter((user) => user.role === "admin");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users: {
        results: role_user.length,
        role_user,
      },
      admin: {
        results: role_admin.length,
        role_admin,
      },
    },
  });
});

export const deleteUser = CatchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found with that id!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User Deleted Successfully!",
  });
});
