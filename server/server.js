import express from "express";
import { config } from "dotenv";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import cors from "cors";
import fs from "fs";
import DBConnection from "./config/DBConnection.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import storyRoutes from "./routes/story.routes.js";
import {
  createMessage,
  getMessagesByRoomId,
} from "./controllers/message.controller.js";
import uploadImageToCloudinary from "./utils/uploadImageToCloudinary.js";
import uploadVideoToCloudinary from "./utils/uploadVideoToCloudinary.js";
import upload from "./utils/uploadByMulter.js";
import path from "path";

const __dirname = path.resolve();
config(); // Load environment variables from .env file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://my-social-media-v6xp.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, '/client/dist')));

// Database connection
DBConnection();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/story", storyRoutes);

app.post(
  "/api/v1/message",
  upload.fields([{ name: "fileUrl" }, { name: "videofile" }]),
  async (req, res) => {
    console.log("Message endpoint hit");
    console.log("req.body", req.body);
    console.log("req.files", req.files);

    const { senderId, receiverId, text, roomId } = req.body;

    try {
      let fileUrl = null;
      let videofile = null;

      if (req.files && req.files.fileUrl) {
        const result = await uploadImageToCloudinary(
          req.files.fileUrl[0].path,
          "imgs"
        );
        fileUrl = {
          secure_url: result.secure_url,
          public_id: result.public_id,
        };
        fs.unlink(req.files.fileUrl[0].path, (err) => {
          if (err) {
            console.error("Error removing file:", err);
          }
        });
      } else if (req.files && req.files.videofile) {
        const result = await uploadVideoToCloudinary(
          req.files.videofile[0].path,
          "vids"
        );
        videofile = {
          secure_url: result.secure_url,
          public_id: result.public_id,
        };
        fs.unlink(req.files.videofile[0].path, (err) => {
          if (err) {
            console.error("Error removing file:", err);
          }
        });
      }

      if (!fileUrl && !videofile) {
        savedMessage = await createMessage(senderId, receiverId, text, roomId);
      } else {
        savedMessage = await createMessage(
          senderId,
          receiverId,
          text || "",
          roomId,
          fileUrl,
          videofile
        );
      }

      io.to(users[senderId]).emit("newMessage", savedMessage);
      io.to(users[receiverId]).emit("newMessage", savedMessage);

      res.status(201).json(savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ error: "Failed to save message" });
    }
  }
);

app.get("/api/v1/message/messages", async (req, res) => {
  const { roomId, me, id } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  try {
    const messages = await getMessagesByRoomId(roomId, me, id);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Catch-all route for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Catch-all for 404 errors
app.all("*", (req, res) => {
  res.status(404).send("OOPS 404 Page not Found");
});

// Socket.io connection handling
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("Client disconnected", socket.id);
  });

  socket.on("sendMessage", async (data) => {
    console.log("Data received:", data);
    try {
      if (data) {
        io.to(users[data.senderId]).emit("newMessage", data);
        io.to(users[data.receiverId]).emit("newMessage", data);
        console.log("Message emitted to both sender and receiver");
      } else {
        console.error("No data received");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("connectUser", (userId) => {
    users[userId] = socket.id;
    console.log("User connected:", userId, socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socket.on("reconnect_attempt", () => {
    console.log("Attempting to reconnect");
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_failed", () => {
    console.error("Reconnection failed");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Database connected");
  console.log(`Server running on port ${PORT}`);
});
