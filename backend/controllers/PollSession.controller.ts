import type { Request, Response, NextFunction } from "express";
import { PollSession } from "../models/PollSession.model.js";
import { User } from "../models/User.model.js";

const createPollSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacherName } = req.body;

    const teacher = await User.create({
      name: teacherName,
      role: "teacher",
    });

    const session = await PollSession.create({
      teacherId: teacher._id,
      students: [],
      questions: [],
      currentQuestionId: null,
    });

    res.status(201).json({ session, teacher });
  } catch (err) {
    next(err);
  }
};

const joinSessionAsStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const { name } = req.body;

    const session = await PollSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Name must be unique within session
    const existing = await User.findOne({ pollSessionId: sessionId!, name, role: "student" });
    if (existing) {
      return res.status(400).json({ message: "Name already taken in this poll" });
    }

    const student = await User.create({
      name,
      role: "student",
      pollSessionId: sessionId!,
    });

    session.students.push(student._id);
    await session.save();

    res.status(201).json({ student, session });
  } catch (err) {
    next(err);
  }
};

const KickOutStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, studentId } = req.params;

    const session = await PollSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.students = session.students.filter((id) => id.toString() !== studentId);
    await session.save();

    await User.findByIdAndDelete(studentId);

    res.json({ message: "Student removed" });
  } catch (err) {
    next(err);
  }
};

export {
    createPollSession,
    joinSessionAsStudent,
    KickOutStudent
}