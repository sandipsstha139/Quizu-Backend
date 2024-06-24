import mongoose, { Schema } from "mongoose";

const examSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
    // TODO:
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
