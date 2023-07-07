import {
  addDoc,
  collection,
  doc,
  getDocs,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { LRUCache } from "lru-cache";
import { db } from "../firebase/firebase";
import { Comment } from "../models/comment";
import { IUserData, UserData } from "./userData";
import { BasicComment } from "../models/basicComment";

export interface ICommentData {
  collectionName: string;
  getThreadCommentsAsync: (threadId: string) => Promise<Comment[]>;
  updateCommentAsync: (comment: Comment) => Promise<void>;
  createCommentAsync: (comment: Comment) => Promise<void>;
}

export class CommentData implements ICommentData {
  public readonly collectionName = "comments";

  private readonly cachedTime = 60 * 60 * 1000; // in ms: 1 hour
  private readonly commentCollectionRef = collection(db, this.collectionName);
  private readonly userData: IUserData = new UserData();

  private readonly cacheOptions = {
    ttl: this.cachedTime,
    ttlAutopurge: true,
  };

  private readonly cache = new LRUCache(this.cacheOptions);

  public getThreadCommentsAsync = async (
    threadId: string
  ): Promise<Comment[]> => {
    const key = `comment-${threadId}`;

    let comments = this.cache.get(key) as Comment[];

    if (comments === undefined || comments === null) {
      const data = await getDocs(this.commentCollectionRef);
      comments = data.docs.map((doc) => ({
        ...(doc.data() as Comment),
        id: doc.id,
      }));

      this.cache.set(key, comments);
    }

    return comments;
  };

  public updateCommentAsync = async (comment: Comment): Promise<void> => {
    const commentDoc = doc(db, this.collectionName, comment.id);
    await updateDoc(commentDoc, { comment });
  };

  public createCommentAsync = async (comment: Comment): Promise<void> => {
    try {
      await runTransaction(db, async (transaction) => {
        const commentDocRef = await addDoc(this.commentCollectionRef, {
          ...comment,
        });
        comment.id = commentDocRef.id;

        const user = await this.userData.getUserAsync(comment.author.id);
        user.authoredComments.push(BasicComment.fromComment(comment));

        const userDocRef = doc(db, this.userData.collectionName, user.id);

        transaction.update(userDocRef, {
          authoredComments: user.authoredComments,
        });

        const commentObject = { ...comment };
        await setDoc(doc(db, commentDocRef.path), commentObject);
      });
    } catch (error) {
      throw error;
    }
  };
}
