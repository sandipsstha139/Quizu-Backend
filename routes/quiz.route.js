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
import { upload } from "../middleware/multer.js";

const router = express.Router();

router
  .route("/")
  .get(getAllQuiz)
  .post(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    createQuiz
  );

router
  .route("/:id")
  .get(getQuiz)
  .patch(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    updateQuiz
  )
  .delete(verifyJWT, restrictTo("admin"), deleteQuiz);

export default router;
