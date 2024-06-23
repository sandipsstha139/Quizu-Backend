import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createQuiz,
  deleteQuiz,
  getAllQuiz,
  getQuiz,
  updateQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.route("/").get(getAllQuiz).post(verifyJWT, createQuiz);

router
  .route("/:id")
  .get(getQuiz)
  .patch(verifyJWT, updateQuiz)
  .delete(verifyJWT, deleteQuiz);

export default router;
