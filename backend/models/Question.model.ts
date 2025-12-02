import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  pollSessionId: Types.ObjectId;
  text: string;
  options: string[];
  correctAnswer?: string; // The correct answer option
  startTime?: Date;
  timeLimit: number;
  isActive: boolean;
  answers: Types.ObjectId[];
}

const QuestionSchema = new Schema<IQuestion>({
  pollSessionId: { type: Schema.Types.ObjectId, ref: "PollSession", required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String }, // Optional correct answer
  startTime: { type: Date },
  timeLimit: { type: Number, default: 60 }, // seconds
  isActive: { type: Boolean, default: true },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }]
});

export const Question = model<IQuestion>("Question", QuestionSchema);
