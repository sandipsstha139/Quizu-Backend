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

const router = express.Router();

router
  .route("/")
  .get(getAllBooks)
  .post(verifyJWT, upload.single("coverImage"), createBook);

router
  .route("/:id")
  .get(getSingleBook)
  .patch(verifyJWT, upload.single("coverImage"), updateBook)
  .delete(verifyJWT, deleteBook);

export default router;
