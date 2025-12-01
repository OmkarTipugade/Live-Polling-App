import { Schema, model, Document, Types } from "mongoose";

export interface IAnswer extends Document {
  questionId: Types.ObjectId;
  studentId: Types.ObjectId;
  selectedOption: string;
  answeredAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  selectedOption: { type: String, required: true },
  answeredAt: { type: Date, default: Date.now }
});

// Ensure each student answers a question only once
AnswerSchema.index({ questionId: 1, studentId: 1 }, { unique: true });

export const Answer = model<IAnswer>("Answer", AnswerSchema);
