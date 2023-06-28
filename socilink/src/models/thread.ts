import { Timestamp } from "firebase/firestore";
import { BasicUser } from "./basicUser";

export class Thread {
  id: string;
  thread: string;
  description: string;
  dateCreated: Timestamp = Timestamp.now();
  author: BasicUser;
  userVotes: Set<string> = new Set<string>();
  archived: boolean = false;

  constructor(
    id: string,
    thread: string,
    description: string,
    author: BasicUser
  ) {
    this.id = id;
    this.thread = thread;
    this.description = description;
    this.author = author;
  }
}
