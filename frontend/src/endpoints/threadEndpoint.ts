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

  public getThreadsAsync = async (): Promise<Thread[]> => {
    try {
      // const cachedData = localStorage.getItem(this.CACHE_KEY);
      // if (cachedData) {
      //   const { data, timestamp } = JSON.parse(cachedData);
      //   const currentTime = new Date().getTime();
      //   if (currentTime - timestamp < this.EXPIRATION_TIME) {
      //     return data;
      //   }
      // }

      const response = await axios.get(`${this.apiUrl}/threads`);
      const threads: Thread[] = response.data;

      const dataToCache = {
        data: threads,
        timestamp: new Date().getTime(),
      };
      //localStorage.setItem(this.CACHE_KEY, JSON.stringify(dataToCache));

      return threads;
    } catch (error) {
      console.error("Error fetching threads:", error);
      throw error;
    }
  };

  public getThreadAsync = async (id: string): Promise<Thread> => {
    try {
      // const cacheKey = `${this.CACHE_KEY_PREFIX}${id}`;

      // const cachedData = localStorage.getItem(cacheKey);
      // if (cachedData) {
      //   const { data, timestamp } = JSON.parse(cachedData);
      //   const currentTime = new Date().getTime();
      //   if (currentTime - timestamp < this.EXPIRATION_TIME) {
      //     return data;
      //   }
      // }

      const response = await axios.get(`${this.apiUrl}/threads/${id}`);
      const user: Thread = response.data;

      const dataToCache = {
        data: user,
        timestamp: new Date().getTime(),
      };
     // localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  };

  public getUserThreadAsync = async (userId: string): Promise<Thread[]> => {
    try {
      // const cachedData = localStorage.getItem(this.CACHE_KEY);
      // if (cachedData) {
      //   const { data, timestamp } = JSON.parse(cachedData);
      //   const currentTime = new Date().getTime();
      //   if (currentTime - timestamp < this.EXPIRATION_TIME) {
      //     return data;
      //   }
      // }

      const response = await axios.get(`${this.apiUrl}/threads/user/${userId}`);
      const threads: Thread[] = response.data;

      const dataToCache = {
        data: threads,
        timestamp: new Date().getTime(),
      };
      //localStorage.setItem(this.CACHE_KEY, JSON.stringify(dataToCache));

      return threads;
    } catch (error) {
      console.error("Error fetching threads:", error);
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
