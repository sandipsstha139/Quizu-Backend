import News from "../models/news.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

export const createNews = CatchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  console.log(req.body);
  if (!title || !description) {
    return next(new AppError("All Fields Required!", 404));
  }

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    return next(new AppError("Cover Image is missing!", 404));
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    return next(new AppError("Error while uploading coverImage!", 400));
  }

  const news = await News.create({
    title,
    description,
    coverImage: coverImage.url,
  });

  res.status(201).json({
    status: "success",
    message: "News Created Successfully!",
    data: {
      news,
    },
  });
});

export const getAllNews = CatchAsync(async (req, res, next) => {
  const news = await News.find();
  res.status(200).json({
    status: "success",
    results: news.length,
    message: "News Fetched Successfully",
    data: {
      news,
    },
  });
});

export const getSingleNews = CatchAsync(async (req, res, next) => {
  const singleNews = await News.findById(req.params.id);

  if (!singleNews) {
    return next(new AppError("News does not found!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Single News Fetched Successfully",
    data: {
      singleNews,
    },
  });
});

export const updateNews = CatchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  const currentNews = await News.findById(req.params.id);
  if (!currentNews) {
    return next(new AppError("No news found with that ID", 404));
  }

  if (currentNews.coverImage) {
    console.log(currentNews.coverImage);
    const oldCoverImagePublicId = currentNews.coverImage
      .split("/")
      .pop()
      .split(".")[0];
    console.log(currentNews.coverImage);
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

  const updateFields = { title, description };
  if (coverImageUrl) {
    updateFields.coverImage = coverImageUrl;
  }

  const updatedNews = await News.findByIdAndUpdate(
    req.params.id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedNews) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "News Updated Successfully!",
    data: {
      updatedNews,
    },
  });
});

export const deleteNews = CatchAsync(async (req, res, next) => {
  const news = await News.findByIdAndDelete(req.params.id);

  if (!news) {
    return next(new AppError("News with that id doesnot found!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "News Deleted Successfully",
  });
});
