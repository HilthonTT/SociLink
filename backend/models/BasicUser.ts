import mongoose, { Document, Model, Schema } from "mongoose";

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

export const BasicUserModel: Model<BasicUser & Document> = mongoose.model(
  "BasicUser",
  basicUserSchema
);
