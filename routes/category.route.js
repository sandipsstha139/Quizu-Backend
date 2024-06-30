import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(verifyJWT, restrictTo("admin"), createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .patch(verifyJWT, restrictTo("admin"), updateCategory)
  .delete(verifyJWT, restrictTo("admin"), deleteCategory);

export default router;
