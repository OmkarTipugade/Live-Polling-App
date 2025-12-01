import { Router } from "express";
import { submitAnswer } from "../controllers/Answer.controller.js";

const router = Router();

router.post("/:questionId", submitAnswer);

export default router;
