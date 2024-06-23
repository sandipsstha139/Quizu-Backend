import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    questionTitle: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correct_option: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
