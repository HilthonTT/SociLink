import { User } from "./user";

export class BasicUser {
  id: string;
  displayName: string;

  constructor(id: string, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }

  static fromUser(user: User): BasicUser {
    return {
      id: user.id,
      displayName: user.displayName,
    };
  }
}
