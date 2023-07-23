import { User } from "../models/user";
import axios from "axios";
import appsettings from "../appsettings_dev.json";

export interface IUserEndpoint {
  getUsersAsync: () => Promise<User[]>;
  getUserAsync: (id: string) => Promise<User>;
  getUserFromAuth: (objectId: string) => Promise<User>;
  createUserAsync: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export class UserEndpoint implements IUserEndpoint {
  private readonly CACHE_KEY_PREFIX = "cached_user_";
  private readonly CACHE_KEY = "cached_users";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in millisecond
  private readonly url = appsettings.api.url;

  public getUsersAsync = async (): Promise<User[]> => {
    try {
      // const cachedData = localStorage.getItem(this.CACHE_KEY);
      // if (cachedData) {
      //   const { data, timestamp } = JSON.parse(cachedData);
      //   const currentTime = new Date().getTime();
      //   if (currentTime - timestamp < this.EXPIRATION_TIME) {
      //     return data;
      //   }
      // }

      const response = await axios.get(`${this.url}/users`);
      const users: User[] = response.data;

      // const dataToCache = {
      //   data: users,
      //   timestamp: new Date().getTime(),
      // };
      // localStorage.setItem(this.CACHE_KEY, JSON.stringify(dataToCache));

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  public getUserAsync = async (id: string): Promise<User> => {
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

      const response = await axios.get(`${this.url}/users/${id}`);
      const user: User = response.data;

      // const dataToCache = {
      //   data: user,
      //   timestamp: new Date().getTime(),
      // };
      // localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  };

  getUserFromAuth = async (objectId: string): Promise<User> => {
    try {
      // const cacheKey = `${this.CACHE_KEY_PREFIX}${objectId}`;

      // const cachedData = localStorage.getItem(cacheKey);
      // if (cachedData) {
      //   const { data, timestamp } = JSON.parse(cachedData);
      //   const currentTime = new Date().getTime();
      //   if (currentTime - timestamp < this.EXPIRATION_TIME) {
      //     return data;
      //   }
      // }

      const response = await axios.get(`${this.url}/users/auth/${objectId}`);
      const user: User = response.data;

      const dataToCache = {
        data: user,
        timestamp: new Date().getTime(),
      };
      //localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

      return user;
    } catch (error) {
      console.error(`Error fetching user with ObjectID ${objectId}:`, error);
      throw error;
    }
  };

  public createUserAsync = async (user: User): Promise<void> => {
    await axios.post(`${this.url}/users`, user);
  };

  public updateUser = async (user: User): Promise<void> => {
    await axios.put(`${this.url}/users/${user.id}`, user);
  };
}
