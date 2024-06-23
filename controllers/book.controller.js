import Book from "../models/book.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createBook = CatchAsync(async (req, res, next) => {
  const { title, description, author, publication, edition } = req.body;
  console.log(req.body);
  if (!title || !description || !author || !publication || !edition) {
    return next(new AppError("All Fields Required!", 404));
  }

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    return next(new AppError("Book Cover Image is missing!", 404));
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    return next(new AppError("Error while uploading coverImage!", 400));
  }

  const book = await Book.create({
    title,
    description,
    author,
    publication,
    edition,
    coverImage: coverImage.url,
  });

  res.status(201).json({
    status: "success",
    message: "Book Created Successfully!",
    data: {
      book,
    },
  });
});

export const getAllBooks = CatchAsync(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    status: "success",
    results: books.length,
    message: "Books Fetched Successfully",
    data: {
      books,
    },
  });
});

export const getSingleBook = CatchAsync(async (req, res, next) => {
  const singleBook = await Book.findById(req.params.id);

  if (!singleBook) {
    return next(new AppError("Book does not found with that id!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Single Book Fetched Successfully",
    data: {
      singleBook,
    },
  });
});

export const updateBook = CatchAsync(async (req, res, next) => {
  const { title, description, author, publication, edition } = req.body;

  let coverImageUrl;
  const coverImageLocalPath = req.file?.path;

  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
      return next(new AppError("Error while uploading Book coverImage!", 400));
    }
    coverImageUrl = coverImage.url;
  }

  const updateFields = { title, description, author, publication, edition };
  if (coverImageUrl) {
    updateFields.coverImage = coverImageUrl;
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBook) {
    return next(new AppError("No Book found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Book Updated Successfully!",
    data: {
      updatedBook,
    },
  });
});

export const deleteBook = CatchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next(new AppError("Book with that id doesnot found!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Book Deleted Successfully",
  });
});
