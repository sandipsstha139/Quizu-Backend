import mongoose, { Schema } from "mongoose";

export const scoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    correctAnswers: { type: Number },
    wrongAnswers: { type: Number },
    notAnswered: { type: Number },
    selected_options: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        option: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Score = mongoose.model("Score", scoreSchema);

export default Score;
