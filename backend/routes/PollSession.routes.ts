import { Router } from "express";
import { createPollSession, joinSessionAsStudent, KickOutStudent } from "../controllers/PollSession.controller.js";

const router = Router();

router.post("/", createPollSession);

router.post("/:sessionId/join", joinSessionAsStudent);

router.delete("/:sessionId/students/:studentId", KickOutStudent);

export default router;
