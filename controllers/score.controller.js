import Score from "../models/score.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createScore = CatchAsync(async (req, res, next) => {
  const score = await Score.create(req.body);

  res.status(200).json({
    status: "Success",
    message: "Score Created Successfully",
    data: {
      score,
    },
  });
});

export const getScoreById = CatchAsync(async (req, res, next) => {
  const score = await Score.findById(req.params.id).populate("user quiz");

  if (!score) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Score fetched Successfully",
    data: {
      score,
    },
  });
});
export const getAllScore = CatchAsync(async (req, res, next) => {
  const scores = await Score.find();
  // .populate({
  //   path: "user",
  //   select: "fullname",
  // })
  // .populate({
  //   path: "quiz",
  // });

  if (!scores) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    results: scores.length,
    message: "Score fetched Successfully",
    data: {
      scores,
    },
  });
});
export const updateScore = CatchAsync(async (req, res, next) => {
  const score = await Score.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!score) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Score Updated Successfully",
    data: {
      score,
    },
  });
});
export const deleteScore = CatchAsync(async (req, res, next) => {
  const score = await Score.findByIdAndDelete(req.params.id);

  if (!score) {
    return next(new AppError("No score found with that id!", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Score Deleted Successfully",
  });
});
