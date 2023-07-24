import { Comment } from "../models/comment";
import appsettings from "../appsettings_dev.json";
import axios from "axios";

export interface ICommentEndpoint {
  getThreadCommentsAsync: (threadId: string) => Promise<Comment[]>;
  updateCommentAsync: (comment: Comment) => Promise<void>;
  createCommentAsync: (comment: Comment) => Promise<void>;
}

export class CommentEndpoint implements ICommentEndpoint {
  private readonly CACHE_KEY_PREFIX = "cached_comments_thread_";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000;
  private readonly url = appsettings.api.url;

  private getCachedThreadComments = (threadId: string): Comment[] | null => {
    const cachedCommentsString = localStorage.getItem(
      this.CACHE_KEY_PREFIX + threadId
    );
    if (cachedCommentsString) {
      const cachedComments: Comment[] = JSON.parse(cachedCommentsString);
      return cachedComments;
    }
    return null;
  };

  private cacheThreadComments = (
    threadId: string,
    comments: Comment[]
  ): void => {
    localStorage.setItem(
      this.CACHE_KEY_PREFIX + threadId,
      JSON.stringify(comments)
    );
    const expirationTime = Date.now() + this.EXPIRATION_TIME;
    localStorage.setItem(
      this.CACHE_KEY_PREFIX + threadId + "_expiration",
      expirationTime.toString()
    );
  };

  private areCachedThreadCommentsExpired = (threadId: string): boolean => {
    const expirationTime = localStorage.getItem(
      this.CACHE_KEY_PREFIX + threadId + "_expiration"
    );
    if (expirationTime) {
      return Date.now() > parseInt(expirationTime);
    }
    return true;
  };

  public getThreadCommentsAsync = async (
    threadId: string
  ): Promise<Comment[]> => {
    try {
      if (!this.areCachedThreadCommentsExpired(threadId)) {
        const cachedComments = this.getCachedThreadComments(threadId);
        if (cachedComments) {
          return cachedComments;
        }
      }

      const response = await axios.get(`${this.url}/comment/${threadId}`);
      const comments: Comment[] = response.data;

      this.cacheThreadComments(threadId, comments);

      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  };

  public updateCommentAsync = async (comment: Comment): Promise<void> => {
    await axios.put(`${this.url}/comments/${comment._id}`, comment);
  };

  public createCommentAsync = async (comment: Comment): Promise<void> => {
    await axios.post(`${this.url}/comments`, comment);
  };
}
