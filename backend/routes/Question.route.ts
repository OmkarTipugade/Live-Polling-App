import { Router } from "express";
import { createQuestion, getCurrentQuestion, getQuestionResults } from "../controllers/Question.controller.js";

const router = Router();

router.post("/:sessionId", createQuestion);
router.get("/:sessionId/current", getCurrentQuestion);
router.get("/:questionId/results", getQuestionResults);

export default router;
