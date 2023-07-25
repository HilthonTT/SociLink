import express, { Request, Response } from "express";
import { UserModel } from "../models/User";
import { LRUCache } from "lru-cache";

const router = express.Router();

const cacheOptions = {
  max: 500,
  maxAge: 60 * 1000 * 60, // 1 hour
};

const usersCache = new LRUCache(cacheOptions);
const cacheKey = "users";
const cacheKeyPrefix = "users_";

router.post("/users", async (req: Request, res: Response) => {
  try {
    const {
      objectIdentifier,
      firstName,
      lastName,
      email,
      displayName,
      downloadUrl,
    } = req.body;

    const newUser = new UserModel({
      objectIdentifier,
      firstName,
      lastName,
      email,
      displayName,
      downloadUrl,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const cachedUsers = usersCache.get(cacheKey);
    if (cachedUsers) {
      return res.json(cachedUsers);
    }

    const users = await UserModel.find();
    usersCache.set(cacheKey, users);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const key = cacheKeyPrefix + id;
    const cachedUser = usersCache.get(key);
    if (cachedUser) {
      return res.json(cachedUser);
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    usersCache.set(key, user);

    res.json(user);
  } catch (error) {
    console.error("Error fetching user: ", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

router.get("/users/auth/:objectId", async (req: Request, res: Response) => {
  try {
    const { objectId } = req.params;
    const user = await UserModel.findOne({ objectIdentifier: objectId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user: ", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { firstName, lastName, email, displayName, downloadUrl } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.displayName = displayName;
    user.downloadUrl = downloadUrl;

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

export default router;
