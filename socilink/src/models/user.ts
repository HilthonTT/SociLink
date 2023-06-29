import { Timestamp } from "firebase/firestore";
import { BasicThread } from "./basicThread";
import { BasicComment } from "./basicComment";

export class User {
  id: string;
  objectIdentifier: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  dateCreated: Timestamp = Timestamp.now();
  authoredThreads: BasicThread[] = [];
  votedOnThreads: BasicThread[] = [];
  authoredComments: BasicComment[] = [];

  constructor(
    id: string,
    objectIdentifier: string,
    firstName: string,
    lastName: string,
    displayName: string,
    email: string
  ) {
    this.id = id;
    this.objectIdentifier = objectIdentifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this.email = email;
  }
}
