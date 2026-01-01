import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    images: {
      type: [String], 
      default: [],
    },
    videos: {
      type: [String], 
      default: [],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;