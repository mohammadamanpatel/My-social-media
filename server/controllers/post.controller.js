import Post from "../models/post.model.js";
import User from "../models/user.model.js"; // Ensure to replace with the correct path and filename
import fs from "fs/promises";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import uploadVideoToCloudinary from "../utils/uploadVideoToCloudinary.js";
import Comment from "../models/comment.model.js";
import cloudinary from "cloudinary";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user.id;

    let newPostData = {
      user: userId,
      caption,
    };

    if (req.file && req.file.path) {
      const mimeType = req.file.mimetype.split("/")[0];
      if (mimeType === "image") {
        const result = await uploadImageToCloudinary(req.file.path, "posts");
        newPostData.image = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      } else if (mimeType === "video") {
        const result = await uploadVideoToCloudinary(req.file.path, "posts");
        newPostData.video = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }
      await fs.unlink(req.file.path); // Remove file from uploads folder
    }

    const newPost = new Post(newPostData);
    await newPost.save();

    // Update user's posts array
    const user = await User.findById(userId);
    user.posts.push(newPost._id);
    await user.save();
    console.log("user", user);
    console.log("newPost", newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar posts")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get a post by ID
export const getPostById = async (req, res) => {
  try {
    console.log("getPostsById", req.params);
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username avatar posts"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.file && req.file.path) {
      const mimeType = req.file.mimetype.split('/')[0];

      if (mimeType === 'image') {
        if (post.image) {
          // Delete the old image from Cloudinary
          await cloudinary.uploader.destroy(post.image.public_id, { resource_type: 'image' });
        }

        // Upload the new image to Cloudinary
        const result = await uploadImageToCloudinary(req.file.path, 'posts');
        post.image = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
        post.video = undefined; // Clear video if updating to image
      } else if (mimeType === 'video') {
        if (post.video) {
          // Delete the old video from Cloudinary
          await cloudinary.uploader.destroy(post.video.public_id, { resource_type: 'video' });
        }

        // Upload the new video to Cloudinary
        const result = await uploadVideoToCloudinary(req.file.path, 'posts');
        post.video = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
        post.image = undefined; // Clear image if updating to video
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }

      await fs.unlink(req.file.path); // Remove file from uploads folder
    }

    post.caption = caption || post.caption;
    const updatedPost = await post.save();

    // Update user's posts array if caption or media updated
    const user = await User.findById(req.user.id);
    const index = user.posts.indexOf(updatedPost._id);
    if (index !== -1) {
      user.posts.splice(index, 1, updatedPost._id);
      await user.save();
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    console.log("req.params for deleteion of posts", req.params);
    const post = await Post.findByIdAndDelete(req.params.id);
    console.log("post", post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (post.image && post.image.public_id) {
      const imageResult = await cloudinary.uploader.destroy(
        post.image.public_id
      );
      console.log("Deleted image from Cloudinary:", imageResult);
    }

    // Delete the video from Cloudinary if exists
    if (post.video && post.video.public_id) {
      const videoResult = await cloudinary.uploader.destroy(
        post.video.public_id
      );
      console.log("Deleted video from Cloudinary:", videoResult);
    }

    // Remove post from user's posts array
    const user = await User.findById(req.user.id);
    user.posts.pull(post._id);
    await user.save();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add a comment to a post

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id; // Get post ID from route params
    const userId = req.user.id; // Assuming userId is retrieved from authenticated user

    // Find the authenticated user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      text,
      users: [userId],
    });

    // Save the new comment
    const savedComment = await newComment.save();

    // Populate the user field in the saved comment
    const populatedComment = await Comment.findById(savedComment._id).populate({
      path: "users",
      select: "username avatar",
    });
    console.log("populatedComment", populatedComment);
    // Push the new comment object to the post's comments array
    post.comments.push(populatedComment._id);

    // Save the updated post
    await post.save();

    // Send the populated comment in the response
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getComments = async (req, res) => {
  try {
    // console.log("req.params.id in getComments",req.params);
    const postId = req.params.id; // Get post ID from route params

    // Find the post and populate the comments' user field
    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "users",
        select: "username avatar",
      },
    });
    // console.log("post",post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Send the populated post with comments in the response
    res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Like or unlike a post
export const toggleLikePost = async (req, res) => {
  try {
    console.log("req.params.id in like post", req.params.id);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
