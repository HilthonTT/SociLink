import mongoose, { Document, Model, Schema } from "mongoose";

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export const categorySchema = new Schema<Category & Document>({
  name: { type: String, required: true },
  description: { type: String, require: true },
});

export const CategoryModel: Model<Category & Document> = mongoose.model(
  "Category",
  categorySchema
);
