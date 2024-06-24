import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controllers/question.controller.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getAllQuestions)
  .post(verifyJWT, restrictTo("admin"), createQuestion);

router
  .route("/:id")
  .get(getQuestion)
  .patch(verifyJWT, restrictTo("admin"), updateQuestion)
  .delete(verifyJWT, restrictTo("admin"), deleteQuestion);

export default router;
