import mongoose, { Document, Model, Schema } from "mongoose";

export interface BasicThread {
  id: string;
  thread: string;
}

export const basicThreadSchema = new Schema<BasicThread & Document>({
  id: { type: String, required: true },
  thread: { type: String, required: true },
});

export const BasicThreadModel: Model<BasicThread & Document> = mongoose.model(
  "BasicThread",
  basicThreadSchema
);
