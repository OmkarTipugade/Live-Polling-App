import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  pollSessionId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "teacher" | "student";
  message: string;
  createdAt: Date;
  updatedAt: Date;
  edited: boolean; // to show "edited" on UI
}

const MessageSchema = new Schema<IMessage>(
  {
    pollSessionId: {
      type: Schema.Types.ObjectId,
      ref: "PollSession",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);


export const Message = model<IMessage>("Message", MessageSchema);
