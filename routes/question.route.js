import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controllers/question.controller.js";

const router = express.Router();

router.route("/").get(getAllQuestions).post(verifyJWT, createQuestion);

router
  .route("/:id")
  .get(getQuestion)
  .patch(verifyJWT, updateQuestion)
  .delete(verifyJWT, deleteQuestion);

export default router;
