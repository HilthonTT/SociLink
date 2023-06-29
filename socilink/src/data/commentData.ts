import {
  addDoc,
  collection,
  doc,
  getDocs,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { LRUCache } from "lru-cache";
import { db } from "../firebase/firebase";
import { Comment } from "../models/comment";
import { UserData } from "./userData";
import { BasicComment } from "../models/basicComment";

export class CommentData {
  public readonly collectionName = "comments";

  private readonly cachedTime = 60 * 60 * 1000; // in ms: 1 hour
  private readonly commentCollectionRef = collection(db, this.collectionName);
  private readonly userData = new UserData();

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

    if (comments === null) {
      const data = await getDocs(this.commentCollectionRef);
      comments = data.docs.map((doc) => ({
        ...(doc.data() as Comment),
        id: doc.id,
      }));

      this.cache.set(key, comments);
    }

    return comments;
  };

  public updateCommentAsync = async (comment: Comment) => {
    const commentDoc = doc(db, this.collectionName, comment.id);
    await updateDoc(commentDoc, { comment });
  };

  public createCommentAsync = async (comment: Comment) => {
    try {
      await runTransaction(db, async (transaction) => {
        await addDoc(this.commentCollectionRef, comment);

        const user = await this.userData.getUserAsync(comment.author.id);
        user.authoredComments.push(BasicComment.fromComment(comment));

        const userDocRef = doc(db, this.collectionName, user.id);

        transaction.update(userDocRef, { user });
      });
    } catch (error) {
      throw error;
    }
  };
}
