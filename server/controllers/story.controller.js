// controllers/storyController.js
import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import uploadVideoToCloudinary from "../utils/uploadVideoToCloudinary.js";

// Create a new story
export const createStory = async (req, res) => {
  console.log("req.file", req.file);
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    let result;

    // Check the file type and upload accordingly
    if (file.mimetype.startsWith("image")) {
      result = await uploadImageToCloudinary(req.file.path, "stories");
    } else if (file.mimetype.startsWith("video")) {
      result = await uploadVideoToCloudinary(req.file.path, "stories");
    } else {
      return res.status(400).json({ message: "Invalid file type" });
    }

    // Remove the file from the local uploads folder
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });

    const story = new Story({
      user: req.user.id,
      Storymedia: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: error.message });
  }
};
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).populate(
      "user",
      "username avatar"
    );
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllStories = async (req, res) => {
  console.log("req.user.id", req.user);
  console.log(" req.query in getAllStories", req.query);
  const { page = 1, limit = 10 } = req.query;

  try {
    const stories = await Story.find({ user: { $ne: req.user.id } })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 }) // Sort stories by creation date in descending order
      .skip((page - 1) * limit)
      .limit(Number(limit));
    console.log("stories", stories);
    res.status(200).json(stories);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
};
export const toggleLikeStory = async (req, res) => {
  try {
    console.log("req.params.storyId", req.params.storyId);
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isLiked = story.likes.includes(req.user.id);

    if (isLiked) {
      story.likes = story.likes.filter(
        (like) => like.toString() !== req.user.id
      );
    } else {
      story.likes.push(req.user.id);
    }

    await story.save();
    res.status(200).json(story);
  } catch (error) {
    console.error("Error liking/unliking story:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
