import type { Request, Response, NextFunction } from "express";
import { Message } from "../models/Message.model.js";

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollSessionId, senderId, senderRole, message } = req.body;

    if (!pollSessionId || !senderId || !message) {
      return res.fail("Missing required fields", 400);
    }

    const newMessage = await Message.create({
      pollSessionId,
      senderId,
      senderRole,
      message,
    });

    return res.success(newMessage, "Message sent");
  } catch (err) {
    next(err);
  }
};

const editMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const { senderId, updatedText } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) return res.fail("Message not found", 404);

    if (msg.senderId.toString() !== senderId) {
      return res.fail("You can only edit your own messages", 403);
    }

    // Check time limit: 5 minutes = 300 seconds
    const createdAt = msg.createdAt.getTime();
    const now = Date.now();
    const diffSeconds = (now - createdAt) / 1000;

    if (diffSeconds > 300) {
      return res.fail("Messages can only be edited within 5 minutes", 400);
    }

    msg.message = updatedText || msg.message;
    await msg.save();

    return res.success(msg, "Message edited");
  } catch (err) {
    next(err);
  }
};


const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const { senderId, role } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) return res.fail("Message not found", 404);

    if (role === "student" && msg.senderId.toString() !== senderId) {
      return res.fail("Students can only delete their own messages", 403);
    }

    await Message.findByIdAndDelete(messageId);

    return res.success(null, "Message deleted");
  } catch (err) {
    next(err);
  }
};


const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollSessionId } = req.params;

    const messages = await Message.find({ pollSessionId: pollSessionId! })

    return res.success(messages, "Messages retrieved");
  } catch (err) {
    next(err);
  }
};

const deleteAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollSessionId } = req.params;

    await Message.deleteMany({ pollSessionId: pollSessionId! });

    return res.success(null, "All messages deleted");
  } catch (err) {
    next(err);
  }
};

export {
    sendMessage,
    editMessage,
    deleteMessage,
    getMessages,
    deleteAllMessages
}