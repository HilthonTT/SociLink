import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase";

export interface IImageData {
  uploadAsync: (file: File, fileName: string) => Promise<string>;
  fetchAsync: (fileName: string) => Promise<string>;
}

export class ImageData implements IImageData {
  private readonly CACHE_KEY_PREFIX = "cached_images_";
  private readonly EXPIRATION_TIME = 60 * 60 * 1000; // in ms: 1 hour;

  public uploadAsync = async (
    file: File,
    fileName: string
  ): Promise<string> => {
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  public fetchAsync = async (fileName: string): Promise<string> => {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${fileName}`;

      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { url, timestamp } = JSON.parse(cachedData);
        const currentTime = new Date().getTime();
        if (currentTime - timestamp < this.EXPIRATION_TIME) {
          return url;
        }
      }

      const storageRef = ref(storage, fileName);
      const downloadURL = await getDownloadURL(storageRef);

      const dataToCache = {
        url: downloadURL,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

      return downloadURL;
    } catch (error) {
      console.error(`Error fetching download URL for ${fileName}:`, error);
      throw error;
    }
  };
}
