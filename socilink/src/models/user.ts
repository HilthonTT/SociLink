import { Timestamp } from "firebase/firestore";
import { BasicThread } from "./basicThread";

export class User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  dateCreated: Timestamp = Timestamp.now();
  authoredThreads: BasicThread[] = [];
  votedOnThreads: BasicThread[] = [];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    displayName: string,
    email: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this.email = email;
  }
}
