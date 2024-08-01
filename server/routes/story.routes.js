// routes/storyRoutes.js
import express from "express";
const router = express.Router();
import upload from "../utils/uploadByMulter.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createStory,
  getAllStories,
  toggleLikeStory,
} from "../controllers/story.controller.js";
router.route("/").post(verifyToken, upload.single("file"), createStory);

router.route("/stories").get(verifyToken, getAllStories);

router.route("/:storyId/like").post(verifyToken, toggleLikeStory);

export default router;
