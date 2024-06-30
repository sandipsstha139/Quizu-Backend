import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import Category from "../models/category.model.js";

export const createQuiz = CatchAsync(async (req, res, next) => {
  const { title, description, category, questions } = req.body;

  if (!title || !description || !category || !questions) {
    return next(new AppError("All fields are required!", 400));
  }

  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return next(new AppError("No Category found with that ID", 404));
  }

  // Check if questions is a valid JSON string or an array of valid ObjectId strings
  let questionsArray;
  try {
    questionsArray =
      typeof questions === "string" ? JSON.parse(questions) : questions;
  } catch (error) {
    return next(new AppError("Invalid questions format!", 400));
  }

  console.log(questionsArray);

  if (
    !Array.isArray(questionsArray) ||
    !questionsArray.every((id) => mongoose.Types.ObjectId.isValid(id))
  ) {
    return next(
      new AppError("Questions must be an array of valid ObjectId strings!", 400)
    );
  }

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    return next(new AppError("Quiz Cover Image is missing!", 404));
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    return next(new AppError("Error while uploading coverImage!", 400));
  }

  const quiz = await Quiz.create({
    title,
    description,
    category,
    coverImage: coverImage.url,
    questions: questionsArray,
  });

  existingCategory.quizzes.push(quiz._id);
  await existingCategory.save();

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
  const { title, description, category, questions } = req.body;

  if (!title || !description || !category || !questions) {
    return next(new AppError("All fields are required!", 400));
  }

  // Check if questions is a valid JSON string or an array of valid ObjectId strings
  let questionsArray;
  try {
    questionsArray =
      typeof questions === "string" ? JSON.parse(questions) : questions;
  } catch (error) {
    return next(new AppError("Invalid questions format!", 400));
  }

  console.log(questionsArray);

  if (
    !Array.isArray(questionsArray) ||
    !questionsArray.every((id) => mongoose.Types.ObjectId.isValid(id))
  ) {
    return next(
      new AppError("Questions must be an array of valid ObjectId strings!", 400)
    );
  }

  const currentQuiz = await Quiz.findById(req.params.id);
  if (!currentQuiz) {
    return next(new AppError("No quiz found with that ID", 404));
  }

  if (currentQuiz.coverImage) {
    const oldCoverImagePublicId = currentQuiz.coverImage
      .split("/")
      .pop()
      .split(".")[0];
    console.log(currentQuiz.coverImage);
    await deleteFromCloudinary(oldCoverImagePublicId);
  }

  let coverImageUrl;
  const coverImageLocalPath = req.file?.path;

  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
      return next(new AppError("Error while uploading Quiz coverImage!", 400));
    }
    coverImageUrl = coverImage.url;
  }

  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      category,
      coverImage: coverImageUrl,
      questions: questionsArray,
    },
    {
      new: true,
      runValidators: true,
    }
  );

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
