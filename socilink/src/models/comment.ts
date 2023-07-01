import { Timestamp } from "firebase/firestore";
import { BasicUser } from "./basicUser";
import { BasicThread } from "./basicThread";

export class Comment {
  id: string;
  comment: string;
  thread: BasicThread;
  author: BasicUser;
  dateCreated: Timestamp = Timestamp.now();
  archived: boolean = false;

  constructor(comment: string, thread: BasicThread, author: BasicUser) {
    this.id = "";
    this.comment = comment;
    this.thread = thread;
    this.author = author;
  }
}
