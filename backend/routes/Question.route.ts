import { Router } from "express";
import { createQuestion, getCurrentQuestion, getQuestionResults, getSessionHistory } from "../controllers/Question.controller.js";

const router = Router();

router.post("/:sessionId", createQuestion);
router.get("/:sessionId/current", getCurrentQuestion);
router.get("/:questionId/results", getQuestionResults);
router.get("/session/:sessionId/history", getSessionHistory);

export default router;
