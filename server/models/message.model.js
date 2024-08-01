import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String },
    fileUrl: {
      public_id: String,
      secure_url: String,
    },
    videofile: {
      public_id: String,
      secure_url: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
