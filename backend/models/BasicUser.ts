import { Document, Schema } from "mongoose";

export interface BasicUser {
  _id: string;
  displayName: string;
}

export const basicUserSchema = new Schema<BasicUser & Document>(
  {
    _id: { type: String, required: true },
    displayName: { type: String, required: true },
  },
  { versionKey: false }
);
