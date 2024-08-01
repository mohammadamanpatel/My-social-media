// Controller to create a new message
import Message from "../models/message.model.js";

export const createMessage = async (
  senderId,
  receiverId,
  text,
  roomId,
  fileUrl = null,
  videofile = null
) => {
  if (!senderId || !receiverId || !roomId) {
    console.error("Missing senderId, receiverId or roomId");
    return null; // Return null or handle the error in another way
  }

  try {
    const newMessage = {
      senderId,
      receiverId,
      text,
      roomId,
      fileUrl,
      videofile,
    };
    console.log("Creating message:", newMessage);

    // Save the message to your database here (e.g., MongoDB)
    const savedMessage = await Message.create(newMessage);
    console.log("Message saved:", savedMessage);

    return savedMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    return null; // Return null or handle the error in another way
  }
};

// Controller to get messages by roomId
export const getMessagesByRoomId = async (roomId, me, id) => {
  // console.log("roomId,me,id", roomId, me, id);
  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  try {
    // Split roomId to extract user IDs
    const [userId1, userId2] = roomId.split("-");
    // console.log("userId1, userId2", userId1, userId2);
    // Check if the current user is part of the room

    // Fetch messages for the valid room
    if (
      (me === userId1 && id === userId2) ||
      (me === userId2 && id === userId1)
    ) {
      // Fetch messages for the valid room
      const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
      // console.log("messages",messages);
      return messages;
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};
export const getAllMessages = async (req, res) => {
  // console.log("roomId,me,id", roomId, me, id);

  try {
    // Fetch messages for the valid room
    const messages = await Message.find().sort({ createdAt: 1 });
    // console.log("messages",messages);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};
