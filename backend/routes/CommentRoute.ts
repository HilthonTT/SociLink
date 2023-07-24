import express, { Request, Response, Router } from "express";
import { CommentModel } from "../models/Comment";

const router = express.Router();

router.get("/comments/thread/:threadId", async (req: Request, res: Response) => {
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

router.put("/comments/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { comment },
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
