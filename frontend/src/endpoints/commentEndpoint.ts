import { Comment } from "../models/comment";
import appsettings from "../appsettings.json";
import axios from "axios";

export interface ICommentEndpoint {
  getThreadCommentsAsync: (threadId: string) => Promise<Comment[]>;
  updateCommentAsync: (comment: Comment) => Promise<void>;
  createCommentAsync: (comment: Comment) => Promise<void>;
}

export class CommentEndpoint implements ICommentEndpoint {
  private readonly CACHE_KEY_PREFIX = "cached_comment_";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000;
  private readonly url = appsettings.api.url;

  public getThreadCommentsAsync = async (
    threadId: string
  ): Promise<Comment[]> => {
    try {
      // const cacheKey = `${this.CACHE_KEY_PREFIX}${threadId}`;
      // const cachedData = localStorage.getItem(cacheKey);
      // if (cachedData) {
      //   const { data, timestamp } = JSON.parse(cachedData);
      //   const currentTime = new Date().getTime();
      //   if (currentTime - timestamp < this.EXPIRATION_TIME) {
      //     return data;
      //   }
      // }

      const response = await axios.get(`${this.url}/users`);
      const comments: Comment[] = response.data;

      const dataToCache = {
        data: comments,
        timestamp: new Date().getTime(),
      };
      //localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  };

  public updateCommentAsync = async (comment: Comment): Promise<void> => {
    await axios.put(`${this.url}/comments/${comment.id}`, comment);
  };

  public createCommentAsync = async (comment: Comment): Promise<void> => {
    await axios.post(`${this.url}/comments`, comment);
  };
}