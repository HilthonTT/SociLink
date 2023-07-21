import mongoose, { Document, Model, Schema } from "mongoose";

export interface BasicComment {
  id: string;
  comment: string;
}

export const basicCommentSchema = new Schema<BasicComment & Document>({
  id: { type: String, required: true },
  comment: { type: String, required: true },
});

export const BasicCommentModel: Model<BasicComment & Document> = mongoose.model(
  "BasicComment",
  basicCommentSchema
);
