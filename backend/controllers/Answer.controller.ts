import type { Request, Response, NextFunction } from "express";
import { Answer } from "../models/Answer.model.js";
import { Question } from "../models/Question.model.js";
import { PollSession } from "../models/PollSession.model.js";

export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId } = req.params;
    const { studentId, selectedOption } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // Time limit check (60s by default or configurable)
    if (question.startTime && question.timeLimit) {
      const diffSec = (Date.now() - question.startTime.getTime()) / 1000;
      if (diffSec > question.timeLimit) {
        return res.status(400).json({ message: "Time limit exceeded" });
      }
    }

    if (!question.options.includes(selectedOption)) {
      return res.status(400).json({ message: "Invalid option" });
    }

    const answer = await Answer.create({
      questionId: question._id,
      studentId,
      selectedOption,
    });

    //check if all students answered → deactivate question
    const session = await PollSession.findOne({ currentQuestionId: question._id }).populate("students");
    if (session) {
      const answersCount = await Answer.countDocuments({ questionId: question._id });
      if (answersCount >= session.students.length) {
        question.isActive = false;
        await question.save();
        session.currentQuestionId = null;
        await session.save();
      }
    }

    res.status(201).json({ answer });
  } catch (err: any) {
    // Handle "already answered" due to unique index
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already answered this question" });
    }
    next(err);
  }
};
