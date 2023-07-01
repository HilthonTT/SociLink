import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { User } from "../models/user";
import { LRUCache } from "lru-cache";

export interface IUserData {
  collectionName: string;
  getUsersAsync: () => Promise<User[]>;
  getUserAsync: (id: string) => Promise<User>;
  getUserFromAuth: (objectId: string) => Promise<User>;
  createUserAsync: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export class UserData implements IUserData {
  public readonly collectionName = "users";

  private readonly cacheName = "UserData";
  private readonly cachedTime = 60 * 60 * 1000; // in ms: 1 hour
  private readonly userCollectionRef = collection(db, this.collectionName);

  private readonly cacheOptions = {
    ttl: this.cachedTime,
    ttlAutopurge: true,
  };

  private readonly cache = new LRUCache(this.cacheOptions);

  public getUsersAsync = async (): Promise<User[]> => {
    let users = this.cache.get(this.cacheName) as User[];

    if (users === undefined) {
      const data = await getDocs(this.userCollectionRef);
      users = data.docs.map((doc) => ({
        ...(doc.data() as User),
        id: doc.id,
      }));

      this.cache.set(this.cacheName, users);
    }

    return users;
  };

  public getUserAsync = async (id: string): Promise<User> => {
    const key = `user-${id}`;
    let user = this.cache.get(key) as User;

    if (user === undefined) {
      const userDoc = doc(db, this.collectionName, id);
      const data = await getDoc(userDoc);
      user = data.data() as User;

      this.cache.set(key, user);
    }

    return user;
  };

  getUserFromAuth = async (objectId: string): Promise<User> => {
    const key = `user-${objectId}`;
    let user = this.cache.get(key) as User;

    if (user === undefined) {
      const q = query(
        this.userCollectionRef,
        where("objectIdentifier", "==", objectId)
      );
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (userDoc) {
        const userData = userDoc.data() as User;
        user = {
          ...userData,
        };

        this.cache.set(key, user);
      }
    }

    return user;
  };

  public createUserAsync = async (user: User): Promise<void> => {
    const docRef = await addDoc(this.userCollectionRef, { ...user });
    user.id = docRef.id;
    const userObject = { ...user };
    await setDoc(doc(db, docRef.path), userObject);
  };

  public updateUser = async (user: User): Promise<void> => {
    const userDoc = doc(db, this.collectionName, user.id);
    await updateDoc(userDoc, { user });
  };
}
