import User from "../models/user.model.js";
import fs from "fs";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import deleteImageFromCloudinary from "../utils/deleteImageFromCloudinary.js";

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      // If a new avatar is uploaded, handle the Cloudinary upload
      const result = await uploadImageToCloudinary(req.file.path, "avatars");

      // Delete the old avatar from Cloudinary
      if (user.avatar && user.avatar.public_id) {
        await deleteImageFromCloudinary(user.avatar.public_id);
      }

      updates.avatar = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      // Remove the uploaded file from the server
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(err);
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log("users",users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Fetch a user by ID
export const getUserById = async (req, res) => {
  try {
    // console.log("req.params in getUsersById", req.params);
    const { id } = req.params;
    // console.log("id of getUSerbyId",id);
    const user = await User.findById(id).populate("posts").exec();
    // console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserByuserId = async (req, res) => {
  try {
    // console.log("getUserByuserId",req.user);
    const user = await User.findById(req.user.id).populate("posts").exec();
    // console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Search for users by username
export const searchUsers = async (req, res) => {
  try {
    console.log("req.query......",req.query);
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Find users whose username matches the query (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avatar");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user's avatar from Cloudinary
    if (user.avatar && user.avatar.public_id) {
      await deleteImageFromCloudinary(user.avatar.public_id);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const followUser = async (req, res) => {
  try {
    const { personid: userIdToFollow } = req.params; // ID of the user to follow
    const { id: currentUserId } = req.user; // ID of the authenticated user

    // Ensure user is not following themselves
    if (userIdToFollow === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Update following for current user and followers for the user to follow
    const updatedCurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userIdToFollow } }, // Add userIdToFollow to following array if not already present
      { new: true }
    );

    const updatedUserToFollow = await User.findByIdAndUpdate(
      userIdToFollow,
      { $addToSet: { followers: currentUserId } }, // Add currentUserId to followers array if not already present
      { new: true }
    );

    if (!updatedCurrentUser || !updatedUserToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User followed successfully",
      updatedCurrentUser,
      updatedUserToFollow,
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { personid: userIdToUnfollow } = req.params; // ID of the user to unfollow
    const { id: currentUserId } = req.user; // ID of the authenticated user

    // Ensure user is not unfollowing themselves
    if (userIdToUnfollow === currentUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    // Update following for current user and followers for the user to unfollow
    const updatedCurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: userIdToUnfollow } }, // Remove userIdToUnfollow from following array
      { new: true }
    );

    const updatedUserToUnfollow = await User.findByIdAndUpdate(
      userIdToUnfollow,
      { $pull: { followers: currentUserId } }, // Remove currentUserId from followers array
      { new: true }
    );

    if (!updatedCurrentUser || !updatedUserToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User unfollowed successfully",
      updatedCurrentUser,
      updatedUserToUnfollow,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { personid: userId } = req.params; // ID of the user whose followers are to be retrieved

    const user = await User.findById(userId).populate(
      "followers",
      "username avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user.followers",user.followers);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting followers:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
// Get following of a user
export const getFollowing = async (req, res) => {
  try {
    const { personid: userId } = req.params; // ID of the user whose following list is to be retrieved

    const user = await User.findById(userId).populate(
      "following",
      "username avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("user.following",user.following);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting following:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
export const getMutualFollowedUsers = async (req, res) => {
  try {
    // console.log("req.user.id",req.user.id);
    // Find users that the current user follows and who follow the current user back
    const mutualFollowedUsers = await User.find({
      _id: { $in: req.user.following }, // Users that the current user follows
      followers: req.user.id, // Users who have the current user in their followers array
      _id: { $ne: req.user.id }, // Exclude the current user from the results
    }).select("username avatar");

    res.status(200).json(mutualFollowedUsers);
  } catch (error) {
    console.error("Error fetching mutual followed users:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
