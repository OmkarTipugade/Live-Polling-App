import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: "teacher" | "student";
  pollSessionId?: string; // only for students
  joinedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ["teacher", "student"], required: true },
  pollSessionId: { type: String }, // students belong to a session
  joinedAt: { type: Date, default: Date.now }
});

export const User = model<IUser>("User", UserSchema);
