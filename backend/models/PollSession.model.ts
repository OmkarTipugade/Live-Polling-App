import { Schema, model, Document, Types } from "mongoose";

export interface IPollSession extends Document {
  teacherId: Types.ObjectId;
  students: Types.ObjectId[];
  questions: Types.ObjectId[];
  currentQuestionId?: Types.ObjectId | null;
  createdAt: Date;
}

const PollSessionSchema = new Schema<IPollSession>({
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  currentQuestionId: { type: Schema.Types.ObjectId, ref: "Question", default: null },
  createdAt: { type: Date, default: Date.now }
});

export const PollSession = model<IPollSession>("PollSession", PollSessionSchema);
