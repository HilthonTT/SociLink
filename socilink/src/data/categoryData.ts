import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { LRUCache } from "lru-cache";
import { Category } from "../models/category";

export class CategoryData {
  private readonly cacheName = "categoryData";
  private readonly collectionName = "categories";
  private readonly cachedTime = 60 * 60 * 1000; // in milliseconds: 1 hour;
  private readonly categoryCollectionRef = collection(db, this.collectionName);

  private readonly cacheOption = {
    ttl: this.cachedTime,
    ttlAutopurge: true,
  };

  private readonly cache = new LRUCache(this.cacheOption);

  public getCategoriesAsync = async (): Promise<Category[]> => {
    let categories = this.cache.get(this.cacheName) as Category[];

    if (categories === null) {
      const data = await getDocs(this.categoryCollectionRef);
      categories = data.docs.map((doc) => ({
        ...(doc.data() as Category),
        id: doc.id,
      }));

      this.cache.set(this.cacheName, categories);
    }

    return categories;
  };

  public createCategoryAsync = async (category: Category) => {
    await addDoc(this.categoryCollectionRef, category);
  };
}
