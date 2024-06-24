import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
  updateBook,
} from "../controllers/book.controller.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getAllBooks)
  .post(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    createBook
  );

router
  .route("/:id")
  .get(getSingleBook)
  .patch(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    updateBook
  )
  .delete(verifyJWT, restrictTo("admin"), deleteBook);

export default router;
