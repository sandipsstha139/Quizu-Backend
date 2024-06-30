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
import { upload } from "../middleware/multer.js";

const router = express.Router();

router
  .route("/")
  .get(getAllQuestions)
  .post(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    createQuestion
  );

router
  .route("/:id")
  .get(getQuestion)
  .patch(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    updateQuestion
  )
  .delete(verifyJWT, restrictTo("admin"), deleteQuestion);

export default router;
