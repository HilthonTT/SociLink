import { Thread } from "../models/thread";
import appsettings from "../appsettings_dev.json";
import axios from "axios";

export interface IThreadEndpoint {
  getThreadsAsync: () => Promise<Thread[]>;
  getThreadAsync: (id: string) => Promise<Thread>;
  getUserThreadAsync: (userId: string) => Promise<Thread[]>;
  updateThreadAsync: (thread: Thread) => Promise<void>;
  createThreadAsync: (thread: Thread) => Promise<void>;
  updateVoteThreadAsync: (threadId: string, userId: string) => Promise<void>;
}

export class ThreadEndpoint implements IThreadEndpoint {
  private readonly CACHE_KEY_PREFIX = "cached_thread_";
  private readonly CACHE_KEY = "cached_threads";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milleseconds
  private readonly apiUrl = appsettings.api.url;

  private getCachedThreads = (): Thread[] | null => {
    const cachedThreadsString = localStorage.getItem(this.CACHE_KEY_PREFIX);
    if (cachedThreadsString) {
      const cachedThreads: Thread[] = JSON.parse(cachedThreadsString);
      return cachedThreads;
    }
    return null;
  };

  private cacheThreads = (threads: Thread[]): void => {
    localStorage.setItem(this.CACHE_KEY_PREFIX, JSON.stringify(threads));
    const expirationTime = Date.now() + this.EXPIRATION_TIME;
    localStorage.setItem(
      this.CACHE_KEY_PREFIX + this.CACHE_KEY,
      expirationTime.toString()
    );
  };

  private areCachedThreadsExpired = (): boolean => {
    const expirationTime = localStorage.getItem(
      this.CACHE_KEY_PREFIX + this.CACHE_KEY
    );
    if (expirationTime) {
      return Date.now() > parseInt(expirationTime);
    }
    return true;
  };

  private getCachedUserThreads = (userId: string): Thread[] | null => {
    const cachedThreadsString = localStorage.getItem(
      this.CACHE_KEY_PREFIX + userId
    );
    if (cachedThreadsString) {
      const cachedThreads: Thread[] = JSON.parse(cachedThreadsString);
      return cachedThreads;
    }
    return null;
  };

  private cacheUserThreads = (userId: string, threads: Thread[]): void => {
    localStorage.setItem(
      this.CACHE_KEY_PREFIX + userId,
      JSON.stringify(threads)
    );
    const expirationTime = Date.now() + this.EXPIRATION_TIME;
    localStorage.setItem(
      this.CACHE_KEY_PREFIX + userId + this.CACHE_KEY,
      expirationTime.toString()
    );
  };

  private areCachedUserThreadsExpired = (userId: string): boolean => {
    const expirationTime = localStorage.getItem(
      this.CACHE_KEY_PREFIX + userId + this.CACHE_KEY
    );
    if (expirationTime) {
      return Date.now() > parseInt(expirationTime);
    }
    return true;
  };

  public getThreadsAsync = async (): Promise<Thread[]> => {
    try {
      if (!this.areCachedThreadsExpired()) {
        const cachedThreads = this.getCachedThreads();
        if (cachedThreads) {
          return cachedThreads;
        }
      }

      const response = await axios.get(`${this.apiUrl}/threads`);
      const threads: Thread[] = response.data;

      this.cacheThreads(threads);

      return threads;
    } catch (error) {
      console.error("Error fetching threads:", error);
      throw error;
    }
  };

  public getThreadAsync = async (id: string): Promise<Thread> => {
    try {
      const response = await axios.get(`${this.apiUrl}/threads/${id}`);
      const user: Thread = response.data;

      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  };

  public getUserThreadAsync = async (userId: string): Promise<Thread[]> => {
    try {
      if (!this.areCachedUserThreadsExpired(userId)) {
        const cachedUserThreads = this.getCachedUserThreads(userId);
        if (cachedUserThreads) {
          return cachedUserThreads;
        }
      }

      const response = await axios.get(`${this.apiUrl}/threads/user/${userId}`);
      const userThreads: Thread[] = response.data;

      this.cacheUserThreads(userId, userThreads);

      return userThreads;
    } catch (error) {
      console.error(
        `Error fetching threads for user with ID ${userId}:`,
        error
      );
      throw error;
    }
  };

  public updateThreadAsync = async (thread: Thread): Promise<void> => {
    await axios.put(`${this.apiUrl}/threads/${thread.id}`, thread);
  };

  public createThreadAsync = async (thread: Thread): Promise<void> => {
    await axios.post(`${this.apiUrl}/threads`, thread);
  };

  public updateVoteThreadAsync = async (
    threadId: string,
    userId: string
  ): Promise<void> => {
    await axios.put(`${this.apiUrl}/threads/${threadId}`, userId);
  };
}
