import { Timestamp } from "firebase/firestore";
import { BasicUser } from "./basicUser";

export class Thread {
  id: string;
  thread: string;
  description: string;
  dateCreated: Timestamp = Timestamp.now();
  author: BasicUser;
  downloadUrl: string;
  userVotes: Set<string> = new Set<string>();
  archived: boolean = false;

  constructor(
    id: string,
    thread: string,
    description: string,
    downloadUrl: string,
    author: BasicUser
  ) {
    this.id = id;
    this.thread = thread;
    this.description = description;
    this.downloadUrl = downloadUrl;
    this.author = author;
  }
}
