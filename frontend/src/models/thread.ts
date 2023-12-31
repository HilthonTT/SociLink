import { BasicUser } from "./basicUser";
import { Category } from "./category";

export class Thread {
  _id: string;
  thread: string;
  description: string;
  category: Category;
  dateCreated: Date = new Date();
  author: BasicUser;
  downloadUrl: string;
  userVotes: string[] = [];
  archived: boolean = false;

  constructor(
    thread: string,
    description: string,
    category: Category,
    downloadUrl: string,
    author: BasicUser
  ) {
    this._id = "";
    this.thread = thread;
    this.description = description;
    this.category = category;
    this.downloadUrl = downloadUrl;
    this.author = author;
  }
}
