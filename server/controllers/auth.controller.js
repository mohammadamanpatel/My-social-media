import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import uploadImageWithCloudinary from "../utils/uploadImageToCloudinary.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle avatar upload
    let avatar = { public_id: "", secure_url: "" };
    // console.log("req.file", req.file);
    if (req.file) {
      const result = await uploadImageWithCloudinary(req.file.path, "avatars");
      avatar.public_id = result.public_id;
      avatar.secure_url = result.secure_url;

      // Remove the file from the uploads folder
      fs.unlink(req.file.path, (err) => {
        console.log("file removed");
        if (err) {
          console.error(err);
        }
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });
    await user.save();

    // Generate token
    const payload = {
      id: user._id,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.jwtToken = jwtToken;
    user.password = null;

    // Set token in cookie and return complete user object
    return res
      .cookie("jwtToken", jwtToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const payload = {
      id: user._id,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in cookie and return complete user object
    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    });

    user.jwtToken = jwtToken;
    user.password = null;

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const google = async (req, res, next) => {
  try {
    // console.log("req.body in google auth", req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.jwtToken = jwtToken;
      user.password = null;
      // console.log("user in google auth", user);
      res
        .cookie("jwtToken", jwtToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          user,
        });
      // console.log("user", user);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      user = await new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: {
          secure_url: req.body.photo,
          public_id: "public_id",
        },
      });
      await user.save();
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.jwtToken = jwtToken;
      user.password = null;
      // console.log("user in google auth", user);
      res
        .cookie("jwtToken", jwtToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "user signed in",
          success: true,
          jwtToken,
          user,
        });
      // console.log("newUser", user);
    }
  } catch (error) {
    console.log("error in google firebase auth", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("jwtToken").status(200).json("User has been signed out");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messsage: "user cant logout",
      error: error,
    });
  }
};
