import { Router } from "express";
import { sendMessage, editMessage, deleteMessage, getMessages, deleteAllMessages } from "../controllers/Chat.controller.js";

const router = Router();

router.post("/send", sendMessage);

router.put("/:messageId", editMessage);

router.delete("/:messageId", deleteMessage);

router.get("/:pollSessionId", getMessages);

router.delete("/:pollSessionId", deleteAllMessages);

export default router;
