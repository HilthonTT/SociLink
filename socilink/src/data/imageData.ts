import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { LRUCache } from "lru-cache";

export interface IImageData {
  upload: (file: File, fileName: string) => Promise<string>;
  fetch: (fileName: string) => Promise<string>;
}

export class ImageData implements IImageData {
  private readonly cachedTime = 60 * 60 * 1000; // in ms: 1 hour;

  private readonly cacheOption = {
    ttl: this.cachedTime,
    ttlAutopurge: true,
  };

  private readonly cache = new LRUCache(this.cacheOption);

  public upload = async (file: File, fileName: string): Promise<string> => {
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    this.cache.set(fileName, downloadURL);

    return downloadURL;
  };

  public fetch = async (fileName: string): Promise<string> => {
    let cachedUrl = this.cache.get(fileName) as string;

    if (cachedUrl === undefined) {
      const storageRef = ref(storage, fileName);
      const downloadURL = await getDownloadURL(storageRef);

      cachedUrl = downloadURL;
      this.cache.set(fileName, cachedUrl);
    }

    return cachedUrl;
  };
}