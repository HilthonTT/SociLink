import express, { Request, Response, Router } from "express";
import { CommentModel } from "../models/Comment";

const router = express.Router();

router.get("/comments/:threadId", async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params;
    const comments = CommentModel.find(
      (c: { thread: { id: string } }) => c.thread.id == threadId
    );

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments: ", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

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

export default router;
