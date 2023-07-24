import { Document, Schema } from "mongoose";

export interface BasicThread {
  _id: string;
  thread: string;
}

export const basicThreadSchema = new Schema<BasicThread & Document>(
  {
    _id: { type: String, required: true },
    thread: { type: String, required: true },
  },
  { versionKey: false }
);
