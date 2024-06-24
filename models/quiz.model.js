import mongoose, { Schema } from "mongoose";

export const categorySchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  questions: questionSchema,
});

export const questionSchema = newSchema({
  name: String,
  options: String,
});
