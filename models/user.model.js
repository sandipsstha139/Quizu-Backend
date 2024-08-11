import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { scoreSchema } from "./score.model.js";
import validator from "validator";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
    },
    phNumber: {
      type: Number,
      minLength: [10, "Phone number must be 10 digits"],
      maxLength: [10, "Phone number must be 10 digits"],
    },
    score: [
      {
        type: Schema.Types.ObjectId,
        ref: "Score",
        required: true,
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 characters long"],
      select: false,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordResetOTP: {
      type: String,
    },

    passwordResetExpires: String,
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedAttempt: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcryptjs.hashSync(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcryptjs.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      role: this.role,
      score: this.score,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
