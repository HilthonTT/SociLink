import mongoose, { Document, Model, Schema } from "mongoose";
import { BasicUser, basicUserSchema } from "./BasicUser";
import { Category, categorySchema } from "./Category";

export interface Thread {
  _id: string;
  thread: string;
  description: string;
  category: Category;
  dateCreated: Date;
  author: BasicUser;
  downloadUrl: string;
  userVotes: string[];
  archived: boolean;
}

export const threadSchema = new Schema<Thread & Document>(
  {
    thread: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: categorySchema },
    author: { type: basicUserSchema },
    dateCreated: {
      type: Date,
      default: Date.now,
      required: true,
    },
    downloadUrl: { type: String, default: "", required: false },
    userVotes: { type: [{ type: String }], default: [] },
    archived: { type: Boolean, default: false },
  },
  { versionKey: false }
);

export const ThreadModel: Model<Thread & Document> = mongoose.model(
  "Thread",
  threadSchema
);
