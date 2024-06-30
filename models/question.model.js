import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    questionTitle: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
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
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
