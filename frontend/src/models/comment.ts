import { BasicUser } from "./basicUser";
import { BasicThread } from "./basicThread";

export class Comment {
  _id: string;
  comment: string;
  thread: BasicThread;
  author: BasicUser;
  dateCreated: Date = new Date();
  archived: boolean = false;

  constructor(comment: string, thread: BasicThread, author: BasicUser) {
    this._id = "";
    this.comment = comment;
    this.thread = thread;
    this.author = author;
  }
}
