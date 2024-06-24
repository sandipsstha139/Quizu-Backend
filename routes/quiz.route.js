import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createQuiz,
  deleteQuiz,
  getAllQuiz,
  getQuiz,
  updateQuiz,
} from "../controllers/quiz.controller.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getAllQuiz)
  .post(verifyJWT, restrictTo("admin"), createQuiz);

router
  .route("/:id")
  .get(getQuiz)
  .patch(verifyJWT, restrictTo("admin"), updateQuiz)
  .delete(verifyJWT, restrictTo("admin"), deleteQuiz);

export default router;
