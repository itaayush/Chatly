import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in delete message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, images, videos } = req.body; 
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrls = [];
    let videoUrls = [];

    if (images && Array.isArray(images) && images.length > 0) {
      for (const image of images) {
        const imageResult = await cloudinary.uploader.upload(image, {
          folder: "chat-images",
        });
        imageUrls.push(imageResult.secure_url);
      }
    }

    if (videos && Array.isArray(videos) && videos.length > 0) {
      for (const video of videos) {
        const videoResult = await cloudinary.uploader.upload(video, {
          resource_type: "video",
          folder: "chat-videos",
          chunk_size: 6000000,
          timeout: 120000,
        });
        videoUrls.push(videoResult.secure_url);
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      images: imageUrls, 
      videos: videoUrls, 
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    console.log("Full error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};