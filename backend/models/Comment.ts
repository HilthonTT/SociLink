import mongoose, { Model, Schema } from "mongoose";
import { BasicThread, basicThreadSchema } from "./BasicThread";
import { BasicUser, basicUserSchema } from "./BasicUser";

export interface Comment {
  _id: string;
  comment: string;
  thread: BasicThread;
  author: BasicUser;
  dateCreated: Date;
  archived: boolean;
}

export const commentSchema = new Schema<Comment>(
  {
    comment: { type: String, required: true },
    thread: { type: basicThreadSchema, required: true },
    author: { type: basicUserSchema, required: true },
    dateCreated: {
      type: Date,
      required: true,
      default: new Date().getUTCDate(),
    },
    archived: { type: Boolean, required: true, default: false },
  },
  { versionKey: false }
);

export const CommentModel: Model<Comment> = mongoose.model<Comment>(
  "Comment",
  commentSchema
);
