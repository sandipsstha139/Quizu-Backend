import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createScore,
  deleteScore,
  getAllScore,
  getScoreById,
  updateScore,
} from "../controllers/score.controller.js";

const router = express.Router();

router.route("/").get(getAllScore).post(verifyJWT, createScore);

router
  .route("/:id")
  .get(getScoreById)
  .patch(verifyJWT, updateScore)
  .delete(verifyJWT, deleteScore);

export default router;
