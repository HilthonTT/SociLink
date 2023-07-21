import express, { Request, Response } from "express";
import { CategoryModel } from "../models/Category";

const router = express.Router();

router.post("/categories", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const newCategory = new CategoryModel({
      name,
      description,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category: ", error);
    res.status(500).json({ error: "Error creating category" });
  }
});

router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories: ", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

export default router;
