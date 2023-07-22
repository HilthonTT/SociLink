import { Category } from "../models/category";
import appsettings from "../appsettings.json";
import axios from "axios";

export interface ICategoryData {
  getCategoriesAsync: () => Promise<Category[]>;
  createCategoryAsync: (category: Category) => Promise<void>;
}

export class CategoryData implements ICategoryData {
  private readonly CACHE_KEY = "cached_categories";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000;
  private readonly url = appsettings.api.url;

  public getCategoriesAsync = async (): Promise<Category[]> => {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const currentTime = new Date().getTime();
        if (currentTime - timestamp < this.EXPIRATION_TIME) {
          return data;
        }
      }

      const response = await axios.get(`${this.url}/users`);
      const categories: Category[] = response.data;

      const dataToCache = {
        data: categories,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(dataToCache));

      return categories;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  public createCategoryAsync = async (category: Category): Promise<void> => {
    await axios.post(`${this.url}/comments`, category);
  };
}
