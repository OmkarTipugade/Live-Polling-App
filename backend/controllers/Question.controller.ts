import type { Request, Response, NextFunction } from "express";
import { PollSession } from "../models/PollSession.model.js";
import { Question } from "../models/Question.model.js";
import { Answer } from "../models/Answer.model.js";

const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const { text, options, timeLimit } = req.body;

    const session = await PollSession.findById(sessionId).populate("students");
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Auto-inactivate previous question if it exists and is still active
    if (session.currentQuestionId) {
      const currentQuestion = await Question.findById(session.currentQuestionId);
      if (currentQuestion && currentQuestion.isActive) {
        // Mark previous question as inactive
        currentQuestion.isActive = false;
        await currentQuestion.save();
        // Students who haven't answered miss their chance
      }
    }

    const question = await Question.create({
      pollSessionId: session._id,
      text,
      options,
      timeLimit: timeLimit || 60,
      startTime: new Date(),
      isActive: true,
    });

    session.questions.push(question._id);
    session.currentQuestionId = question._id;
    await session.save();

    res.status(201).json({ question });
  } catch (err) {
    next(err);
  }
};

const getCurrentQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const session = await PollSession.findById(sessionId);

    if (!session || !session.currentQuestionId) {
      return res.json({ question: null });
    }

    const question = await Question.findById(session.currentQuestionId);
    
    if (!question) {
      return res.json({ question: null });
    }
    
    // Calculate question number (position in questions array)
    const questionIndex = session.questions.findIndex(
      (qId) => qId.toString() === session.currentQuestionId!.toString()
    );
    const questionNumber = questionIndex >= 0 ? questionIndex + 1 : undefined;
    
    res.json({ 
      question: {
        ...question.toObject(),
        questionNumber
      }
    });
  } catch (err) {
    next(err);
  }
};

const getQuestionResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answers = await Answer.find({ questionId: question._id});

    const counts: Record<string, number> = {};
    question.options.forEach((opt) => (counts[opt] = 0));
    answers.forEach((a) => {
      counts[a.selectedOption] = (counts[a.selectedOption] || 0) + 1;
    });

    res.json({ question, counts, totalAnswers: answers.length });
  } catch (err) {
    next(err);
  }
};

export {
    createQuestion,
    getCurrentQuestion,
    getQuestionResults
}
