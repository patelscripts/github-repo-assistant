import { Schema, model, models, Document, Types } from "mongoose";

interface IMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  messages: IMessage[];
  repoContext?: { owner: string; repo: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    messages: { type: [MessageSchema], default: [] },
    repoContext: {
      type: { owner: String, repo: String },
      default: null,
    },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model<IChat>("Chat", ChatSchema);