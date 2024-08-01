import express from "express";
import {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserByuserId,
  searchUsers,
  getMutualFollowedUsers,
} from "../controllers/user.controller.js";
import upload from "../utils/uploadByMulter.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Set up multer for file uploads

router.put("/users/:id", verifyToken, upload.single("avatar"), updateUser);
router.get("/users", verifyToken, getAllUsers);
router.get("/",verifyToken,getUserByuserId)
router.get("/search",verifyToken,searchUsers)
router.get("/:id", verifyToken, getUserById);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/f/:personid/follow", verifyToken, followUser);
router.post("/uf/:personid/unfollow", verifyToken, unfollowUser);
router.get("/:personid/followers", verifyToken, getFollowers);
router.get("/:personid/following", verifyToken, getFollowing);
router.get("/users/getMutualFollowedUsers", verifyToken, getMutualFollowedUsers);
export default router;
