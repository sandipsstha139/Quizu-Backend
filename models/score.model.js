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
  },
  { timestamps: true }
);

const Score = mongoose.model("Score", scoreSchema);

export default Score;
