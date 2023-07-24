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

  private getCachedUsers = (): User[] | null => {
    const cachedUsersString = localStorage.getItem(this.CACHE_KEY);
    if (cachedUsersString) {
      const cachedUsers: User[] = JSON.parse(cachedUsersString);
      return cachedUsers;
    }
    return null;
  };

  private cacheUsers = (users: User[]): void => {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(users));
    const expirationTime = Date.now() + this.EXPIRATION_TIME;
    localStorage.setItem(
      this.CACHE_KEY_PREFIX + this.CACHE_KEY,
      expirationTime.toString()
    );
  };

  private areCachedUsersExpired = (): boolean => {
    const expirationTime = localStorage.getItem(
      this.CACHE_KEY_PREFIX + this.CACHE_KEY
    );
    if (expirationTime) {
      return Date.now() > parseInt(expirationTime);
    }
    return true;
  };

  public getUsersAsync = async (): Promise<User[]> => {
    try {
      if (!this.areCachedUsersExpired()) {
        const cachedUsers = this.getCachedUsers();
        if (cachedUsers) {
          return cachedUsers;
        }
      }

      const response = await axios.get(`${this.url}/users`);
      const users: User[] = response.data;

      this.cacheUsers(users);

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  public getUserAsync = async (id: string): Promise<User> => {
    try {
      const response = await axios.get(`${this.url}/users/${id}`);
      const user: User = response.data;

      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  };

  getUserFromAuth = async (objectId: string): Promise<User> => {
    try {
      const response = await axios.get(`${this.url}/users/auth/${objectId}`);
      const user: User = response.data;

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
    await axios.put(`${this.url}/users/${user._id}`, user);
  };
}
