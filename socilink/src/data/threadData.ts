import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { LRUCache } from "lru-cache";
import { Thread } from "../models/thread";
import { IUserData, UserData } from "./userData";
import { BasicThread } from "../models/basicThread";

export interface IThreadData {
  collectionName: string;
  getThreadsAsync: () => Promise<Thread[]>;
  getThreadAsync: (id: string) => Promise<Thread>;
  getUserThreadAsync: (userId: string) => Promise<Thread>;
  updateThreadAsync: (thread: Thread) => Promise<void>;
  createThreadAsync: (thread: Thread) => Promise<void>;
  updateVoteThreadAsync: (threadId: string, userId: string) => Promise<void>;
}

export class ThreadData implements IThreadData {
  public readonly collectionName = "threads";

  private readonly cacheName = "ThreadData";
  private readonly cachedTime = 60 * 60 * 1000; // in ms: 1 hour
  private readonly threadCollectionRef = collection(db, this.collectionName);
  private readonly userData: IUserData = new UserData();

  private readonly cacheOptions = {
    ttl: this.cachedTime,
    ttlAutopurge: true,
  };

  private readonly cache = new LRUCache(this.cacheOptions);

  public getThreadsAsync = async (): Promise<Thread[]> => {
    let threads = this.cache.get(this.cacheName) as Thread[];

    if (threads === undefined) {
      const q = query(this.threadCollectionRef, where("archived", "==", false));
      const querySnapshot = await getDocs(q);
      threads = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Thread),
        id: doc.id,
      }));

      this.cache.set(this.cacheName, threads);
    }

    return threads;
  };

  public getThreadAsync = async (id: string): Promise<Thread> => {
    const key = `thread-${id}`;
    let thread = this.cache.get(key) as Thread;

    if (thread === undefined) {
      const threadDoc = doc(db, this.collectionName, id);
      const data = await getDoc(threadDoc);
      thread = data.data() as Thread;

      this.cache.set(key, thread);
    }

    return thread;
  };

  public getUserThreadAsync = async (userId: string): Promise<Thread> => {
    const key = `thread-${userId}`;

    let thread = this.cache.get(key) as Thread;

    if (thread === undefined) {
      const q = query(
        this.threadCollectionRef,
        where("author.id", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty === false) {
        const threadDoc = querySnapshot.docs[0];
        thread = {
          ...(threadDoc.data() as Thread),
          id: threadDoc.id,
        };

        this.cache.set(key, thread);
      }
    }

    return thread;
  };

  public updateThreadAsync = async (thread: Thread): Promise<void> => {
    const threadDoc = doc(db, this.collectionName, thread.id);
    await updateDoc(threadDoc, { thread });
  };

  public createThreadAsync = async (thread: Thread): Promise<void> => {
    try {
      await runTransaction(db, async (transaction) => {
        const threadDocRef = await addDoc(this.threadCollectionRef, {
          ...thread,
        });
        thread.id = threadDocRef.id;

        const user = await this.userData.getUserAsync(thread.author.id);
        user.authoredThreads.push(BasicThread.fromThread(thread));

        const userDocRef = doc(db, this.userData.collectionName, user.id);

        transaction.update(userDocRef, {
          authoredThreads: user.authoredThreads,
        });

        const threadObject = { ...thread };
        await setDoc(doc(db, threadDocRef.path), threadObject);
      });
    } catch (error) {
      throw error;
    }
  };

  public updateVoteThreadAsync = async (
    threadId: string,
    userId: string
  ): Promise<void> => {
    try {
      await runTransaction(db, async (transaction) => {
        const thread = await this.getThreadAsync(threadId);
        const isUpVote = thread.userVotes.includes(userId);

        if (isUpVote) {
          const index = thread.userVotes.indexOf(userId);
          if (index !== -1) {
            thread.userVotes.splice(index, 1);
          }
        }

        const threadDocRef = doc(db, this.collectionName, thread.id);
        await updateDoc(threadDocRef, { ...thread });

        const user = await this.userData.getUserAsync(userId);
        const userDocRef = doc(db, this.userData.collectionName, user.id);

        if (isUpVote) {
          const newThread = BasicThread.fromThread(thread);
          user.votedOnThreads.push(newThread);
        } else {
          const threadToRemove = user.votedOnThreads.find(
            (t) => t.id === threadId
          ) as BasicThread;
          user.votedOnThreads = user.votedOnThreads.filter(
            (t) => t.id !== threadToRemove.id
          );
        }

        transaction.update(userDocRef, {
          votedOnThreads: user.votedOnThreads,
        });
      });
    } catch (error) {
      throw error;
    }
  };
}
