import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is Required!"],
    },
    author: {
      type: String,
      required: [true, "Author Name is Required!"],
    },
    publication: {
      type: String,
      required: [true, "Publication is Required!"],
    },
    edition: {
      type: String,
      required: [true, "Edition is Required!"],
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
