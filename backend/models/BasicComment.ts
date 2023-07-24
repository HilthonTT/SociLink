import mongoose, { Document, Model, Schema } from "mongoose";

export interface BasicComment {
  _id: string;
  comment: string;
}

export const basicCommentSchema = new Schema<BasicComment & Document>(
  {
    _id: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { versionKey: false }
);

export const BasicCommentModel: Model<BasicComment & Document> = mongoose.model(
  "BasicComment",
  basicCommentSchema
);
