import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  toggleLikePost,
  getComments,
} from "../controllers/post.controller.js";

import upload from "../utils/uploadByMulter.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .post(verifyToken, upload.single("file"), createPost)
  .get(getPosts);

router
  .route("/:id")
  .get(verifyToken,getPostById)
  .put(verifyToken, upload.single("file"), updatePost)
  .delete(verifyToken, deletePost);

router.route("/:id/comments").post(verifyToken, addComment).get(verifyToken,getComments);

router.route("/:id/like").post(verifyToken, toggleLikePost);

export default router;
