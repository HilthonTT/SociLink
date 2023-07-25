import express, { Request, Response } from "express";
import { CategoryModel } from "../models/Category";
import { LRUCache } from "lru-cache";

const router = express.Router();

const cacheOptions = {
  max: 500,
  maxAge: 60 * 1000 * 60, // 1 hour
};

const categoriesCache = new LRUCache(cacheOptions);
const cacheKey = "categories";

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
    const cachedCategories = categoriesCache.get(cacheKey);
    if (cachedCategories) {
      console.log("Using cached categories");
      return res.json(cachedCategories);
    }

    const categories = await CategoryModel.find();

    categoriesCache.set(cacheKey, categories);

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories: ", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

export default router;
