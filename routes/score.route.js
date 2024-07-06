import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createScore,
  deleteScore,
  fetchTopThreeScorers,
  getAllScore,
  getScoreById,
  getScoreByUser,
  updateScore,
} from "../controllers/score.controller.js";

const router = express.Router();

router.route("/").get(getAllScore).post(verifyJWT, createScore);

router
  .route("/:id")
  .get(getScoreById)
  .patch(verifyJWT, updateScore)
  .delete(verifyJWT, deleteScore);

router.route("/profile/:userId").get(verifyJWT, getScoreByUser);
router.get("/top/three", verifyJWT, fetchTopThreeScorers);

export default router;
