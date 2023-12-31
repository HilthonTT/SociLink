import express, { Request, Response } from "express";
import { ThreadModel } from "../models/Thread";
import { UserModel } from "../models/User";
import { BasicThread } from "../models/BasicThread";
import { LRUCache } from "lru-cache";
import mongoose from "mongoose";

const router = express.Router();

const cacheOptions = {
  max: 500,
  maxAge: 60 * 1000 * 60, // 1 hour
};

const threadCache = new LRUCache(cacheOptions);
const cacheKey = "threads";
const cacheKeyPrefix = "thread_";

router.post("/threads", async (req: Request, res: Response) => {
  try {
    const { thread, description, category, author, downloadUrl } = req.body;

    const newThread = new ThreadModel({
      thread,
      description,
      category,
      author,
      downloadUrl,
    });

    await newThread.save();
    res.status(201).json(newThread);
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: "Error creating thread" });
  }
});

router.get("/threads", async (req: Request, res: Response) => {
  try {
    const cachedThreads = threadCache.get(cacheKey);
    if (cachedThreads) {
      return res.json(cachedThreads);
    }

    const threads = await ThreadModel.find({ archived: false });
    threadCache.set(cacheKey, threads);

    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads", error);
    res.status(500).json({ error: "Error fetching threads" });
  }
});

router.get("/threads/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const key = cacheKeyPrefix + id;
    const cachedThreads = threadCache.get(key);
    if (cachedThreads) {
      return res.json(cachedThreads);
    }

    const thread = await ThreadModel.findById(id);
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    threadCache.set(key, thread);

    res.json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ error: "Error fetching thread" });
  }
});

router.get("/threads/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const threads = await ThreadModel.find({
      "author._id": userId,
    });

    const key = cacheKeyPrefix + userId;
    const cachedThreads = threadCache.get(key);
    if (cachedThreads) {
      return res.json(cachedThreads);
    }

    if (!threads || threads.length === 0) {
      return res.status(404).json({ error: "Threads not found" });
    }

    threadCache.set(key, threads);

    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ error: "Error fetching threads" });
  }
});

router.put("/threads/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { thread, description, downloadUrl } = req.body;
    const key = cacheKeyPrefix + id;

    const updatedThread = await ThreadModel.findByIdAndUpdate(
      id,
      { thread, description, downloadUrl },
      { new: true }
    );

    if (!updatedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    threadCache.delete(key);
    res.json(updatedThread);
  } catch (error) {
    console.error("Error updating thread:", error);
    res.status(500).json({ error: "Error updating thread" });
  }
});

router.put(
  "/threads/updateVote/:id/:userId",
  async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const key = cacheKeyPrefix + id;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const thread = await ThreadModel.findById(id).session(session);

      if (!thread) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Thread not found" });
      }

      const isUpVote = thread.userVotes.includes(userId);

      if (isUpVote) {
        thread.userVotes = thread.userVotes.filter((id) => id !== userId);
      } else {
        thread.userVotes.push(userId);
      }

      await thread.save();

      const user = await UserModel.findById(userId).session(session);

      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ error: "User not found" });
      }

      if (isUpVote) {
        user.votedOnThreads = user.votedOnThreads.filter((t) => t._id !== id);
      } else {
        const newThread: BasicThread = {
          _id: thread.id,
          thread: thread.thread,
        };
        user.votedOnThreads.push(newThread);
      }

      await user.save();

      await session.commitTransaction();
      session.endSession();

      threadCache.delete(key);
      res.json({ message: "Vote updated successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error updating vote:", error);
      res.status(500).json({ error: "Error updating vote" });
    }
  }
);

export default router;
