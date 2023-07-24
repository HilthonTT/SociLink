import { Category } from "../models/category";
import appsettings from "../appsettings_dev.json";
import axios from "axios";

export interface ICategoryEndpoint {
  getCategoriesAsync: () => Promise<Category[]>;
  createCategoryAsync: (category: Category) => Promise<void>;
}

export class CategoryEndpoint implements ICategoryEndpoint {
  private readonly CACHE_KEY = "cached_categories";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000;
  private readonly url = appsettings.api.url;

  private getCachedCategories = (): Category[] | null => {
    const cachedCategoriesString = localStorage.getItem(this.CACHE_KEY);
    if (cachedCategoriesString) {
      const cachedCategories: Category[] = JSON.parse(cachedCategoriesString);
      return cachedCategories;
    }
    return null;
  };

  private cacheCategories = (categories: Category[]): void => {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(categories));
    const expirationTime = Date.now() + this.EXPIRATION_TIME;
    localStorage.setItem(
      this.CACHE_KEY + "_expiration",
      expirationTime.toString()
    );
  };

  private areCachedCategoriesExpired = (): boolean => {
    const expirationTime = localStorage.getItem(this.CACHE_KEY + "_expiration");
    if (expirationTime) {
      return Date.now() > parseInt(expirationTime);
    }
    return true;
  };

  public getCategoriesAsync = async (): Promise<Category[]> => {
    try {
      if (!this.areCachedCategoriesExpired()) {
        const cachedCategories = this.getCachedCategories();
        if (cachedCategories) {
          return cachedCategories;
        }
      }

      const response = await axios.get(`${this.url}/categories`);
      const categories: Category[] = response.data;

      this.cacheCategories(categories);

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  public createCategoryAsync = async (category: Category): Promise<void> => {
    await axios.post(`${this.url}/categories`, category);
  };
}
