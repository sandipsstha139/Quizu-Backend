import express from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getSingleNews,
  updateNews,
} from "../controllers/news.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router
  .route("/")
  .get(getAllNews)
  .post(verifyJWT, upload.single("coverImage"), createNews);

router
  .route("/:id")
  .get(getSingleNews)
  .patch(verifyJWT, upload.single("coverImage"), updateNews)
  .delete(verifyJWT, deleteNews);

export default router;
