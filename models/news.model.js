import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema(
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
    coverImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

export default News;
