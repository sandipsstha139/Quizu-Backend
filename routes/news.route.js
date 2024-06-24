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
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getAllNews)
  .post(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    createNews
  );

router
  .route("/:id")
  .get(getSingleNews)
  .patch(
    verifyJWT,
    restrictTo("admin"),
    upload.single("coverImage"),
    updateNews
  )
  .delete(verifyJWT, restrictTo("admin"), deleteNews);

export default router;
