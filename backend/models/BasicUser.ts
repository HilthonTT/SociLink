import mongoose, { Document, Model, Schema } from "mongoose";

export interface BasicUser {
  id: string;
  displayName: string;
}

export const basicUserSchema = new Schema<BasicUser & Document>({
  id: { type: String, required: true },
  displayName: { type: String, required: true },
});

export const BasicUserModel: Model<BasicUser & Document> = mongoose.model(
  "BasicUser",
  basicUserSchema
);
