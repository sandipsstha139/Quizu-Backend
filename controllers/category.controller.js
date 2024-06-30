import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createCategory = CatchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError("Name field is required!", 400));
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new AppError("Category with that name already exists!", 400));
  }

  const category = await Category.create({ name });

  res.status(201).json({
    status: "Success",
    message: "Category Created Successfully",
    data: {
      category,
    },
  });
});

export const getAllCategories = CatchAsync(async (req, res, next) => {
  const categories = await Category.find().populate("quizzes");

  res.status(200).json({
    status: "Success",
    results: categories.length,
    message: "Categories fetched Successfully",
    data: {
      categories,
    },
  });
});

export const getCategoryById = CatchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("quizzes");

  if (!category) {
    return next(new AppError("Category not found with that ID!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Category fetched Successfully",
    data: {
      category,
    },
  });
});

export const updateCategory = CatchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError("Name field is required!", 400));
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new AppError("Category not found with that ID!", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Category updated Successfully",
    data: {
      category,
    },
  });
});

export const deleteCategory = CatchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found with that ID!", 404));
  }

  if (category.quizzes.length > 0) {
    await Quiz.updateMany(
      { _id: { $in: category.quizzes } },
      { $pull: { categories: req.params.id } }
    );
  }

  res.status(200).json({
    status: "Success",
    message: "Category deleted Successfully",
  });
});
