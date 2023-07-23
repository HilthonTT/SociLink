import mongoose, { Document, Model, Schema } from "mongoose";
import { BasicThread, basicThreadSchema } from "./BasicThread";
import { BasicComment, basicCommentSchema } from "./BasicComment";

export interface User {
  _id: string;
  objectIdentifier: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  dateCreated: Date;
  downloadUrl: string;
  authoredThreads: BasicThread[];
  votedOnThreads: BasicThread[];
  authoredComments: BasicComment[];
}

export const userSchema = new Schema<User & Document>({
  objectIdentifier: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  downloadUrl: { type: String, default: "" },
  authoredThreads: { type: [{ type: basicThreadSchema }], default: [] },
  votedOnThreads: { type: [{ type: basicThreadSchema }], default: [] },
  authoredComments: { type: [{ type: basicCommentSchema }], default: [] },
});

export const UserModel: Model<User & Document> = mongoose.model(
  "User",
  userSchema
);
