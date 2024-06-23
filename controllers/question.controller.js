import Question from "../models/question.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createQuestion = CatchAsync(async (req, res, next) => {
  const question = await Question.create(req.body);

  res.status(200).json({
    status: "Success",
    message: "Question Created Successfully",
    data: {
      question,
    },
  });
});

export const getAllQuestions = CatchAsync(async (req, res, next) => {
  const questions = await Question.find();

  res.status(200).json({
    status: "Success",
    results: questions.length,
    message: "Questions Fetched Successfully",
    data: {
      questions,
    },
  });
});

export const getQuestion = CatchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError("No Question found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Question Fetched Successfully",
    data: {
      question,
    },
  });
});

export const updateQuestion = CatchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return next(new AppError("No Question found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Question Updated Successfully",
    data: {
      question,
    },
  });
});
export const deleteQuestion = CatchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return next(new AppError("No Question found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Question Deleted Successfully",
  });
});
