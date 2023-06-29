import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { LRUCache } from "lru-cache";
import { Thread } from "../models/thread";
import { UserData } from "./userData";
import { BasicThread } from "../models/basicThread";

export class ThreadData {
  public readonly collectionName = "threads";

  private readonly cacheName = "ThreadData";
  private readonly cachedTime = 60 * 60 * 1000; // in ms: 1 hour
  private readonly threadCollectionRef = collection(db, this.collectionName);
  private readonly userData = new UserData();

  private readonly cacheOptions = {
    ttl: this.cachedTime,
    ttlAutopurge: true,
  };

  private readonly cache = new LRUCache(this.cacheOptions);

  public getThreadsAsync = async (): Promise<Thread[]> => {
    let threads = this.cache.get(this.cacheName) as Thread[];

    if (threads === null) {
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

    if (thread === null) {
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

    if (thread === null) {
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

  public updateThreadAsync = async (thread: Thread) => {
    const threadDoc = doc(db, this.collectionName, thread.id);
    await updateDoc(threadDoc, { thread });
  };

  public createThreadAsync = async (thread: Thread) => {
    try {
      await runTransaction(db, async (transaction) => {
        await addDoc(this.threadCollectionRef, thread);

        const user = await this.userData.getUserAsync(thread.author.id);
        user.authoredThreads.push(BasicThread.fromThread(thread));

        const userDocRef = doc(db, this.collectionName, user.id);

        transaction.update(userDocRef, { user });
      });
    } catch (error) {
      throw error;
    }
  };

  public updateVoteThreadAsync = async (threadId: string, userId: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        const thread = await this.getThreadAsync(threadId);

        const isUpVote = thread.userVotes.has(userId);

        if (isUpVote) {
          thread.userVotes.delete(userId);
        }

        const threadDocRef = doc(db, this.collectionName, thread.id);
        await updateDoc(threadDocRef, { thread });

        const user = await this.userData.getUserAsync(userId);
        const userDocRef = doc(db, this.userData.collectionName);

        if (isUpVote) {
          const newThread = BasicThread.fromThread(thread);
          user.votedOnThreads.push(newThread);
        } else {
          const threadToRemove = user.authoredThreads.find(
            (t) => t.id === threadId
          ) as BasicThread;
          user.authoredThreads = user.authoredThreads.filter(
            (t) => t.id !== threadToRemove.id
          );
        }

        transaction.update(userDocRef, { user });
      });
    } catch (error) {
      throw error;
    }
  };
}