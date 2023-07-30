import express, { Request, Response } from "express";
import { CommentModel } from "../models/Comment";
import { LRUCache } from "lru-cache";

const router = express.Router();

const cacheOptions = {
  max: 500,
  maxAge: 60 * 1000 * 60, // 1 hour
};

const commentsCache = new LRUCache(cacheOptions);
const cacheKey = "comments_";

router.get(
  "/comments/thread/:threadId",
  async (req: Request, res: Response) => {
    try {
      const { threadId } = req.params;

      const key = cacheKey + threadId;
      const cachedComments = commentsCache.get(key);
      if (cachedComments) {
        return res.json(cachedComments);
      }

      const comments = await CommentModel.find({
        "thread._id": threadId,
        archived: false,
      });

      commentsCache.set(cacheKey, comments);

      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments: ", error);
      res.status(500).json({ error: "Error fetching comments" });
    }
  }
);

router.post("/comments", async (req: Request, res: Response) => {
  try {
    const { comment, thread, author } = req.body;

    const newComment = new CommentModel({
      comment,
      thread,
      author,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment: ", error);
    res.status(500).json({ error: "Error creating comment" });
  }
});

router.put("/comments/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, archived } = req.body;

    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { comment, archived },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Error updating comment" });
  }
});

export default router;
