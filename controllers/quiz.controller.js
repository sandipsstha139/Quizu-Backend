import Quiz from "../models/quiz.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createQuiz = CatchAsync(async (req, res, next) => {
  const quiz = await Quiz.create(req.body);

  res.status(200).json({
    status: "Success",
    message: "Quiz Created Successfully",
    data: {
      quiz,
    },
  });
});

export const getQuiz = CatchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate("questions");

  if (!quiz) {
    return next(new AppError("Quiz not found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Quiz fetched Successfully",
    data: {
      quiz,
    },
  });
});
export const getAllQuiz = CatchAsync(async (req, res, next) => {
  const quizs = await Quiz.find().populate("questions");
  res.status(200).json({
    status: "Success",
    results: quizs.length,
    message: "Quizs fetched Successfully",
    data: {
      quizs,
    },
  });
});

export const updateQuiz = CatchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!quiz) {
    return next(new AppError("Quiz not found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Quiz updated Successfully",
    data: {
      quiz,
    },
  });
});
export const deleteQuiz = CatchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);

  if (!quiz) {
    return next(new AppError("Quiz not found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Quiz Deleted Successfully",
  });
});
