import Question from "../models/question.model.js";
import Quiz from "../models/quiz.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const createQuestion = CatchAsync(async (req, res, next) => {
  const { questionTitle, options, correct_option, quiz } = req.body;

  const existingQuiz = await Quiz.findById(quiz);
  if (!existingQuiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  const coverImageLocalPath = req.file?.path;

  let coverImageUrl;
  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
      return next(new AppError("Error while uploading coverImage!", 400));
    }
    coverImageUrl = coverImage.url;
  }

  const question = await Question.create({
    questionTitle,
    options,
    correct_option,
    coverImage: coverImageUrl,
    quiz,
  });

  existingQuiz.questions.push(question._id);
  await existingQuiz.save();

  res.status(201).json({
    status: "Success",
    message: "Question Created Successfully",
    data: {
      question,
    },
  });
});

export const getAllQuestions = CatchAsync(async (req, res, next) => {
  const questions = await Question.find().populate({
    path: "quiz",
    populate: "category",
  });

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
  const question = await Question.findById(req.params.id).populate({
    path: "quiz",
    populate: "category",
  });

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
  const { questionTitle, options, correct_option } = req.body;

  const currentQuestion = await Question.findById(req.params.id);
  if (!currentQuestion) {
    return next(new AppError("No Question found with that id!", 404));
  }

  if (currentQuestion.coverImage) {
    const oldCoverImagePublicId = currentQuestion.coverImage
      .split("/")
      .pop()
      .split(".")[0];
    await deleteFromCloudinary(oldCoverImagePublicId);
  }

  let coverImageUrl;
  const coverImageLocalPath = req.file?.path;
  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
      return next(new AppError("Error while uploading coverImage!", 400));
    }
    coverImageUrl = coverImage.url;
  }

  const updateFields = {
    questionTitle,
    options,
    correct_option,
    coverImage: coverImageUrl || currentQuestion.coverImage,
  };

  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedQuestion) {
    return next(new AppError("No Question found with that id!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Question Updated Successfully",
    data: {
      question: updatedQuestion,
    },
  });
});

export const deleteQuestion = CatchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return next(new AppError("No Question found with that id!", 404));
  }

  if (question.coverImage) {
    const oldCoverImagePublicId = question.coverImage
      .split("/")
      .pop()
      .split(".")[0];
    await deleteFromCloudinary(oldCoverImagePublicId);
  }

  res.status(200).json({
    status: "Success",
    message: "Question Deleted Successfully",
  });
});
